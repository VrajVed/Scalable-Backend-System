import { ConflictError, NotFoundError } from "../../../shared/errors";

export class UserNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`User (${identifier})`);
  }
}

export class UserAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`User with email ${email}`);
  }
}
