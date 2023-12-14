import { StatusCodes } from "http-status-codes";
import { HttpError } from "./http-errors.js";
import { ValidationErrorField } from "../types/validation-error-fields.js";

export class ValidationError extends HttpError {
    public details: ValidationErrorField[] = [];
  
    constructor(message: string, errors: ValidationErrorField[]) {
      super(StatusCodes.BAD_REQUEST, message);
      this.details = errors;
    }
}