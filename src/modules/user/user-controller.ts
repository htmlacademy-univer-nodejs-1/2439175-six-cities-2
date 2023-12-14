import { inject, injectable } from "inversify";
import { Controller } from "../../controller/controller.abstract.js";
import { DIComponent } from "../../types/di-component.enum.js";
import { LoggerInterface } from "../../logger/logger-interface.js";
import { UserServiceInterface } from "./user-service-interface.js";
import { ConfigInterface } from "../../config/config-interface.js";
import { HttpMethod } from "../../types/http-methods.enum.js";
import { Request, Response } from "express";
import { createDTOfromRDO } from "../../helpers/common.js";
import UserRdo from "./rdo/user-rdo.js";
import { SitiesSchema } from "../../config/sities-schema.js";
import { HttpError } from "../../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";
import { ValidateDtoMiddleware } from "../../middleware/validate-dto.middleware.js";
import { CreateUserDTO } from "./dto/create-user.dto.js";
import { LoginUserDTO } from "./dto/login-user.dto.js";
import { ValidateObjectIdMiddleware } from "../../middleware/validate-object-id.middleware.js";
import { UploadFileMiddleware } from "../../middleware/upload-file.middleware.js";
import { AuthInterface } from "../../auth/auth-service.interface.js";
import { LoggedUserRdo } from "./rdo/logged-user-rdo.js";
import { LoginUserRequest } from "../../types/params.js";
import { PrivateRouteMiddleware } from "../../middleware/private-route.middleware.js";


@injectable()
export class UserController extends Controller {
    constructor(
        @inject(DIComponent.LoggerInterface) logger: LoggerInterface,
        @inject(DIComponent.UserServiceInterface) private readonly userInterface: UserServiceInterface,
        @inject(DIComponent.ConfigInterface) private readonly configInterface: ConfigInterface<SitiesSchema>,
        @inject(DIComponent.AuthServiceInterface) private readonly authServiceInterface: AuthInterface,
    ) {
        super(logger);

        this.addRoute({
            path: '/register',
            method: HttpMethod.Post,
            handler: this.create,
            middlewares: [new ValidateDtoMiddleware(CreateUserDTO)]
        });

        this.addRoute({
            path: '/login',
            method: HttpMethod.Post,
            handler: this.login,
            middlewares: [new ValidateDtoMiddleware(LoginUserDTO)]
        });

        this.addRoute({
            path: '/:userId/avatar',
            method: HttpMethod.Post,
            handler: this.uploadAvatar,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateObjectIdMiddleware('userId'),
                new UploadFileMiddleware(this.configInterface.get('UPLOAD_DIRECTORY'), 'avatar')
            ]
        });
    }

    public async create(
        { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDTO>,
        res: Response): Promise<void> {
        const isUserExists = await this.userInterface.findByEmail(body.email);

        if (isUserExists) {
            throw new HttpError(
                StatusCodes.CONFLICT,
                `User with email ${body.email} already exists`,
                'User controller'
            );
        }

        const result = await this.userInterface.create(body, this.configInterface.get('SALT'));
        this.created(res, createDTOfromRDO(UserRdo, result));
    }

    public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
        this.logger.info(body.password);
        const user = await this.authServiceInterface.verify(body);
        const token = await this.authServiceInterface.authenticate(user);
        const response = createDTOfromRDO(LoggedUserRdo, {
            email: user.email,
            token,
        });
        this.ok(res, response);
    }

    public async uploadAvatar(req: Request, res: Response) {
        this.created(res, {
            avatarSourcePath: req.file?.path
        });
    }
}