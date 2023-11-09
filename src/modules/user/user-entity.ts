import typegoose, { defaultClasses, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { User } from "../../types/db-user.js";
import { UserType } from "../../types/db-user-enum.js";
import { createSHA256 } from "../../helpers/common.js";

const { prop } = typegoose;
const RICK_ASTLEY_AVATAR = 'https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'users'
    }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({required: true, minlength: 1, maxlength: 15})
    public firstname!: string;

    @prop({match: [/^[\w-\.]+@([\w-]+)\.[\w-]+/, 'Email is incorrect'], required: true, unique: true})
    public email!: string;

    @prop({default: RICK_ASTLEY_AVATAR, match: /.*\.(jpg|jpeg|png|gif)$/, required: false})
    public avatarSourcePath!: string;

    public password!: string;

    @prop({required: true, enum: UserType, type: () => String})
    public type!: UserType;

    constructor(user: User) {
        super();

        this.email = user.email,
        this.firstname = user.firstname,
        this.avatarSourcePath = user.avatarSourcePath,
        this.type = user.type
    }

    public setPassword(password: string, salt: string) {
        this.password = createSHA256(password, salt);
    }

    public getPassword() {
        return this.password;
    }

    public checkPassword = (password: string, salt: string) => createSHA256(password, salt) === this.password;
}

export const UserModel = getModelForClass(UserEntity); 