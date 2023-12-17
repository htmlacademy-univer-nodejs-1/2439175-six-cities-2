import { injectable } from "inversify";
import { ControllerInterface } from "./controller-interface.js";
import { Router, Response } from "express";
import { LoggerInterface } from "../logger/logger-interface.js";
import { RouteInterface } from "../route/route-interface.js";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { ConfigInterface } from "../config/config-interface.js";
import { SitiesSchema } from "../config/sities-schema.js";
import { getFullServerPath, transformObject } from "../helpers/common.js";
import { STATIC_RESOURCE_FILES } from "../modules/app-constatnts.js";
import { UnknownRecord } from "../types/params.js";

@injectable()
export abstract class Controller implements ControllerInterface {
    private readonly _router: Router;

    constructor(
        protected readonly logger: LoggerInterface,
        protected readonly configService: ConfigInterface<SitiesSchema>,
    ) {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    protected addStaticPath(data: UnknownRecord): void {
        const fullServerPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
        transformObject(
          STATIC_RESOURCE_FILES,
          `${fullServerPath}/${this.configService.get('STATIC_DIRECTORY_PATH')}`,
          `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
          data
        );
      }

    public addRoute(route: RouteInterface): void {
        const routeHandler = asyncHandler(route.handler.bind(this));
        const middlewares = route.middlewares?.map(
            (middleware) => asyncHandler(middleware.execute.bind(middleware))
        );

        const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
        this._router[route.method](route.path, allHandlers);
        this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
    }

    public send<T>(res: Response, statusCode: number, data: T): void {
        res.type('application/json').status(statusCode).json(data);
    }

    public created<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.CREATED, data);
    }

    public noContent<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.NO_CONTENT, data);
    }

    public ok<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.OK, data);
    }
}
