export class InvalidType extends TypeError {
  constructor(expectedType: string) {
    super(`Got invalid type, expected: ${expectedType}`);
  }
}
