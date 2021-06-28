import { RunnerTrigger } from '@scrapper-gate/shared/schema';

export interface ScrapperRunnerMessagePayload {
  scrapperId: string;
  trigger: RunnerTrigger;
}
