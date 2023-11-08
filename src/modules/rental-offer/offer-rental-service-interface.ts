import { DocumentType } from "@typegoose/typegoose";
import { CreateRentalOfferDTO } from "./dto/rental-offer-dto.js";
import { RentalOfferEntity } from "./rental-offer-entity";

export interface RentalOfferServiceInterface {
    create(dto: CreateRentalOfferDTO): Promise<DocumentType<RentalOfferEntity>>;
    findById(id: string): Promise<DocumentType<RentalOfferEntity> | null>;
}