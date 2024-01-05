import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Coordinates, OfferType, RentaOfferCity } from "../../types/db-rental-offer-enum.js";
import { UserEntity } from "../user/user-entity.js";

export interface RentalOfferEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'rentalOffers'
    }
})
export class RentalOfferEntity extends defaultClasses.TimeStamps {
    @prop({required: true, minlength: 10, maxlength: 100, type: String})
    public name!: string;

    @prop({required: true, minlength: 20, maxlength: 1024, type: String})
    public description!: string;

    @prop({required: true})
    public date!: Date;

    @prop({required: true, type: () => String, enum: RentaOfferCity})
    public city!: RentaOfferCity;

    @prop({required: true, type: String, default: ''})
    public preview!: string;

    @prop({required: true, type: [String], validate: {
        validator: function (v: string[]) {
          return v.length === 6;
        },
        message: 'photoes must have exactly 6 elements'},
        default: []})
    public photoes!: string[];
    
    @prop({required: true, type: Boolean})
    public isPremium!: boolean;

    @prop({required: true, type: Boolean})
    public isFavourite!: boolean;
    
    @prop({required: true, min:1, max: 5, type: Number})
    public rating!: number;
    
    @prop({required: true, enum: OfferType, type: () => String})
    public type!: OfferType;

    @prop({required: true, min: 1, max: 5, type: Number})
    public rooms!: number;

    @prop({required: true, min: 1, max: 10, type: Number})
    public guests!: number;

    @prop({required: true, min: 100, max: 100000, type: Number})
    public cost!: number;

    @prop({required: true, default: [], type: [String]})
    public extras!: string[];

    @prop({required: true, type: () => String})
    public coordinates!: Coordinates;

    @prop({default: 0})
    public comments!: number;

    @prop({ref: UserEntity, required: true})
    public author!: Ref<UserEntity>;
}

export const RentalOfferModel = getModelForClass(RentalOfferEntity); 