import { inject, injectable } from "inversify";
import * as crypto from 'node:crypto';
import { DIComponent } from "../types/di-component.enum.js";
import { LoggerInterface } from "../logger/logger-interface.js";
import { AuthInterface } from "./auth-service.interface.js";
import { ConfigInterface } from "../config/config-interface.js";
import { SitiesSchema } from "../config/sities-schema.js";
import { UserServiceInterface } from "../modules/user/user-service-interface.js";
import { UserEntity } from "../modules/user/user-entity.js";
import { TokenPayload } from "../types/token-payload.js";
import { SignJWT } from "jose";
import { JWT_ALGORITHM, JWT_EXPIRED } from "./auth-constant.js";
import { LoginUserDTO } from "../modules/user/dto/login-user.dto";
import { ForbiddenError } from "../errors/forbidden-error.js";
import { NotFoundError } from "../errors/not-found-error.js";

@injectable()
export class AuthService implements AuthInterface {
  constructor(
    @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(DIComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(DIComponent.ConfigInterface) private readonly config: ConfigInterface<SitiesSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    console.log(user.id)
    console.log(user._id)
    const tokenPayload: TokenPayload = {
      email: user.email,
      firstname: user.firstname,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new NotFoundError();
    }

    if (!user.checkPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new ForbiddenError();
    }

    return user;
  }


}