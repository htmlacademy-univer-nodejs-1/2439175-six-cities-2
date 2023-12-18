import { inject, injectable } from "inversify";
import { DIComponent } from "../types/di-component.enum.js";
import { LoggerInterface } from "../logger/logger-interface.js";
import { ExceptionFilterInterface } from "../exception-filters/exception-filter.interface.js";
import { NextFunction, Request, Response } from "express";
import { BaseUserError } from "../errors/base-user-error.js";

@injectable()
export class AuthExceptionFilter implements ExceptionFilterInterface {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface
    ) {
        this.logger.info('Register AuthExceptionFilter');
    }

    public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
        if (!(error instanceof BaseUserError)) {
            return next(error);
        }

        this.logger.error(`[AuthModule] ${error.message}`, error);
        res.status(error.httpStatusCode)
            .json({
                type: 'AUTHORIZATION',
                error: error.message,
        });
    }
}