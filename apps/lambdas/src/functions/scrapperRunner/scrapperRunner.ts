import {
  makeGetScrapperRunner,
  RunScrapperCommand,
} from '@scrapper-gate/backend/domain/scrapper';
import { Message } from '@scrapper-gate/backend/message-queue';
import { UnitOfWork } from '@scrapper-gate/backend/unit-of-work';
import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import { logger } from '@scrapper-gate/shared/logger/console';
import { ScrapperRunnerMessageDto } from '@scrapper-gate/shared/validation';
import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
} from 'awilix';
import type { SQSEvent } from 'aws-lambda';
import awsLambda from 'playwright-aws-lambda';
import { createConnection } from 'typeorm';
import { ScrapperRunnerCqrs } from './cqrs';
import { entityDefinitions } from './entityDefinitions';
import pLimit from 'p-limit';

let container: AwilixContainer;

export const scrapperRunner = async (event: SQSEvent) => {
  console.log('Received message');
  console.log(event);

  const limit = pLimit(5);

  await bootstrap();

  const unitOfWork = container.resolve<UnitOfWork<ScrapperRunnerCqrs>>(
    'unitOfWork'
  );

  await Promise.all(
    event.Records.map((record) =>
      limit(async () => {
        const body = JSON.parse(
          record.body
        ) as Message<ScrapperRunnerMessagePayload>;
        const message = ScrapperRunnerMessageDto.validate(body.payload);

        await unitOfWork.run((ctx) =>
          ctx.commandsBus.execute(new RunScrapperCommand(message))
        );
      })
    )
  );
};

const bootstrap = async () => {
  if (!container) {
    const browser = await awsLambda.launchChromium();
    const connection = await createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: entityDefinitions.map((entity) => entity.model),
      type: 'postgres',
    });

    container = createContainer();

    container.register({
      container: asValue(container),
      unitOfWork: asClass(UnitOfWork).singleton(),
      browser: asValue(browser),
      connection: asValue(connection),
      logger: asValue(logger),
      getScrapperRunner: asFunction(makeGetScrapperRunner).scoped(),
    });
  }

  return container;
};
