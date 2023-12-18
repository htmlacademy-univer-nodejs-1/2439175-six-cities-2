import { inject, injectable } from "inversify";
import { ExceptionFilterInterface } from "./exception-filter.interface.js";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../types/service-error.type.js";
import { createErrorObject } from "../helpers/common.js";
import { DIComponent } from "../types/di-component.enum.js";
import { LoggerInterface } from "../logger/logger-interface.js";

@injectable()
export default class BaseExceptionFilter implements ExceptionFilterInterface {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface
    ) {
        this.logger.info('Register BaseExceptionFilter');
    }

    public catch(error: Error, _req: Request, res: Response, _next: NextFunction) {
        this.logger.error(`[BaseException]: ${error.message}`);

        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createErrorObject(ServiceError.ServiceError, error.message));
    }
}