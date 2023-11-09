import { injectable } from "inversify";
import { LoggerInterface } from "./logger-interface";
import "reflect-metadata";

@injectable()
export class ConsoleLogger implements LoggerInterface {
    public info(message: string, ...params: unknown[]): void {
        console.info(message, params);
    }
    public warn(message: string, ...params: unknown[]): void {
        console.warn(message, params);
    }
    public debug(message: string, ...params: unknown[]): void {
        console.debug(message, params);
    }
    public trace(message: string, ...params: unknown[]): void {
        console.trace(message, params);
    }
    public error(message: string, ...params: unknown[]): void {
        console.error(message, params);
    }
}