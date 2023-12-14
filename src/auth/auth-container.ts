import { Container } from "inversify";
import { AuthInterface } from "./auth-service.interface.js";
import { DIComponent } from "../types/di-component.enum.js";
import { ExceptionFilterInterface } from "../exception-filters/exception-filter.interface.js";
import { AuthService } from "./default-auth-service.js";
import { AuthExceptionFilter } from "./auth-exceptions-filter.js";

export function createAuthContainer() {
    const container = new Container();
    container.bind<AuthInterface>(DIComponent.AuthServiceInterface).to(AuthService).inSingletonScope();
    container.bind<ExceptionFilterInterface>(DIComponent.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
  
    return container;
  }