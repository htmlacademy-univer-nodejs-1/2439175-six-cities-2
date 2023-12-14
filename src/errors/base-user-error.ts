import { HttpError } from "./http-errors.js";

export class BaseUserError extends HttpError {
  constructor(httpStatusCode: number, message: string) {
    super(httpStatusCode, message);
  }
}