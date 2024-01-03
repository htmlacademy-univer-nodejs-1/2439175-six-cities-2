import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsEnum, IsLatLong, IsNumber, IsObject, IsOptional, Matches, Max, MaxLength, Min, MinLength } from "class-validator";
import { Coordinates, ExtrasType, OfferType, RentaOfferCity } from "../../../types/db-rental-offer-enum.js";
export const photoRegExp = /^(\w+).(jpg|png|jpeg)$/

export class UpdateRentalOfferDTO {
    @IsOptional()
    @MinLength(10, {message: 'Min length for name is 10'})
    @MaxLength(100, {message: 'Max length for name is 100'})
    public name?: string;

    @IsOptional()
    @MinLength(20, {message: 'Min length for description is 20'})
    @MaxLength(1024, {message: 'Max length for description is 1024'})
    public description?: string;

    @IsOptional()
    @IsDateString()
    public date?: Date;

    @IsOptional()
    @Matches(photoRegExp, {message: "Preview should be .png, .jpeg or .jpg"})
    public preview?: string;

    @IsOptional()
    @Matches(photoRegExp, {each:true, message: "Preview should be .png, .jpeg or .jpg"})
    @ArrayMinSize(6, {message: "Should be 6 photoes"})
    @ArrayMaxSize(6, {message: "Should be 6 photoes"})
    public photoes?: string[];

    @IsOptional()
    @IsEnum(RentaOfferCity, {message: 'type must be one of the city'})
    public city?: RentaOfferCity;

    @IsOptional()
    @IsBoolean({message: 'field premium must be boolean'})
    public isPremium?: boolean;

    @IsOptional()
    @IsBoolean({message: 'field isFavourite must be boolean'})
    public isFavourite?: boolean;

    @IsOptional()
    @IsNumber({maxDecimalPlaces: 1}, {message: "Only ine decimal place allowes"})
    @Min(1, {message: "Min rating is 1"})
    @Max(5, {message: "Max rating is 5"})
    public rating?: number;

    @IsOptional()
    @IsEnum(OfferType, {message: 'type must be one of the housing types'})
    public type?: OfferType;

    @IsOptional()
    @Min(1, {message: 'Min count of rooms is 1'})
    @Max(8, {message: 'Max count of rooms is 8'})
    public rooms?: number;

    @IsOptional()
    @Min(1, {message: 'Min count of guests is 1'})
    @Max(10, {message: 'Max count of guests is 10'})
    public guests?: number;

    @IsOptional()
    @Min(100, {message: 'Min cost is 100'})
    @Max(100000, {message: 'Max cost is 100000'})
    public cost?: number;

    @IsOptional()
    @IsArray({message: 'field facilities must be an array'})
    @IsEnum(ExtrasType, {each: true, message: 'type must be one of the facilities'})
    @ArrayNotEmpty({message: 'There should be at least 1 facility'})
    public extras?: ExtrasType[];

    @IsOptional()
    @IsObject({message: 'There should be object CoordinatesType'})
    public coordinates?: Coordinates;
}

export class CreateRentalOfferDTO {
    @MinLength(10, {message: 'Minimum title length must be 10'})
    @MaxLength(100, {message: 'Maximum title length must be 100'})
    public name!: string;

    @MinLength(20, {message: 'Min length for description is 20'})
    @MaxLength(1024, {message: 'Max length for description is 1024'})    
    public description!: string;

    @IsDateString()
    public date!: Date;

    @Matches(photoRegExp, {message: "Preview should be .png, .jpeg or .jpg"})
    public preview!: string;

    @Matches(photoRegExp, {each:true, message: "Preview should be .png, .jpeg or .jpg"})
    @ArrayMinSize(6, {message: "Should be 6 photoes"})
    @ArrayMaxSize(6, {message: "Should be 6 photoes"})
    public photoes!: string[];

    @IsEnum(RentaOfferCity, {message: 'type must be one of the city'})
    public city!: RentaOfferCity;

    @IsBoolean({message: 'field isPremium must be boolean'})
    public isPremium!: boolean;

    @IsBoolean({message: 'field isFavourite must be boolean'})
    public isFavourite!: boolean;

    @IsNumber({maxDecimalPlaces: 1}, {message: "Only ine decimal place allowes"})
    @Min(1, {message: "Min rating is 1"})
    @Max(5, {message: "Max rating is 5"})
    public rating!: number;

    @IsEnum(OfferType, {message: 'type must be one of the offer type'})
    public type!: OfferType;

    @IsNumber()
    @Min(1, {message: 'Min count of rooms is 1'})
    @Max(8, {message: 'Max count of rooms is 8'})
    public rooms!: number;

    @IsNumber()
    @Min(1, {message: 'Min count of guests is 1'})
    @Max(10, {message: 'Max count of guests is 10'})
    public guests!: number;

    @IsNumber()
    @Min(100, {message: 'Min cost is 100'})
    @Max(100000, {message: 'Max cost is 100000'})
    public cost!: number;

    @IsArray({message: 'field facilities must be an array'})
    @IsEnum(ExtrasType, {each: true, message: 'type must be one of the facilities'})
    @ArrayNotEmpty({message: 'There should be at least 1 facility'})
    public extras!: string[];

    @IsEnum(Coordinates)
    @IsLatLong({message: "coordinates should be in format \"lat, long\""})
    public coordinates!: Coordinates;

    public author!: string;
}