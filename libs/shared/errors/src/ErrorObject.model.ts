// TODO Fix circular dependency
import { DataObject } from '@scrapper-gate/shared/data-object';
import { ErrorObject, Maybe } from '@scrapper-gate/shared/schema';

export class ErrorObjectModel
  extends DataObject<ErrorObject>
  implements ErrorObject
{
  protected readonly = true;

  public name: string;

  public date?: Maybe<Date>;

  public message?: Maybe<string>;

  static fromError(error: Error) {
    return this.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      date:
        'date' in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new Date((error as Record<string, any>).date)
          : undefined,
      message: error.message,
      name: error.name,
    });
  }

  toError(): Error {
    const error = new Error(this.message ?? 'Error');

    error.name = this.name;

    return error;
  }

  toJSON(): Omit<ErrorObject, 'date'> & { date?: string } {
    return {
      date: this.date?.toISOString(),
      message: this.message,
      name: this.name,
    };
  }
}
