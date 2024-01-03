import { DocumentType } from "@typegoose/typegoose";
import { CreateRentalOfferDTO } from "./dto/rental-offer-dto.js";
import { RentalOfferEntity } from "./rental-offer-entity";
import { DocumentExistsInterface } from "../../types/document-exists.interface.js";

export interface RentalOfferServiceInterface extends DocumentExistsInterface{
    create(dto: CreateRentalOfferDTO): Promise<DocumentType<RentalOfferEntity>>;
    findById(id: string): Promise<DocumentType<RentalOfferEntity> | null>;
    find(limit: number | undefined): Promise<DocumentType<RentalOfferEntity>[]>;
    deleteById(id: string): Promise<DocumentType<RentalOfferEntity> | null>;
    addComment(id: string): Promise<DocumentType<RentalOfferEntity> | null>;
    updateRating(id: string, rating: number): Promise<void>;
    findPremiumInCity(city: string): Promise<DocumentType<RentalOfferEntity>[]>
    exists(documentId: string): Promise<boolean>;
    all(): Promise<DocumentType<RentalOfferEntity>[] | null>;
}