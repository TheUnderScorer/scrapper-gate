import { FileAccess, FileType } from '@scrapper-gate/shared/schema';

export const fileTypeAccessMap: Record<FileType, FileAccess> = {
  [FileType.ScrapperScreenshot]: FileAccess.Private,
};
