import { inject, injectable } from "inversify";
import { ExceptionFilterInterface } from "./exception-filter.interface.js";
import { DIComponent } from "../types/di-component.enum.js";
import { LoggerInterface } from "../logger/logger-interface.js";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../errors/http-errors.js";
import { createErrorObjectFromMessage } from "../helpers/common.js";

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface
    ) {
        this.logger.info("Register exception filter");
    }

    public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
        error instanceof HttpError ? this.handleHttpError(error, req, res, next) 
                                    : this.handleOtherError(error, req, res, next);
    }

    private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) : void {
        this.logger.error(`[${error.detail}]: ${error.httpStatusCode} - ${error.message}`);
        res
            .status(error.httpStatusCode)
            .json(createErrorObjectFromMessage(error.message))
    }

    private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
        this.logger.error(error.message);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createErrorObjectFromMessage(error.message))
    }
}