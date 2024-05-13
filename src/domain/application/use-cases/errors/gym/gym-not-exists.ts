export class GymNotExistsError extends Error {
  constructor() {
    super('Gym not exists.')
  }
}
