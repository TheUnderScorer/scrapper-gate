import { EntityRepository, Repository } from 'typeorm';
import { FileModel } from '../models/File.model';

@EntityRepository(FileModel)
export class FileRepository extends Repository<FileModel> {}
