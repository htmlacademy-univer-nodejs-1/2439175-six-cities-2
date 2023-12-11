import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Coordinates, ExtrasType, OfferType, RentaOfferCity } from "../../../types/db-rental-offer-enum.js";

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
    @IsEnum(RentaOfferCity, {message: 'type must be one of the city'})
    public city?: RentaOfferCity;

    @IsOptional()
    @IsString({message: 'preview path is required.'})
    public preview?: string;

    @IsOptional()
    @IsArray({message: 'field images must be an array'})
    @IsString({each: true, message: 'image path should be string'})
    public photoes?: string[];

    @IsOptional()
    @IsBoolean({message: 'field premium must be boolean'})
    public isPremium?: boolean;

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

    @IsEnum(RentaOfferCity, {message: 'type must be one of the city'})
    public city!: RentaOfferCity;

    @IsBoolean({message: 'field premium must be boolean'})
    public isPremium!: boolean;

    @IsEnum(OfferType, {message: 'type must be one of the city type'})
    public type!: OfferType;

    @Min(1, {message: 'Min count of rooms is 1'})
    @Max(8, {message: 'Max count of rooms is 8'})
    public rooms!: number;

    @Min(1, {message: 'Min count of guests is 1'})
    @Max(10, {message: 'Max count of guests is 10'})
    public guests!: number;

    @Min(100, {message: 'Min cost is 100'})
    @Max(100000, {message: 'Max cost is 100000'})
    public cost!: number;

    @IsArray({message: 'field facilities must be an array'})
    @IsEnum(ExtrasType, {each: true, message: 'type must be one of the facilities'})
    @ArrayNotEmpty({message: 'There should be at least 1 facility'})
    public extras!: string[];

    public author!: string;

    @IsObject({message: 'There should be object CoordinatesType'})
    public coordinates!: Coordinates;
}