import { asDisposable, asDisposableValue } from '@scrapper-gate/backend/awilix';
import {
  createS3Client,
  setupAwsContainer,
  SqsMessageQueueClient,
} from '@scrapper-gate/backend/aws';
import { makeRepositoriesProviderFromDefinitions } from '@scrapper-gate/backend/database';
import { FilesService } from '@scrapper-gate/backend/domain/files';
import { MessageQueueService } from '@scrapper-gate/backend/domain/message-queue-service';
import {
  HandleFailedScrapperRunStartCommand,
  makeGetScrapperRunner,
  RunScrapperCommand,
} from '@scrapper-gate/backend/domain/scrapper';
import { Message, MessageQueue } from '@scrapper-gate/backend/message-queue';
import { UnitOfWork } from '@scrapper-gate/backend/unit-of-work';
import { getEnvironment } from '@scrapper-gate/shared/common';
import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import { Logger } from '@scrapper-gate/shared/logger';
import { logger } from '@scrapper-gate/shared/logger/console';
import { BrowserType } from '@scrapper-gate/shared/schema';
import { ScrapperRunnerMessageDto } from '@scrapper-gate/shared/validation';
import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
} from 'awilix';
import type { SQSEvent } from 'aws-lambda';
import awsChromeLambda from 'chrome-aws-lambda';
import pLimit from 'p-limit';
import { chromium } from 'playwright-core';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { v4 } from 'uuid';
import { registerScrapperRunnerCqrs, ScrapperRunnerCqrs } from './cqrs';
import { entityDefinitions } from './entityDefinitions';

let container: AwilixContainer;

export const scrapperRunner = async (
  event: SQSEvent,
  connection?: Connection
) => {
  const limit = pLimit(5);

  await bootstrap(connection);

  const unitOfWork =
    container.resolve<UnitOfWork<ScrapperRunnerCqrs>>('unitOfWork');
  const logger = container.resolve<Logger>('logger');

  logger.info(`Received event: ${JSON.stringify(event)}`);

  try {
    await Promise.all(
      event.Records.map((record) =>
        limit(async () => {
          const body = JSON.parse(
            record.body
          ) as Message<ScrapperRunnerMessagePayload>;

          try {
            const message = ScrapperRunnerMessageDto.validate(body.payload);

            await unitOfWork.run(
              (ctx) => {
                // Maintain traceId
                ctx.container.register({
                  traceId: asValue(body.traceId),
                });

                return ctx.commandsBus.execute(new RunScrapperCommand(message));
              },
              {
                runInTransaction: false,
              }
            );
          } catch (error) {
            logger.error(`Scrapper runner error: ${error.message}`);

            if (body?.payload?.runId) {
              await unitOfWork.run((ctx) =>
                ctx.commandsBus.execute(
                  new HandleFailedScrapperRunStartCommand({
                    runId: body.payload.runId,
                  })
                )
              );
            }
          }
        })
      )
    );
  } finally {
    await cleanup();
  }
};

const cleanup = async () => {
  if (!container) {
    return;
  }

  await container.dispose();
};

const bootstrap = async (dbConnection?: Connection) => {
  if (!container) {
    const executablePath = await awsChromeLambda.executablePath;
    const browser = await chromium.launch({
      headless: true,
      executablePath: executablePath ?? undefined,
      args: awsChromeLambda.args,
    });

    const connectionProvided = Boolean(dbConnection);

    const connection =
      dbConnection instanceof Connection
        ? dbConnection
        : await createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            entities: entityDefinitions.map((entity) => entity.model),
            type: 'postgres',
            synchronize: false,
          });

    await connection.query('SELECT 1+1');

    container = createContainer();

    setupAwsContainer(container);

    container.register({
      container: asValue(container),
      environment: asValue(getEnvironment()),
      s3: asFunction(createS3Client).singleton(),
      unitOfWork: asDisposable(asClass(UnitOfWork).singleton()),
      browser: asDisposableValue(browser, (browser) => browser.close()),
      connection: connectionProvided
        ? asValue(connection)
        : asDisposableValue(connection, (connection) => connection.close()),
      logger: asValue(logger),
      browserType: asValue(BrowserType.Chrome),
      getScrapperRunner: asFunction(makeGetScrapperRunner).scoped(),
      messageQueue: asClass(MessageQueue).scoped(),
      messageQueueClient: asClass(SqsMessageQueueClient).singleton(),
      traceId: asFunction(() => v4()),
      messageQueueService: asClass(MessageQueueService),
      filesService: asClass(FilesService).scoped(),
      repositoriesProvider: asValue(
        makeRepositoriesProviderFromDefinitions(entityDefinitions)
      ),
    });

    container.resolve('configureAws');

    registerScrapperRunnerCqrs(container);
  }

  return container;
};
