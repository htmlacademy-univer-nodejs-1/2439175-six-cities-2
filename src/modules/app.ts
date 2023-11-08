import { inject, injectable } from "inversify";
import { ConfigInterface } from "../config/config-interface.js"
import { SitiesSchema } from "../config/sities-schema.js"
import { LoggerInterface } from "../logger/logger-interface.js"
import { DIComponent } from "../types/di-component.enum.js";
import "reflect-metadata";

@injectable()
export class Application {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(DIComponent.ConfigInterface) private readonly config: ConfigInterface<SitiesSchema>
    ) { }
    public async init() {
        this.logger.info('Application initialized');
        this.logger.info(
            `IP: ${this.config.get('PORT')}
            SALt; ${this.config.get('SALT')}`)
    }
}