import { NextFunction, Request, Response } from "express";

export interface ExceptionFilterInterface {
    catch(error: Error, req: Request, res: Response, nex: NextFunction): void;
}