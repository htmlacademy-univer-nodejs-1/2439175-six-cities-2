import { Expose } from 'class-transformer';
import { UserType } from '../../../types/db-user-enum.js';

export class LoggedUserRdo {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarSourcePath!: string;

  @Expose()
  public firstname!: string;

  @Expose()
  public type!: UserType;
}