import { inject, injectable } from "inversify";
import { DIComponent } from "../types/di-component.enum.js";
import { ExceptionFilterInterface } from "../exception-filters/exception-filter.interface.js";
import { LoggerInterface } from "../logger/logger-interface.js";
import { NextFunction, Request, Response } from "express";
import ValidationError from "../errors/validation-error.js";
import { StatusCodes } from "http-status-codes";
import { createErrorObject } from "../helpers/common.js";
import { ServiceError } from "../types/service-error.type.js";

@injectable()
export default class ValidationExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (! (error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`);

    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }
}