import { createFileOnUploadHandler } from './eventHandlers/createFileOnUpload.handler';
import { FileUploadedEvent } from './events/FileUploaded.event';
import { GetFileUrl } from './queries/GetFileUrl.query';
import { getFileUrlHandler } from './queryHandlers/getFileUrl.handler';

export const cqrs = {
  eventHandlers: {
    [FileUploadedEvent.name]: [createFileOnUploadHandler],
  },
  queryHandlers: {
    [GetFileUrl]: getFileUrlHandler,
  },
};
