import { Coordinates, OfferType, RentaOfferCity } from "./db-rental-offer-enum.js";
import { User } from "./db-user.js";

export type RentalOffer = {
    name: string,
    description: string,
    date: Date,
    city: RentaOfferCity,
    preview: string,
    photoes: string[],
    isPremium: boolean,
    isFavourite: boolean,
    rating: number,
    type: OfferType,
    rooms: number,
    guests: number,
    cost: number,
    extras: string[],
    author: User,
    coordinates: Coordinates
}