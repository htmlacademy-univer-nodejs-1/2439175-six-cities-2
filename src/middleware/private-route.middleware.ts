import { NextFunction, Request, Response } from "express";
import { MiddlewareInterface } from "./middleware-interface.js";
import { HttpError } from "../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class PrivateRouteMiddleware implements MiddlewareInterface {
    public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
        if (!tokenPayload) {
            throw new HttpError(
                StatusCodes.UNAUTHORIZED,
                'Unauthorized',
                'PrivateRouteMiddleware'
            );
        }

        return next();
    }
}