import 'reflect-metadata';
import { Setter } from './setter';

class TestClass {
  @Setter((value: number) => value * 2)
  a: number;

  b: number;
}

describe('Setter decorator', () => {
  it('should multiply value by 2', () => {
    const test = new TestClass();

    test.a = 2;
    test.b = 6;

    expect(test.a).toEqual(4);
    expect(test.b).toEqual(6);
    expect(JSON.stringify(test)).toMatchInlineSnapshot(
      `"{\\"b\\":6,\\"a\\":4}"`
    );
  });
});
