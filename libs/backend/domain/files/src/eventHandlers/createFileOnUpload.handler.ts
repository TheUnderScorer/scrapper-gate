import { FileUploadedEvent } from '../events/FileUploaded.event';
import { fileTypeAccessMap } from '../fileTypeAccessMap';
import { FileModel } from '../models/File.model';
import { FileRepository } from '../repositories/File.repository';

export interface CreateFileOnUploadHandlerDependencies {
  fileRepository: FileRepository;
}

export const createFileOnUploadHandler =
  ({ fileRepository }: CreateFileOnUploadHandlerDependencies) =>
  async (event: Readonly<FileUploadedEvent>) => {
    const file = FileModel.create({
      ...event.payload,
      access: fileTypeAccessMap[event.payload.type],
    });

    await fileRepository.save(file);
  };
