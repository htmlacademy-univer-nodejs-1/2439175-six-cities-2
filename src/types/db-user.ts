import { UserType } from "./db-user-enum";

export type User = {
    firstname: string;
    email: string;
    avatarSourcePath: string;
    type: UserType;
    favourites: [string];
}