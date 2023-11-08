import { Container } from "inversify";
import { Application } from "./modules/app.js";
import { DIComponent } from "./types/di-component.enum.js";
import { PinoLogger } from "./logger/pino-logger.js";
import { LoggerInterface } from "./logger/logger-interface.js";
import { ConfigInterface } from "./config/config-interface.js";
import { SitiesSchema } from "./config/sities-schema.js";
import { DatabaseClientInterface } from "./db/db-client/db-client-interface.js";
import MongoClientService from "./db/db-client/mongo-client-service";
import { ConfigService } from "./config/config-service";
import 'reflect-metadata';

export function createRestApplicationContainer() {
    const container = new Container();
    container.bind<Application>(DIComponent.Application).to(Application);
    container.bind<LoggerInterface>(DIComponent.LoggerInterface).to(PinoLogger);
    container.bind<ConfigInterface<SitiesSchema>>(DIComponent.ConfigInterface).to(ConfigService);
    container.bind<DatabaseClientInterface>(DIComponent.DatabaseClientInterface).to(MongoClientService);

    return container;
}