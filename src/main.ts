import { Container } from "inversify";
import { ConfigService } from "./config/config-service.js";
import { PinoLogger } from "./logger/pino-logger.js";
import { Application } from "./modules/app.js";
import { DIComponent } from "./types/di-component.enum.js";
import { LoggerInterface } from "./logger/logger-interface.js";
import { ConfigInterface } from "./config/config-interface.js";
import { SitiesSchema } from "./config/sities-schema.js";
import 'reflect-metadata';

async function bootstrap() {
    const container = new Container();
    container.bind<Application>(DIComponent.Application).to(Application);
    container.bind<LoggerInterface>(DIComponent.LoggerInterface).to(PinoLogger);
    container.bind<ConfigInterface<SitiesSchema>>(DIComponent.ConfigInterface).to(ConfigService);

    const app = container.get<Application>(DIComponent.Application);
    await app.init();
}

bootstrap();