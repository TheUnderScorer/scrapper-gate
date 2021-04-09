export class AppError extends Error {
  constructor(message: string, readonly name = 'Error') {
    super(message);
  }
}
