import { UALError, UALErrorType } from 'universal-authenticator-library'
import { Name } from './interfaces'

function convertThrownToError(e: unknown): Error | null {
  if (e instanceof Error) {
    return e
  } else if (typeof e === 'string') {
    return new Error(e)
  } else {
    return null
  }
}

export class UALWombatError extends UALError {
  constructor(message: string, type: UALErrorType, cause: unknown) {
    super(message, type, convertThrownToError(cause), Name)
  }
}
