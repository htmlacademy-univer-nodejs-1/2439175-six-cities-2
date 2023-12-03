import { DocumentType, types } from "@typegoose/typegoose";
import { CreateRentalOfferDTO, UpdateRentalOfferDTO } from "./dto/rental-offer-dto.js";
import { RentalOfferServiceInterface } from "./offer-rental-service-interface.js";
import { RentalOfferEntity } from "./rental-offer-entity.js";
import { inject, injectable } from "inversify";
import { DIComponent } from "../../types/di-component.enum.js";
import { LoggerInterface } from "../../logger/logger-interface.js";

const MAX_OFFERS = 50;

@injectable()
export default class RentalOfferService implements RentalOfferServiceInterface {
    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(DIComponent.RentalOfferModel) private readonly rentalOfferModel: types.ModelType<RentalOfferEntity>
    ) {}

    public async create(dto: CreateRentalOfferDTO): Promise<DocumentType<RentalOfferEntity>> {
        const offer = await this.rentalOfferModel.create(dto);
        this.logger.info(`Created offer \"${dto.name}\"`)

        return offer;
    }

    public async findById(id: string): Promise<DocumentType<RentalOfferEntity> | null> {
        return this.rentalOfferModel.findById(id).populate('user').exec();
    }

    public async find(limit: number | undefined): Promise<DocumentType<RentalOfferEntity>[]> {
        const realLimit = limit ?? MAX_OFFERS;
        return this.rentalOfferModel.find().sort({date: -1}).limit(realLimit).populate('user').exec();
    }

    public async deleteById(id: string): Promise<DocumentType<RentalOfferEntity> | null> {
        return this.rentalOfferModel.findByIdAndDelete(id).exec();
    }

    addComment(id: string): Promise<DocumentType<RentalOfferEntity> | null> {
        return this.rentalOfferModel
      .findByIdAndUpdate(id, {'$inc': {
        comments: 1,
      }}).exec();
    }

    public async updateById(id: string, dto: UpdateRentalOfferDTO): Promise<DocumentType<RentalOfferEntity> | null> {
        return this.rentalOfferModel.findByIdAndUpdate(id, dto, {new: true}).populate('user').exec();
      }

    public async updateRating(id: string, rating: number): Promise<void> {
        await this.rentalOfferModel.findByIdAndUpdate(id, {rating: rating}, {new: true}).exec();
    }

    public async findPremiumInCity(city: string): Promise<DocumentType<RentalOfferEntity>[]> {
        return this.rentalOfferModel.find({city: city, isPremium: true}).sort({date: -1}).limit(MAX_OFFERS).populate('user').exec();
      }
    
}