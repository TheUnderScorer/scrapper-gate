export class MissingMessagePayloadError extends TypeError {
  constructor() {
    super('Message Payload is missing.');
  }
}
