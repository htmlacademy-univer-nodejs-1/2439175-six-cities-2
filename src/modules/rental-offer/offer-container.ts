import { Container } from "inversify";
import { RentalOfferServiceInterface } from "./offer-rental-service-interface";
import { DIComponent } from "../../types/di-component.enum";
import { RentalOfferEntity, RentalOfferModel } from "./rental-offer-entity";
import { types } from "@typegoose/typegoose";
import RentalOfferService from "./rental-offer";

export function createOfferContainer() {
    const container = new Container();
    container.bind<RentalOfferServiceInterface>(DIComponent.RentalOfferServiceInterface).to(RentalOfferService);
    container.bind<types.ModelType<RentalOfferEntity>>(DIComponent.RentalOfferModel).toConstantValue(RentalOfferModel);
    return container;
}