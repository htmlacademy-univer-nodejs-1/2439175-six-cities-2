import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from "class-validator";
import { UserType } from "../../../types/db-user-enum.js";
import { photoRegExp } from "../../rental-offer/dto/rental-offer-dto.js";

export class CreateUserDTO {
    @IsEmail({}, {message: 'Email must be valid.'})
    @IsString({message: 'Email is required.'})
    public email!: string;

    @Length(1, 15, {message: 'Username length should be from 1 to 15.'})
    @IsString({message: 'Username is required.'})
    public firstname!: string;

    @Length(6, 12, {message: 'Password length should be from 6 to 12.'})
    @IsString({message: 'Password is required.'})
    public password!: string;

    @IsEnum(UserType, {message: 'type must be one of the user type'})
    public type!: UserType;

    @IsOptional()
    @Matches(photoRegExp, {message: "Photoes must end with .jpg, .jpeg or .png"})
    @IsString({message: "AvatarSourcePath msust be a string"})
    public avatarSourcePath?: string;
}