import { Query } from 'functional-cqrs';
import { FileModel } from '../models/File.model';

export interface GetFileUrlPayload {
  file: FileModel;
}

export const GetFileUrl = 'GetFileUrl' as const;

export class GetFileUrlQuery implements Query {
  readonly name = GetFileUrl;

  constructor(public readonly payload: GetFileUrlPayload) {}
}
