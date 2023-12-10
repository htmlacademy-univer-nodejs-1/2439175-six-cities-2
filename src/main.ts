import { Container } from "inversify";
import { Application } from "./modules/app.js";
import { DIComponent } from "./types/di-component.enum.js";
import 'reflect-metadata';
import { createRestApplicationContainer } from "./rest-service.js";
import { userContainer } from "./modules/user/user-container.js";
import { createOfferContainer } from "./modules/rental-offer/offer-container.js";
import { CommentContainer } from "./modules/comment/comment-container.js";

async function bootstrap() {
    const container = Container.merge(createRestApplicationContainer(), userContainer(), createOfferContainer(), CommentContainer())

    const app = container.get<Application>(DIComponent.Application);
    await app.init();
}

bootstrap();