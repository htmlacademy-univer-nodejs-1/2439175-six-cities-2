import { injectable } from "inversify";
import { LoggerInterface } from "./logger-interface";
import "reflect-metadata";

@injectable()
export class ConsoleLogger implements LoggerInterface {
    info(message: string, ...params: unknown[]): void {
        console.info(message, params);
    }
    warn(message: string, ...params: unknown[]): void {
        console.warn(message, params);
    }
    debug(message: string, ...params: unknown[]): void {
        console.debug(message, params);
    }
    trace(message: string, ...params: unknown[]): void {
        console.trace(message, params);
    }
    error(message: string, ...params: unknown[]): void {
        console.error(message, params);
    }
}