import { inject, injectable } from "inversify";
import { ConfigInterface } from "../config/config-interface.js"
import { SitiesSchema } from "../config/sities-schema.js"
import { LoggerInterface } from "../logger/logger-interface.js"
import { DIComponent } from "../types/di-component.enum.js";
import "reflect-metadata";
import { DatabaseClientInterface } from "../db/db-client/db-client-interface.js";
import { MongoDBURI } from "../helpers/index.js";

@injectable()
export class Application {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(DIComponent.ConfigInterface) private readonly config: ConfigInterface<SitiesSchema>,
        @inject(DIComponent.DatabaseClientInterface) private readonly dbClient: DatabaseClientInterface
    ) { }
    public async init() {
        this.logger.info('Application initialized');
        this.logger.info(
            `PORT: ${this.config.get('PORT')}
            SALT; ${this.config.get('SALT')}`)
        
            this.logger.info('Init db');
            await this._initDb();
            this.logger.info('Init db succesfully');
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
}