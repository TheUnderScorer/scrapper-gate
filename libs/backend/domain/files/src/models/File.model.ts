import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities, last } from '@scrapper-gate/shared/common';
import {
  File,
  FileAccess,
  FileKind,
  FileType,
} from '@scrapper-gate/shared/schema';
import { Column, Entity } from 'typeorm';
import { URL } from 'url';

@Entity(Entities.File)
export class FileModel extends BaseModel<FileModel> implements File {
  @Column()
  mimeType: string;

  @Column()
  key: string;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  type: FileType;

  @Column({
    type: 'enum',
    enum: FileAccess,
  })
  access: FileAccess;

  private static kindMap: Record<string, FileKind | undefined> = {
    image: FileKind.Image,
    video: FileKind.Video,
  };

  get name() {
    return last(this.key.split('/'));
  }

  get kind() {
    for (const [mimeTypeStart, kind] of Object.entries(FileModel.kindMap)) {
      if (this.mimeType.startsWith(mimeTypeStart) && kind) {
        return kind;
      }
    }

    return FileKind.Other;
  }

  getUrl(baseUrl: string) {
    if (this.access !== FileAccess.Public) {
      return undefined;
    }

    const url = new URL(baseUrl);

    url.pathname = `${this.type}/${this.key}`;

    return url.toString();
  }
}
