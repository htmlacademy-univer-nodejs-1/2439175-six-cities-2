import { inject, injectable } from "inversify";
import { DIComponent } from "../types/di-component.enum.js";
import { ExceptionFilterInterface } from "./exception-filter.interface.js";
import { LoggerInterface } from "../logger/logger-interface.js";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../types/service-error.type.js";
import { createErrorObject } from "../helpers/common.js";

@injectable()
export default class HttpErrorExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }
}