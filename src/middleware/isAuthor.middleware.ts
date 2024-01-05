import { NextFunction, Request, Response } from "express";
import { IsAuthorInterface } from "../types/isAuthorInterface.js";
import { MiddlewareInterface } from "./middleware-interface.js";
import { HttpError } from "../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class IsAuthorMiddleware implements MiddlewareInterface {
    constructor(
      private readonly service: IsAuthorInterface,
      private readonly paramNameFirst: string,
    ) {}
  
    public async execute({params, tokenPayload}: Request, _res: Response, next: NextFunction): Promise<void> {
      const offerId = params[this.paramNameFirst];
      const userId = tokenPayload['id'];
      if (!await this.service.isAuthor(offerId, userId)) {
        throw new HttpError(
          StatusCodes.FORBIDDEN,
          `Document has another author, can not do this action`,
          'DocumentExistsMiddleware'
        );
      }
  
      next();
    }
  }