import { ElementHandle, Page } from 'playwright';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FieldHandler<T, V = any> {
  /**
   * Fills input with provided value
   *
   * @see providedValue
   * */
  fill: (element: ElementHandle<T>, page: Page) => Promise<void>;
  /**
   * Returns value stored in input (not storedValue)
   * */
  getInputValue: (element: ElementHandle<T>, page: Page) => Promise<V>;
  /**
   * Value that it is assumed this input should have
   * */
  providedValue: V;
  /**
   * Optional compare logic for input value
   *
   * @param inputValue Value that is stored in input.
   *
   * @see getInputValue
   * */
  compare?: (inputValue?: V) => boolean;
}

export interface FieldHandlerMapEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: FieldHandler<any, any>;
}

export type FieldHandlersMap = {
  [key: string]: FieldHandlerMapEntry;
};
