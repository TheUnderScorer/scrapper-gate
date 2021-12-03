import { StartScrapperInput } from '@scrapper-gate/shared/schema';
import joi from 'joi';

export const StartScrapperInputSchema = joi.object<StartScrapperInput>({});
