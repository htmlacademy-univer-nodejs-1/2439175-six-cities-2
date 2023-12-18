import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { MiddlewareInterface } from "./middleware-interface.js";
import ValidationError from "../errors/validation-error.js";
import { transformErrors } from "../helpers/common.js";

export class ValidateDtoMiddleware implements MiddlewareInterface {
    constructor(private dto: ClassConstructor<object>) {}
  
    public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
      const {body} = req;
      const dtoInstance = plainToInstance(this.dto, body);
      const errors = await validate(dtoInstance);
  
      if (errors.length > 0) {
        throw new ValidationError(`Validation error: "${req.path}"`, transformErrors(errors))
      }
  
      next();
    }
}