import { StatusCodes } from "http-status-codes";
import { BaseUserError } from "./base-user-error.js";

export class ForbiddenError extends BaseUserError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect user name or password');
  }
}