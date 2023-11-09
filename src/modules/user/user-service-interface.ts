import { DocumentType } from "@typegoose/typegoose";
import { UserEntity } from "./user-entity.js";
import { CreateUserDTO } from "./dto/create-user.dto.js";

export interface UserServiceInterface {
    create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
    findById(id: string): Promise<DocumentType<UserEntity> | null>;
}