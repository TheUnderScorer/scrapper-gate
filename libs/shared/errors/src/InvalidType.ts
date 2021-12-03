export class InvalidType extends TypeError {
  constructor(receivedType: string, expectedType: string) {
    super(`Got invalid type, expected: ${expectedType}, got: ${receivedType}`);
  }
}
