import { Expose } from "class-transformer";
import { OfferType, RentaOfferCity } from "../../../types/db-rental-offer-enum.js";

export class MiniRentalOfferRDO {
    @Expose()
    public id!: string;

    @Expose()
    name!: string;

    @Expose()
    date!: Date;

    @Expose()
    city!: RentaOfferCity;

    @Expose()
    preview!: string;

    @Expose()
    isPremium!: boolean;

    @Expose()
    isFavourite!: boolean;

    @Expose()
    rating!: number;

    @Expose()
    type!: OfferType;

    @Expose()
    cost!: number;

    @Expose()
    comments!: number; 
}