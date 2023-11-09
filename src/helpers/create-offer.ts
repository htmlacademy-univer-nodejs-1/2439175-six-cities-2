import { RentalOffer } from "../types/db-rental-offer.js";
import { getExtrasTypeEnum, getOfferTypeEnum, getRentalOfferCityEnum, RentalOfferCitiesCoordinates } from "../types/db-rental-offer-enum.js";
import { getUserTypeEnum } from "../types/db-user-enum.js";


export function createOffer(data: string): RentalOffer {
    const [
        name,
        description,
        date,
        city,
        preview,
        photoes,
        isPremium,
        isFavourite,
        rating,
        type,
        rooms,
        guests,
        cost,
        extras,
        firstname,
        email,
        avatarPath,
        userType
    ] = data.replace('\n', '').split('\t');

    const user = {
        email: email,
        firstname: firstname,
        avatarSourcePath: avatarPath,
        type: getUserTypeEnum(userType),
    };

    return {
        name,
        description,
        date: new Date(date),
        city: getRentalOfferCityEnum(city),
        cost: Number.parseInt(cost, 10),
        preview: preview,
        photoes: photoes.split(';'),
        isPremium: isPremium == 'true' ? true : false,
        isFavourite: isFavourite == 'true' ? true : false,
        rating: Number.parseFloat(rating),
        rooms: Number.parseInt(rooms, 10),
        extras: extras.split(';').map(e => getExtrasTypeEnum(e)),
        guests: Number.parseInt(guests, 10),
        author: user,
        coordinates: RentalOfferCitiesCoordinates[getRentalOfferCityEnum(city)],
        type: getOfferTypeEnum(type)
    }
}