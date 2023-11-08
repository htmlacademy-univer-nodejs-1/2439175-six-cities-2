import { Coordinates, OfferType, RentaOfferCity } from "../../../types/db-rental-offer-enum.js";

export class CreateRentalOfferDTO {
    public name!: string;
    public description!: string;
    public date!: Date;
    public city!: RentaOfferCity;
    public preview!: string;
    public photoes!: string[];
    public isPremium!: boolean;
    public isFavourite!: boolean;
    public rating!: number;
    public type!: OfferType;
    public rooms!: number;
    public guests!: number;
    public cost!: number;
    public extras!: string[];
    public author!: string;
    public coordinates!: Coordinates;
}