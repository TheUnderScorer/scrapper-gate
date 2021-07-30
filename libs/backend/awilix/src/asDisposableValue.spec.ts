import { createContainer } from 'awilix';
import { asDisposableValue } from './asDisposableValue';

describe('asDisposableValue', () => {
  it('should register and dispose value', async () => {
    const value = jest.fn();
    const container = createContainer();

    container.register({
      value: asDisposableValue(value, (value) => value()),
    });

    const resolvedValue = container.resolve('value');

    expect(resolvedValue).toEqual(value);

    await container.dispose();

    expect(value).toHaveBeenCalledTimes(1);
  });
});
