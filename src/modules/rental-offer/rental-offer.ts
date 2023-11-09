import { DocumentType, types } from "@typegoose/typegoose";
import { CreateRentalOfferDTO } from "./dto/rental-offer-dto.js";
import { RentalOfferServiceInterface } from "./offer-rental-service-interface.js";
import { RentalOfferEntity } from "./rental-offer-entity.js";
import { inject, injectable } from "inversify";
import { DIComponent } from "../../types/di-component.enum.js";
import { LoggerInterface } from "../../logger/logger-interface.js";

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
        return this.rentalOfferModel.findById(id);
    }
    
}