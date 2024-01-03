export enum RentaOfferCity {
    Paris = 'Paris',
    Cologne = 'Cologne',
    Brussels = 'Brussels',
    Amsterdam = 'Amsterdam',
    Hamburg = 'Hamburg',
    Dusseldorf = 'Dusseldorf',
    Default = 'None'
}

export function getRentalOfferCityEnum(city: string): RentaOfferCity {
    if (Object.values(RentaOfferCity).includes(city as RentaOfferCity)) {
        return RentaOfferCity[city as keyof typeof RentaOfferCity];
    } else {
        return RentaOfferCity.Default;
    }
}

export enum Coordinates {
    Paris = '48.8566, 2.3522',
    Cologne = '50.9375, 6.9603',
    Brussels = '50.8503, 4.3517',
    Amsterdam = '52.3702, 4.8952',
    Hamburg = '53.5511, 9.9937',
    Dusseldorf = '51.2277, 6.7735',
    Default = '0, 0'
} 

export const CityToCoordinates: Record<RentaOfferCity, Coordinates> = {
    [RentaOfferCity.Paris]: Coordinates.Paris,
    [RentaOfferCity.Cologne]: Coordinates.Cologne,
    [RentaOfferCity.Brussels]: Coordinates.Brussels,
    [RentaOfferCity.Amsterdam]: Coordinates.Amsterdam,
    [RentaOfferCity.Hamburg]: Coordinates.Hamburg,
    [RentaOfferCity.Dusseldorf]: Coordinates.Dusseldorf,
    [RentaOfferCity.Default]: Coordinates.Default
}

export const CoordinatesToCity: Record<Coordinates, RentaOfferCity> = {
    [Coordinates.Paris]: RentaOfferCity.Paris,
    [Coordinates.Cologne]: RentaOfferCity.Cologne,
    [Coordinates.Brussels]: RentaOfferCity.Brussels,
    [Coordinates.Amsterdam]: RentaOfferCity.Amsterdam,
    [Coordinates.Hamburg]: RentaOfferCity.Hamburg,
    [Coordinates.Dusseldorf]: RentaOfferCity.Dusseldorf,
    [Coordinates.Default]: RentaOfferCity.Default
}

export enum OfferType {
    Apartment = 'Apartment',
    House = 'House',
    Room = 'Room',
    Hotel = 'Hotel',
    Default = 'Default'
}

export function getOfferTypeEnum(t: string): OfferType {
    if (Object.values(OfferType).includes(t as OfferType)) {
        return OfferType[t as keyof typeof OfferType];
    } else {
        return OfferType.Default;
    }
}

export enum ExtrasType {
    Breakfast = 'Breakfast',
    AirConditioning = 'Air conditioning',
    LaptopFriendlyEorkspace = 'Laptop friendly workspace',
    BabySeat = 'Baby seat',
    Washer = 'Washer',
    Towels = 'Towels',
    Fridge = 'Fridge'
}

export function getExtrasTypeEnum(extras: string): ExtrasType {
    return ExtrasType[extras as keyof typeof ExtrasType];
}