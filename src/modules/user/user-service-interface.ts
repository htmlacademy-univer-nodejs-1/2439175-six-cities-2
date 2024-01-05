import { DocumentType } from "@typegoose/typegoose";
import { UserEntity } from "./user-entity.js";
import { CreateUserDTO } from "./dto/create-user.dto.js";
import { RentalOfferEntity } from "../rental-offer/rental-offer-entity.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

export interface UserServiceInterface {
    create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
    findById(id: string): Promise<DocumentType<UserEntity> | null>;
    addToFavoritesById(id: string, offerId: string): Promise<DocumentType<RentalOfferEntity>[] | null>;
    removeFromFavoritesById(id: string, offerId: string): Promise<DocumentType<RentalOfferEntity>[] | null>;
    // getFavourites(id: string): Promise<DocumentType<RentalOfferEntity>[] | null>;
    updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
    isFavourite(id: string, offerId: string): Promise<boolean>;
}