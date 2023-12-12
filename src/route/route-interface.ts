import { MiddlewareInterface } from "../middleware/middleware-interface.js";
import { HttpMethod } from "../types/http-methods.enum.js";
import { NextFunction, Request, Response } from "express";

export interface RouteInterface {
    path: string;
    method: HttpMethod;
    handler: (req: Request, res: Response, next: NextFunction) => void;
    middlewares?: MiddlewareInterface[];
}