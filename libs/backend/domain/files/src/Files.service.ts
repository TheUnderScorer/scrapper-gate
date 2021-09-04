import { Environment } from '@scrapper-gate/shared/common';
import { FileType } from '@scrapper-gate/shared/schema';
import { S3 } from 'aws-sdk';
import { EventsBus } from 'functional-cqrs';
import { v4 } from 'uuid';
import { FileUploadedEvent } from './events/FileUploaded.event';
import { getMimeType } from './getMimeType';
import { UploadFile } from './types';

export interface FilesServiceDependencies {
  s3: S3;
  fileBaseUrl: string;
  eventsBus: EventsBus;
  environment: Environment;
}

export class FilesService {
  private static bucketMap = {
    [FileType.ScrapperScreenshot]: 'scrapper-screenshots',
  };

  constructor(private readonly dependencies: FilesServiceDependencies) {}

  async upload(file: UploadFile, key: string, type: FileType) {
    const fileId = v4();

    const mimeType = await getMimeType(file);

    if (!mimeType?.mime) {
      throw new Error('Failed to detect mime type.');
    }

    await this.dependencies.s3
      .upload({
        Body: file,
        Bucket: this.getBucket(type),
        Key: key,
      })
      .promise();

    await this.dependencies.eventsBus.dispatch(
      new FileUploadedEvent({
        id: fileId,
        type,
        key,
        mimeType: mimeType.mime,
      })
    );

    return fileId;
  }

  getSignedUrl(key: string, type: FileType) {
    return this.dependencies.s3.getSignedUrl('getObject', {
      Bucket: this.getBucket(type),
      Key: key,
    });
  }

  async get(key: string, type: FileType) {
    const response = await this.dependencies.s3
      .getObject({
        Key: key,
        Bucket: this.getBucket(type),
      })
      .promise();

    return response.Body;
  }

  private getBucket(fileType: FileType) {
    return `${this.dependencies.environment.toLowerCase()}-${
      FilesService.bucketMap[fileType]
    }`;
  }
}
