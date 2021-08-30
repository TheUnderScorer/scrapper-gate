import fileType from 'file-type';
import { Readable } from 'stream';

export async function getMimeType(file: Buffer | Readable) {
  return file instanceof Buffer
    ? await fileType.fromBuffer(file)
    : await fileType.fromStream(file);
}
