import {Expose} from 'class-transformer';
import { UserType } from '../../../types/db-user-enum.js';

export default class UserRdo {
    @Expose()
    public id!: string;

    @Expose()
    public firstname!: string;

    @Expose()
    public email!: string;

    @Expose()
    public avatarSourcePath!: string;

    @Expose()
    public type!: UserType;
}