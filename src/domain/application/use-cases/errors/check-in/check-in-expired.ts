export class CheckInExpiredError extends Error {
  constructor() {
    super('Check-in has expired and cannot be validated.')
  }
}
