import { inject, injectable } from "inversify";
import { ConfigInterface } from "../config/config-interface.js"
import { SitiesSchema } from "../config/sities-schema.js"
import { LoggerInterface } from "../logger/logger-interface.js"
import { DIComponent } from "../types/di-component.enum.js";
import "reflect-metadata";
import { DatabaseClientInterface } from "../db/db-client/db-client-interface.js";
import { MongoDBURI } from "../helpers/index.js";
import express, {Express} from 'express';
import { ControllerInterface } from "../controller/controller-interface.js";
import { CommentController } from "./comment/comment-controller.js";
import { UserController } from "./user/user-controller.js";
import { ExceptionFilterInterface } from "../exception-filters/exception-filter.interface.js";
import { AuthExceptionFilter } from "../auth/auth-exceptions-filter.js";
import { ParseTokenMiddleware } from "../middleware/parse-token.middleware.js";

@injectable()
export class Application {
    private expressApplication: Express;

    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(DIComponent.ConfigInterface) private readonly config: ConfigInterface<SitiesSchema>,
        @inject(DIComponent.DatabaseClientInterface) private readonly dbClient: DatabaseClientInterface,
        @inject(DIComponent.RentalOfferController) private readonly rentalOfferController: ControllerInterface,
        @inject(DIComponent.CommentController) private readonly commentControler: CommentController,
        @inject(DIComponent.UserController) private readonly userController: UserController,
        @inject(DIComponent.ExceptionFilterInterface) private readonly exceptionFilterInterface: ExceptionFilterInterface,
        @inject(DIComponent.AuthExceptionFilter) private readonly authExceptionFilterInterface: AuthExceptionFilter,
    ) {
        this.expressApplication = express();
    }

    public async init() {
        this.logger.info('Application initialized');
        this.logger.info(
            `PORT: ${this.config.get('PORT')}
            SALT; ${this.config.get('SALT')}`)
        
        this.logger.info('Init db');
        await this._initDb();
        this.logger.info(`Init db succesfully`);
        this.logger.info('Init middlewares');
        await this._initMiddleware();
        this.logger.info('Init routes');
        await this._initRoutes();
        this.logger.info("Init exception filter");
        await this._initExceptionFilter();
        this.logger.info('Init routes succesfully')
        await this._initServer();
    }

    private async _initDb() {
        const mongoUri = MongoDBURI(
            this.config.get('DB_USER'),
            this.config.get('DB_PASSWORD'),
            this.config.get('DB_HOST'),
            this.config.get('DB_PORT'),
            this.config.get('DB_NAME')
        )

        return this.dbClient.connect(mongoUri);
    }

    private async _initRoutes() {
        this.logger.info('Starting initing routes');
        this.expressApplication.use('/offer', this.rentalOfferController.router);
        this.expressApplication.use('/comment', this.commentControler.router);
        this.expressApplication.use('/users', this.userController.router);
        this.logger.info('Inited routes')
    };

    private async _initMiddleware() {
        this.logger.info('Global middleware initialization');
        const authMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
        this.expressApplication.use(express.json());
        this.expressApplication.use(
            '/upload',
            express.static(this.config.get('UPLOAD_DIRECTORY'))
        );
        this.expressApplication.use(authMiddleware.execute.bind(authMiddleware));
        this.logger.info('Global middleware initialized');
    }

    private async _initExceptionFilter() {
        this.logger.info("Init exception filer");
        this.expressApplication.use(this.authExceptionFilterInterface.catch.bind(this.authExceptionFilterInterface));
        this.expressApplication.use(this.exceptionFilterInterface.catch.bind(this.exceptionFilterInterface));
    }

    private async _initServer(){
        this.logger.info('Init server')
        const port = this.config.get('PORT');
        this.expressApplication.listen(port);
        this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`)
    }
}