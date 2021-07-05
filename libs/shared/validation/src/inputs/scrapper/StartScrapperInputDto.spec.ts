import { ScrapperType } from '@scrapper-gate/shared/schema';
import { StartScrapperInputDto } from './StartScrapperInputDto';
import { validateAsClass } from 'joiful';
import { v4 } from 'uuid';

describe('Start Scrapper Input ', () => {
  it('should require browser type if type is set to RealBrowser', () => {
    const input: StartScrapperInputDto = {
      scrapperId: v4(),
    };

    const result = validateAsClass(input, StartScrapperInputDto, {
      context: {
        type: ScrapperType.RealBrowser,
      },
    });

    expect(result.error).not.toBeNull();
    expect(result.error?.message).toEqual('"browserType" is required');
  });

  it('should not require browser type for other types', () => {
    const input: StartScrapperInputDto = {
      scrapperId: v4(),
    };

    const result = validateAsClass(input, StartScrapperInputDto, {
      context: {
        type: ScrapperType.Simple,
      },
    });

    expect(result.error).toBeNull();
  });
});
