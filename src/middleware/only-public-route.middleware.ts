import { NextFunction, Request, Response } from "express";
import { MiddlewareInterface } from "./middleware-interface.js";
import { HttpError } from "../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class OnlyPublicRouteMiddleware implements MiddlewareInterface {
    constructor(
    ) {}
  
    public async execute({tokenPayload}: Request, _res: Response, next: NextFunction): Promise<void> {
      if (tokenPayload) {
        throw new HttpError(
          StatusCodes.FORBIDDEN,
          `You've already authorized`,
          'OnlyPublicRouteMiddleware'
        );
      }
  
      next();
    }
  }