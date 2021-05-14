import { createUser } from '../../tests/createUser';
import { createScrapper } from '../../tests/createScrapper';

describe('Create scrapper', () => {
  it('should create scrapper', async () => {
    const { tokens } = await createUser();

    const scrapper = await createScrapper(tokens.accessToken);

    expect(scrapper).toBeDefined();
  });
});
