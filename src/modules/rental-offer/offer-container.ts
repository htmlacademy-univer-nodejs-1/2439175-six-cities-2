import { Container } from "inversify";
import { RentalOfferServiceInterface } from "./offer-rental-service-interface.js";
import { DIComponent } from "../../types/di-component.enum.js";
import { RentalOfferEntity, RentalOfferModel } from "./rental-offer-entity.js";
import { types } from "@typegoose/typegoose";
import RentalOfferService from "./rental-offer.js";
import { ControllerInterface } from "../../controller/controller-interface.js";
import { RentalOfferController } from "./offer-controller.js";

export function createOfferContainer() {
    const container = new Container();
    container.bind<RentalOfferServiceInterface>(DIComponent.RentalOfferServiceInterface).to(RentalOfferService);
    container.bind<types.ModelType<RentalOfferEntity>>(DIComponent.RentalOfferModel).toConstantValue(RentalOfferModel);
    container.bind<ControllerInterface>(DIComponent.RentalOfferController).to(RentalOfferController);
    return container;
}