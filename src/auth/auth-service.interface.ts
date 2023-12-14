import { LoginUserDTO } from "../modules/user/dto/login-user.dto.js";
import { UserEntity } from "../modules/user/user-entity.js";

export interface AuthInterface {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDTO): Promise<UserEntity>;
}