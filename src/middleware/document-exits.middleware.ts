import { NextFunction, Request, Response } from "express";
import { DocumentExistsInterface } from "../types/document-exists.interface.js";
import { MiddlewareInterface } from "./middleware-interface.js";
import { HttpError } from "../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class DocumentExistsMiddleware implements MiddlewareInterface {
    constructor(
      private readonly service: DocumentExistsInterface,
      private readonly entityName: string,
      private readonly paramName: string,
    ) {}
  
    public async execute({params}: Request, _res: Response, next: NextFunction): Promise<void> {
      const documentId = params[this.paramName];
      if (!await this.service.exists(documentId)) {
        throw new HttpError(
          StatusCodes.NOT_FOUND,
          `${this.entityName} with ${documentId} not found.`,
          'DocumentExistsMiddleware'
        );
      }
  
      next();
    }
  }