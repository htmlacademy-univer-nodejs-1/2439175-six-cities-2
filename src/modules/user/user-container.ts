import { Container } from "inversify";
import { UserServiceInterface } from "./user-service-interface.js";
import { DIComponent } from "../../types/di-component.enum.js";
import { UserService } from "./user-service.js";
import { types } from "@typegoose/typegoose";
import { UserEntity, UserModel } from "./user-entity.js";
import { Controller } from "../../controller/controller.abstract.js";
import { UserController } from "./user-controller.js";

export function userContainer() {
    const container = new Container();
    container.bind<UserServiceInterface>(DIComponent.UserServiceInterface).to(UserService);
    container.bind<types.ModelType<UserEntity>>(DIComponent.UserModel).toConstantValue(UserModel);
    container.bind<Controller>(DIComponent.UserController).to(UserController).inSingletonScope();
    return container;
}