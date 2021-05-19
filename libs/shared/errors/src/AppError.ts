export class AppError extends Error {
  readonly date = new Date();

  constructor(message: string, readonly name = 'Error') {
    super(message);
  }
}
