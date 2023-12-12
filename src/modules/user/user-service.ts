import { DocumentType, types } from "@typegoose/typegoose";
import { CreateUserDTO } from "./dto/create-user.dto.js";
import { UserEntity } from "./user-entity.js";
import { UserServiceInterface } from "./user-service-interface.js";
import { inject, injectable } from "inversify";
import { DIComponent } from "../../types/di-component.enum.js";
import { LoggerInterface } from "../../logger/logger-interface.js";
import 'reflect-metadata';
import { RentalOfferEntity } from "../rental-offer/rental-offer-entity.js";

@injectable()
export class UserService implements UserServiceInterface {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(DIComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
    ) {}

    public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
        const user = new UserEntity(dto);
        user.setPassword(dto.password, salt);

        const result = await this.userModel.create(user);
        this.logger.info(`New user created: ${user.email}`)
        return result;
    }

    public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne({email});
    }

    public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
        const tryToFindUser = await this.findByEmail(dto.email);

        if (tryToFindUser) {
            return tryToFindUser;
        }

        return this.create(dto, salt);
    }

    public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findById(id);
    }

    public addToFavoritesById(id: string, offerId: string): Promise<DocumentType<RentalOfferEntity>[] | null> {
        return this.userModel.findByIdAndUpdate(id, {$push: {favourites: offerId}, new: true});
    }

    public removeFromFavoritesById(id: string, offerId: string): Promise<DocumentType<RentalOfferEntity>[] | null> {
        return this.userModel.findByIdAndUpdate(id, {$pull: {favourites: offerId}, new: true});
    }

    public async getFavourites(id: string): Promise<DocumentType<RentalOfferEntity>[]> {
        const innerFavourites = this.userModel.findById(id).select('favourites');
        return innerFavourites ? this.userModel.find({_id: {$in: innerFavourites.favourites}}) : [];
    }

    public async exists(id: string): Promise <boolean> {
        return (await this.userModel.exists({_id: id})) !== null;
    }
}