export class CheckInDistanceBetweenError extends Error {
  constructor() {
    super('Check In with more than 100 meters of distance.')
  }
}
