import gql from 'graphql-tag';
import { createUser } from '../../tests/createUser';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import {
  MouseButton,
  ScrapperAction,
  ScrapperInput,
} from '@scrapper-gate/shared/schema';
import { createScrapper } from '../../tests/createScrapper';
import { ScrapperModel } from '@scrapper-gate/backend/domain/scrapper';
import { v4 as uuid } from 'uuid';
import { getById } from '@scrapper-gate/shared/common';

const mutation = gql`
  mutation UpdateScrapper($input: ScrapperInput!) {
    updateScrapper(input: $input) {
      id
      name
      steps {
        id
      }
    }
  }
`;

const name = 'New scrapper name';

const updateSteps = async (accessToken: string, scrapper: ScrapperModel) => {
  const id = uuid();

  const firstStepId = uuid();
  const response = await global.server.inject({
    method: 'POST',
    path: apiRoutes.graphql,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    payload: makeGraphqlRequest<{ input: ScrapperInput }>(mutation, {
      input: {
        id: scrapper.id,
        steps: [
          {
            id: firstStepId,
            action: ScrapperAction.Click,
            clickTimes: 1,
            mouseButton: MouseButton.Left,
            nextStepId: id,
            position: {
              x: 0,
              y: 0,
            },
          },
          {
            id,
            action: ScrapperAction.ReadText,
            position: {
              x: 250,
              y: 0,
            },
          },
        ],
      },
    }),
  });
  const body = JSON.parse(response.body);

  expect(body.data.updateScrapper.steps).toHaveLength(2);

  const updatedScrapper = await global.connection
    .getRepository(ScrapperModel)
    .findOneOrFail(scrapper.id, {
      relations: ['steps', 'steps.nextStep'],
    });

  expect(updatedScrapper.steps).toHaveLength(2);

  const firstStep = updatedScrapper.steps.find((step) =>
    Boolean(step.nextStep)
  );

  expect(firstStep).toBeDefined();

  const nextStep = getById(updatedScrapper.steps, firstStep.nextStep.id);

  expect(nextStep.nextStep).toBeNull();
};

describe('Update scrapper', () => {
  it('should update scrapper name', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    const response = await global.server.inject({
      method: 'POST',
      path: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<{ input: ScrapperInput }>(mutation, {
        input: {
          name,
          id: scrapper.id,
        },
      }),
    });

    const body = JSON.parse(response.body);

    expect(body.data.updateScrapper.name).toEqual(name);

    const updatedScrapper = await global.connection
      .getRepository(ScrapperModel)
      .findOneOrFail(scrapper.id);

    expect(updatedScrapper.name).toEqual(name);
  });

  it('should update scrapper steps', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    await updateSteps(accessToken, scrapper);
  });

  it('should overwrite old steps', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    await updateSteps(accessToken, scrapper);
    await updateSteps(accessToken, scrapper);
  });

  it('should not overwrite steps if only name is provided', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    await updateSteps(accessToken, scrapper);

    await global.server.inject({
      method: 'POST',
      path: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<{ input: ScrapperInput }>(mutation, {
        input: {
          name,
          id: scrapper.id,
        },
      }),
    });

    const updatedScrapper = await global.connection
      .getRepository(ScrapperModel)
      .findOneOrFail(scrapper.id, {
        relations: ['steps'],
      });

    expect(updatedScrapper.name).toEqual(name);
    expect(updatedScrapper.steps).toHaveLength(2);
  });

  it('should handle conditional steps', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    const firstStepId = uuid();
    const trueStepId = uuid();
    const falseStepId = uuid();

    const response = await global.server.inject({
      method: 'POST',
      path: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<{ input: ScrapperInput }>(mutation, {
        input: {
          id: scrapper.id,
          steps: [
            {
              id: firstStepId,
              action: ScrapperAction.Condition,
              stepIdOnTrue: trueStepId,
              stepIdOnFalse: falseStepId,
              clickTimes: 1,
              mouseButton: MouseButton.Left,
              position: {
                x: 0,
                y: 0,
              },
            },
            {
              key: 'true',
              id: trueStepId,
              action: ScrapperAction.ReadText,
              position: {
                x: 250,
                y: 0,
              },
            },
            {
              key: 'false',
              id: falseStepId,
              action: ScrapperAction.Click,
              position: {
                x: -250,
                y: 0,
              },
            },
          ],
        },
      }),
    });
    const body = JSON.parse(response.body);

    expect(body.data.updateScrapper.steps).toHaveLength(3);

    const updatedScrapper = await global.connection
      .getRepository(ScrapperModel)
      .findOneOrFail(scrapper.id, {
        relations: [
          'steps',
          'steps.nextStep',
          'steps.stepOnTrue',
          'steps.stepOnFalse',
        ],
      });

    const firstStep = updatedScrapper.steps.find(
      (step) => step.action === ScrapperAction.Condition
    );

    expect(firstStep.stepOnTrue).toBeDefined();
    expect(firstStep.stepOnFalse).toBeDefined();

    expect(firstStep.stepOnTrue.action).toEqual(ScrapperAction.ReadText);
    expect(firstStep.stepOnFalse.action).toEqual(ScrapperAction.Click);
  });
});
