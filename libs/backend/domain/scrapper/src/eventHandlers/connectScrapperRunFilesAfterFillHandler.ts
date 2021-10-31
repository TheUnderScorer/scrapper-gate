import { FileRepository } from '@scrapper-gate/backend/domain/files';
import { ExcludeFalsy, getById } from '@scrapper-gate/shared/common';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { ScrapperStepResultFilledAfterRunEvent } from '../events/ScrapperStepResultFilledAfterRun.event';

export interface ConnectScrapperRunFilesAfterFillHandlerDependencies {
  fileRepository: FileRepository;
}

export const connectScrapperRunFilesAfterFillHandler =
  ({ fileRepository }: ConnectScrapperRunFilesAfterFillHandlerDependencies) =>
  async ({
    payload: { runStepResult, result },
  }: Readonly<ScrapperStepResultFilledAfterRunEvent>) => {
    if (result.step.action !== ScrapperAction.Screenshot) {
      return;
    }

    if ('values' in runStepResult) {
      const fileIds = runStepResult.values
        ?.map((item) =>
          'screenshotFileId' in item ? item.screenshotFileId : undefined
        )
        .filter(ExcludeFalsy);

      if (!fileIds?.length) {
        return;
      }

      const files = await fileRepository.findByIds(fileIds);

      result.values?.forEach((value, index) => {
        const fileId = fileIds[index];

        if (fileId) {
          value.screenshot = getById(files, fileId);
        }
      });
    }
  };
