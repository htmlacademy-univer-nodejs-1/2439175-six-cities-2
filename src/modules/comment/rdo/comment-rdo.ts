import { Expose } from "class-transformer";
import UserRdo from "../../user/rdo/user-rdo.js";

export default class CommentRdo {
    @Expose()
    public id!: string;

    @Expose()
    public text!: string;

    @Expose()
    public date!: string;

    @Expose({name: "userId"})
    public user!: UserRdo;

    @Expose()
    public rating!: number;
  }