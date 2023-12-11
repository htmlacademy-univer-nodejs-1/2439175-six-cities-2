import { Expose, Type } from "class-transformer";
import { Coordinates, ExtrasType, OfferType, RentaOfferCity } from "../../../types/db-rental-offer-enum.js";
import UserRdo from "../../user/rdo/user-rdo.js";

export class RentalOfferRDO {
    @Expose()
    public id!: string;

    @Expose()
    name!: string;

    @Expose()
    description!: string;

    @Expose()
    date!: Date;

    @Expose()
    city!: RentaOfferCity;

    @Expose()
    preview!: string;

    @Expose()
    photoes!: string[];

    @Expose()
    isPremium!: boolean;

    @Expose()
    isFavourite!: boolean;

    @Expose()
    rating!: number;

    @Expose()
    type!: OfferType;

    @Expose()
    rooms!: number;

    @Expose()
    guests!: number;

    @Expose()
    cost!: number;

    @Expose()
    extras!: ExtrasType[];

    @Expose({name: 'author'})
    @Type(() => UserRdo)
    author!: string;

    @Expose()
    coordinates!: Coordinates;

    @Expose()
    comments!: number; 
}