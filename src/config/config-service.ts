import { LoggerInterface } from "../logger/logger-interface.js";
import { ConfigInterface } from "./config-interface.js";
import { config } from "dotenv";
import { configSitiesSchema, SitiesSchema } from "../../src/config/sities-schema.js";
import { inject, injectable } from "inversify";
import { DIComponent } from "../types/di-component.enum.js";
import "reflect-metadata";

@injectable()
export class ConfigService implements ConfigInterface<SitiesSchema> {
    private readonly config: SitiesSchema;
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface
    ) {
        const parseInput = config();
        if (parseInput.error) {
            throw new Error("Can't read .env file");
        }
        configSitiesSchema.load({});
        configSitiesSchema.validate({ allowed: 'strict', output: this.logger.info })
        this.config = configSitiesSchema.getProperties();
        this.logger.info(".env file succesfully parsed")
    }

    get<T extends keyof SitiesSchema>(key: T): SitiesSchema[T] {
        return this.config[key];
    }
}