import { FileModel } from '@scrapper-gate/backend/domain/files';
import {
  ScrapperModel,
  ScrapperStepModel,
} from '@scrapper-gate/backend/domain/scrapper';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { VariableModel } from '@scrapper-gate/backend/domain/variables';
import { Constructor } from '@scrapper-gate/shared/constructor';
import { snakeCase } from 'lodash';
import { Connection, createConnection } from 'typeorm';
import { ScrapperRunModel } from '../libs/backend/domain/scrapper/src/models/ScrapperRun.model';
import { ScrapperRunStepResultModel } from '../libs/backend/domain/scrapper/src/models/ScrapperRunStepResult.model';
import { ScrapperRunStepValueModel } from '../libs/backend/domain/scrapper/src/models/ScrapperRunStepValue.model';
import '../typings/global';

const entities = [
  UserModel,
  ScrapperModel,
  ScrapperStepModel,
  ScrapperRunModel,
  ScrapperRunStepResultModel,
  ScrapperRunStepValueModel,
  VariableModel,
  FileModel,
];

let rootConnection: Connection;

export const createTestDatabase = async (
  name: string,
  entities: Constructor<unknown>[]
): Promise<Connection> => {
  const result = await rootConnection.query(
    `SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '${name}');`
  );

  if (!result[0].exists) {
    await rootConnection.query(`CREATE DATABASE ${name}`);
  }

  return createConnection({
    host: process.env.DB_HOST,
    database: name,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // TODO Migrations setup
    synchronize: true,
    entities,
    type: 'postgres',
    name,
  });
};

beforeEach(async () => {
  if (!rootConnection) {
    rootConnection = await createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // TODO Migrations setup
      synchronize: true,
      entities,
      type: 'postgres',
    });
  }

  const dbName = snakeCase(expect.getState().currentTestName);

  global.connection = await createTestDatabase(dbName, entities);
});

afterEach(async () => {
  if (global.connection) {
    await global.connection.dropDatabase();
    await global.connection.close();
  }
});

afterAll(async () => {
  if (rootConnection) {
    await rootConnection.close();
  }
});
