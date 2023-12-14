import { StatusCodes } from "http-status-codes";
import { BaseUserError } from "./base-user-error.js";

export class TeapotError extends BaseUserError {
    constructor() {
      super(StatusCodes.IM_A_TEAPOT, 'I\'m a teapot!');
    }
}