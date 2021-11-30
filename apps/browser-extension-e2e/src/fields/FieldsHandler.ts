import { getErrorMessage } from '@scrapper-gate/shared/common';
import { Page } from 'playwright';
import { FieldHandlersMap } from './fields.types';

export class FieldsHandler<Fields extends FieldHandlersMap> {
  constructor(private readonly fields: Fields, private readonly page: Page) {}

  getField(key: keyof Fields) {
    this.keySafeguard(key);

    return this.page.waitForSelector(this.getSelector(key));
  }

  get keys() {
    return Object.keys(this.fields);
  }

  private getSelector(key: keyof Fields) {
    return `[name="${key}"],[data-name="${key}"]`;
  }

  async fill<Key extends keyof Fields>(
    key: Key,
    value?: Fields[Key]['handler']['providedValue']
  ) {
    this.keySafeguard(key);

    const field = await this.getField(key);
    const { handler } = this.fields[key];

    if (value) {
      handler.providedValue = value;
    }

    await field.scrollIntoViewIfNeeded();

    try {
      return await handler.fill(field, this.page);
    } catch (error) {
      console.error(error);

      throw new Error(
        `Failed to fill field ${key} with value ${
          handler.providedValue
        }: ${getErrorMessage(error)}`
      );
    }
  }

  async assert<Key extends keyof Fields>(key: Key) {
    this.keySafeguard(key);

    const value = await this.getValue(key);
    const { handler } = this.fields[key];

    console.log(`Asserting value for ${key}`);

    if (!handler.compare) {
      try {
        expect(value.toString()).toEqual(handler.providedValue.toString());
      } catch (error) {
        const err = error as Error & { matcherResult: Record<string, string> };

        const newError = new Error(
          err.message.concat(`\n This error occured for field: ${key}`)
        );

        Object.assign(newError, {
          matcherResult: {
            ...err.matcherResult,
            message: newError.message,
          },
          stack: err.stack,
        });

        throw newError;
      }

      return;
    }

    await handler.compare(value);
  }

  async fillAll() {
    for (const key in this.fields) {
      await this.fill(key);
    }
  }

  async getValue<Key extends keyof Fields>(
    key: Key
  ): Promise<Fields[Key]['handler']['providedValue']> {
    this.keySafeguard(key);

    const field = await this.getField(key);
    const { handler } = this.fields[key];

    try {
      return await handler.getInputValue(field, this.page);
    } catch (error) {
      console.error(error);

      throw new Error(
        `Failed to retrieve value for ${key}: ${getErrorMessage(error)}`
      );
    }
  }

  async assertAll() {
    await Promise.all(Object.keys(this.fields).map((key) => this.assert(key)));
  }

  private keySafeguard<Key extends keyof Fields>(key: Key) {
    if (!this.fields[key]) {
      throw new Error(`Field ${key} does not exist.`);
    }
  }
}
