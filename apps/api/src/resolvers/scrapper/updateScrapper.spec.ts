import {
  ScrapperModel,
  ScrapperRepository,
  ScrapperStepModel,
} from '@scrapper-gate/backend/domain/scrapper';
import { VariableModel } from '@scrapper-gate/backend/domain/variables';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import { getById } from '@scrapper-gate/shared/common';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import {
  MouseButton,
  ScrapperAction,
  ScrapperInput,
  VariableInput,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import faker from 'faker';
import gql from 'graphql-tag';
import { v4 as uuid } from 'uuid';
import { createScrapper } from '../../tests/createScrapper';
import { createUser } from '../../tests/createUser';
import '../../typings/global';

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
        name: 'test',
        steps: [
          {
            id: firstStepId,
            action: ScrapperAction.Click,
            url: faker.internet.url(),
            key: 'test',
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
            url: faker.internet.url(),
            key: 'test1',
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

  const firstStep = updatedScrapper.steps?.find((step) =>
    Boolean(step.nextStep)
  );

  expect(firstStep).toBeDefined();

  const nextStep = getById(
    updatedScrapper.steps ?? [],
    firstStep!.nextStep!.id
  );

  expect(nextStep?.nextStep).toBeNull();
};

describe('Update scrapper', () => {
  let scrapperRepository: ScrapperRepository;

  beforeEach(() => {
    scrapperRepository =
      global.connection.getCustomRepository(ScrapperRepository);
  });

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

  it('should disallow sending global variables', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    const variables: VariableInput[] = [
      {
        key: 'test_create',
        value: 'test',
        defaultValue: 'default',
        scope: VariableScope.Global,
        type: VariableType.Text,
      },
    ];

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
          variables,
        },
      }),
    });

    const body = JSON.parse(response.body);

    expect(body.errors).toBeDefined();
    expect(body.errors[0].message).toEqual(
      '"variables[0].scope" must be [Scrapper]'
    );
  });

  it('should create, update and delete variables', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    const existingVariable = VariableModel.create({
      key: 'existing',
      scope: VariableScope.Scrapper,
      type: VariableType.Text,
    });
    const toRemoveVariable = VariableModel.create({
      key: 'toRemove',
      scope: VariableScope.Scrapper,
      type: VariableType.Text,
    });

    scrapper.variables = [existingVariable, toRemoveVariable];

    await global.connection.getRepository(ScrapperModel).save(scrapper);

    const variables: VariableInput[] = [
      {
        key: 'test_create',
        value: 'test',
        defaultValue: 'default',
        scope: VariableScope.Scrapper,
        type: VariableType.Text,
      },
      {
        id: existingVariable.id,
        key: existingVariable.key,
        value: 'value update',
        scope: VariableScope.Scrapper,
        type: VariableType.Text,
      },
    ];

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
          variables,
        },
      }),
    });

    const updatedScrapper = await global.connection
      .getRepository(ScrapperModel)
      .findOneOrFail(scrapper.id, {
        relations: ['variables'],
      });

    expect(updatedScrapper.variables).toHaveLength(2);
    expect(
      getById(updatedScrapper.variables ?? [], existingVariable.id)?.value
    ).toEqual('value update');
    expect(
      updatedScrapper.variables?.find(
        (variable) => variable.key === 'test_create'
      )
    ).toBeDefined();
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

  it('should detach deleted step from related steps', async () => {
    const {
      tokens: { accessToken },
    } = await createUser();

    const scrapper = await createScrapper(accessToken);

    const firstStep = ScrapperStepModel.create({
      ...(await createMockScrapperStep({
        createdBy: scrapper.createdBy,
      })),
    });

    const secondStep = ScrapperStepModel.create({
      ...(await createMockScrapperStep({
        createdBy: scrapper.createdBy,
      })),
    });

    firstStep.nextStep = secondStep;

    scrapper.steps = [firstStep, secondStep];

    await scrapperRepository.save(scrapper);

    const response = await global.server.inject({
      method: 'POST',
      path: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<{ input: ScrapperInput }>(mutation, {
        input: {
          id: scrapper.id,
          name: 'test',
          steps: [
            {
              id: secondStep.id,
              key: 'test',
              action: ScrapperAction.Condition,
              url: faker.internet.url(),
              clickTimes: 1,
              mouseButton: MouseButton.Left,
              position: {
                x: 0,
                y: 0,
              },
            },
          ],
        },
      }),
    });

    const body = JSON.parse(response.body);

    expect(body.data.updateScrapper.steps).toHaveLength(1);
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
          name: 'test',
          steps: [
            {
              id: firstStepId,
              key: 'condition',
              action: ScrapperAction.Condition,
              stepIdOnTrue: trueStepId,
              stepIdOnFalse: falseStepId,
              clickTimes: 1,
              mouseButton: MouseButton.Left,
              url: faker.internet.url(),
              position: {
                x: 0,
                y: 0,
              },
            },
            {
              key: 'true',
              id: trueStepId,
              action: ScrapperAction.ReadText,
              useUrlFromPreviousStep: true,
              position: {
                x: 250,
                y: 0,
              },
            },
            {
              key: 'false',
              id: falseStepId,
              action: ScrapperAction.Click,
              url: faker.internet.url(),
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

    const firstStep = updatedScrapper.steps?.find(
      (step) => step.action === ScrapperAction.Condition
    );

    expect(firstStep?.stepOnTrue).toBeDefined();
    expect(firstStep?.stepOnFalse).toBeDefined();

    expect(firstStep?.stepOnTrue?.action).toEqual(ScrapperAction.ReadText);
    expect(firstStep?.stepOnFalse?.action).toEqual(ScrapperAction.Click);
  });
});
