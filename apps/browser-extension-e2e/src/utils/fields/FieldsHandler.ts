import { Page } from 'playwright';
import { FieldHandlersMap } from './fields.types';

export class FieldsHandler<Fields extends FieldHandlersMap> {
  constructor(private readonly fields: Fields, private readonly page: Page) {}

  getField(key: keyof Fields) {
    return this.page.waitForSelector(`[name="${key}"]`);
  }

  async fill<Key extends keyof Fields>(
    key: Key,
    value?: Fields[Key]['handler']['providedValue']
  ) {
    const field = await this.getField(key);
    const { handler } = this.fields[key];

    if (value) {
      handler.providedValue = value;
    }

    await field.scrollIntoViewIfNeeded();

    return handler.fill(field, this.page);
  }

  async assert<Key extends keyof Fields>(key: Key) {
    const value = await this.getValue(key);
    const { handler } = this.fields[key];

    console.log(`Asserting value for ${key}`);

    if (!handler.compare) {
      expect(value.toString()).toEqual(handler.providedValue.toString());

      return;
    }

    expect(handler.compare(value)).toEqual(true);
  }

  async fillAll() {
    for (const key in this.fields) {
      await this.fill(key);
    }
  }

  async getValue<Key extends keyof Fields>(
    key: Key
  ): Promise<Fields[Key]['handler']['providedValue']> {
    const field = await this.getField(key);
    const { handler } = this.fields[key];

    try {
      return await handler.getInputValue(field, this.page);
    } catch (error) {
      console.error(error);

      throw new Error(`Failed to retrieve value for ${key}.`);
    }
  }

  async assertAll() {
    await Promise.all(Object.keys(this.fields).map((key) => this.assert(key)));
  }
}
