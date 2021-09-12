import { FileAccess } from '@scrapper-gate/shared/schema';
import { FilesService } from '../Files.service';
import { GetFileUrlQuery } from '../queries/GetFileUrl.query';

export interface GetFileUrlHandlerDependencies {
  filesService: FilesService;
  fileBaseUrl: string;
}

export const getFileUrlHandler =
  ({ filesService, fileBaseUrl }: GetFileUrlHandlerDependencies) =>
  async ({ payload: { file } }: GetFileUrlQuery) => {
    if (file.access === FileAccess.Public) {
      return file.getUrl(fileBaseUrl);
    }

    return filesService.getSignedUrl(file.key, file.type);
  };
