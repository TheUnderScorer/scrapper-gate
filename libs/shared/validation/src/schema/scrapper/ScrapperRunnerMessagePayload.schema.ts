import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import { RunnerTrigger } from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { enumField } from '../../modifiers/enum';
import { uuid } from '../../modifiers/uuid';
import { ScrapperRunSettingsInputSchema } from './ScrapperRunSettingsInput.schema';

export const ScrapperRunnerMessagePayloadSchema =
  joi.object<ScrapperRunnerMessagePayload>({
    runId: uuid().required(),
    trigger: enumField(RunnerTrigger).required(),
    runSettings: ScrapperRunSettingsInputSchema,
  });
