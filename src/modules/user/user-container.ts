import { Container } from "inversify";
import { UserServiceInterface } from "./user-service-interface";
import { DIComponent } from "../../types/di-component.enum";
import { UserService } from "./user-service";
import { types } from "@typegoose/typegoose";
import { UserEntity, UserModel } from "./user-entity";

export function userContainer() {
    const container = new Container();
    container.bind<UserServiceInterface>(DIComponent.UserServiceInterface).to(UserService);
    container.bind<types.ModelType<UserEntity>>(DIComponent.UserModel).toConstantValue(UserModel);
    return container;
}