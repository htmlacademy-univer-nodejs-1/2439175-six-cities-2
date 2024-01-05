import { NextFunction, Request, Response } from "express";
import { MiddlewareInterface } from "./middleware-interface.js";
import { CityToCoordinates, RentaOfferCity } from "../types/db-rental-offer-enum.js";
import { HttpError } from "../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class RightCoordinatesNiddleware implements MiddlewareInterface {
    constructor(
    ) {}
  
    public async execute({body}: Request, _res: Response, next: NextFunction): Promise<void> {
      const rightCoordinates = CityToCoordinates[body.city as RentaOfferCity];
      if (body.coordinates !== rightCoordinates) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `City has coordinates ${rightCoordinates}, not ${body.coordinates}`,
          'RigthCoordinatesMiddleware'
        );
      }
  
      next();
    }
  }