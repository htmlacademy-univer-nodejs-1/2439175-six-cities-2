import { UserType } from "../../../types/db-user-enum.js";

export class CreateUserDTO {
    public email!: string;
    public avatarSourcePath!: string;
    public firstname!: string;
    public password!: string;
    public type!: UserType;
}