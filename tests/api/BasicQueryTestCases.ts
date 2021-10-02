import { BaseModel } from '@scrapper-gate/backend/base-model';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { makeGraphqlRequest } from '@scrapper-gate/backend/server';
import { getById, wait } from '@scrapper-gate/shared/common';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import {
  AuthTokens,
  BaseEntity,
  BaseQueryVariables,
  OrderDirection,
} from '@scrapper-gate/shared/schema';
import { FastifyInstance } from 'fastify';
import { DocumentNode } from 'graphql';

export interface QueryBasicTestCaseParams<T> {
  query: DocumentNode;
  createEntity: (token: string, user: UserModel) => Promise<T>;
  createUser: () => Promise<{ tokens: AuthTokens; user: UserModel }>;
  server: FastifyInstance;
  queryDataKey: string;
}

export class BasicQueryTestCases<T extends BaseModel<unknown>> {
  private query: DocumentNode;

  private createEntity: (token: string, user: UserModel) => Promise<T>;

  private createUser: () => Promise<{ tokens: AuthTokens; user: UserModel }>;

  private server: FastifyInstance;

  private queryDataKey: string;

  constructor({
    createEntity,
    query,
    createUser,
    server,
    queryDataKey,
  }: QueryBasicTestCaseParams<T>) {
    this.query = query;
    this.createEntity = createEntity;
    this.createUser = createUser;
    this.server = server;
    this.queryDataKey = queryDataKey;
  }

  async paginationTest() {
    const { queryDataKey, query, createUser, createEntity, server } = this;

    const {
      tokens: { accessToken },
      user,
    } = await createUser();

    await Promise.all([
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
    ]);

    const firstResponse = await server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(query, {
        pagination: {
          skip: 0,
          take: 3,
        },
      }),
    });

    const secondResponse = await server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(query, {
        pagination: {
          skip: 3,
          take: 3,
        },
      }),
    });

    const firstBody = JSON.parse(firstResponse.body);
    const secondBody = JSON.parse(secondResponse.body);

    expect(firstBody.data[queryDataKey].items).toHaveLength(3);
    expect(secondBody.data[queryDataKey].items).toHaveLength(1);
  }

  async sortingTest(key: keyof T) {
    const { queryDataKey, query, server, createEntity, createUser } = this;

    const {
      tokens: { accessToken },
      user,
    } = await createUser();

    await Promise.all([
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
    ]);

    await wait(250);

    const lastEntity = await createEntity(accessToken!, user);

    const response = await server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(query, {
        order: {
          direction: OrderDirection.Desc,
          column: key.toString(),
        },
      }),
    });

    const body = JSON.parse(response.body);

    expect(body.data[queryDataKey].items[0].id).toEqual(lastEntity.id);
  }

  async returnAllForUserTest() {
    const { createEntity, createUser, query, server, queryDataKey } = this;

    const {
      tokens: { accessToken },
      user,
    } = await createUser();

    const {
      tokens: { accessToken: secondUserToken },
      user: secondUser,
    } = await createUser();

    const createdEntities = await Promise.all([
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
      createEntity(accessToken!, user),
    ]);

    await createEntity(secondUserToken!, secondUser);

    const response = await server.inject({
      method: 'POST',
      url: apiRoutes.graphql,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: makeGraphqlRequest<BaseQueryVariables>(query, {}),
    });

    const body = JSON.parse(response.body);

    expect(body.data[queryDataKey].total).toEqual(4);

    const entityIds = (body.data[queryDataKey].items as BaseEntity[]).map(
      (entity) => entity.id
    );

    entityIds.forEach((id) => {
      const foundEntity = getById(createdEntities, id);

      expect(foundEntity).toBeDefined();
    });
  }
}
