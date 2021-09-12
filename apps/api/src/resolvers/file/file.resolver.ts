import {
  FileModel,
  GetFileUrlQuery,
} from '@scrapper-gate/backend/domain/files';
import { Resolvers } from '@scrapper-gate/shared/schema';
import { ServerContext } from '../../context';

export const fileResolver = (): Resolvers<ServerContext> => ({
  File: {
    url: (file, _, { unitOfWork }) =>
      unitOfWork.run(
        ({ queriesBus }) =>
          queriesBus.query(
            new GetFileUrlQuery({
              file: FileModel.create(file),
            })
          ),
        {
          runInTransaction: false,
        }
      ),
  },
});
