import '../../../../../../typings/global';
import { UserModel } from './User.model';

describe('UserModel', () => {
  it('should persist in db', async () => {
    const model = UserModel.create({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      acceptTerms: true,
    });

    const repository = global.connection.getRepository(UserModel);

    await repository.save(model);

    const foundUser = await repository.findOneOrFail(model.id);

    expect(foundUser).toEqual(model);
  });
});
