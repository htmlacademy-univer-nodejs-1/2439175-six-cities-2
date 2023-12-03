import { Container } from "inversify";
import {types} from '@typegoose/typegoose';
import { CommentServiceInterface } from "./comment-interface.js";
import { DIComponent } from "../../types/di-component.enum.js";
import CommentService from "./comment-serivce.js";
import { CommentModel } from "./comment-entity.js";
import { CommentEntity } from "./comment-entity.js";

export function CommentContainer() {
    const container = new Container();
    container.bind<CommentServiceInterface>(DIComponent.CommentServiceInterface).to(CommentService).inSingletonScope();
    container.bind<types.ModelType<CommentEntity>>(DIComponent.CommentModel).toConstantValue(CommentModel);
    return container;
}