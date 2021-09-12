import { Event } from 'functional-cqrs';
import { FileModel } from '../models/File.model';

export type FileUploadedEventPayload = Pick<
  FileModel,
  'key' | 'mimeType' | 'type' | 'id'
>;

export class FileUploadedEvent implements Event {
  constructor(public readonly payload: FileUploadedEventPayload) {}
}
