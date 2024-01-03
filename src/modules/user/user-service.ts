import { DocumentType, types } from "@typegoose/typegoose";
import { CreateUserDTO } from "./dto/create-user.dto.js";
import { UserEntity } from "./user-entity.js";
import { UserServiceInterface } from "./user-service-interface.js";
import { inject, injectable } from "inversify";
import { DIComponent } from "../../types/di-component.enum.js";
import { LoggerInterface } from "../../logger/logger-interface.js";
import 'reflect-metadata';
import { RentalOfferEntity } from "../rental-offer/rental-offer-entity.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { User } from "../../types/db-user.js";

export const DEFAULT_USER_AVATAR = 'jim_halpert.jpg';

@injectable()
export class UserService implements UserServiceInterface {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(DIComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>,
        // @inject(DIComponent.RentalOfferServiceInterface) private readonly offerModel: types.ModelType<RentalOfferEntity>
    ) { }

    public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
        if (dto.avatarSourcePath === undefined) {
            dto = {...dto, avatarSourcePath: DEFAULT_USER_AVATAR};
        }
        const user = new UserEntity(dto as User);
        user.setPassword(dto.password, salt);
        const result = await this.userModel.create(user);
        this.logger.info(`New user created: ${user.email}`)
        return result;
    }

    public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne({ email });
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
        return this.userModel.findByIdAndUpdate(id, { $addToSet: { favourites: offerId }, new: true });
    }

    public removeFromFavoritesById(id: string, offerId: string): Promise<DocumentType<RentalOfferEntity>[] | null> {
        return this.userModel.findByIdAndUpdate(id, { $pull: { favourites: offerId }, new: true });
    }

    // public async getFavourites(id: string): Promise<DocumentType<RentalOfferEntity>[]> {
    //     const user = await this.findById(id);
    //     if (!user) {
    //         return [];
    //     }
    //     return this.offerModel.find({_id: { $in: user.favourites }});
    // } почему-то не работает. Не понимаю почему, вторые сутки

    public async isFavourite(id: string, offerId: string): Promise<boolean> {
        return (await this.userModel.findOne({_id: id, favourites: offerId}) !== null);
    }

    public async exists(id: string): Promise<boolean> {
        return (await this.userModel.exists({ _id: id })) !== null;
    }

    public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
        return this.userModel
            .findByIdAndUpdate(userId, dto, { new: true })
            .exec();
    }
}