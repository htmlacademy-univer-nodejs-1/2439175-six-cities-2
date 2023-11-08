import { pino, Logger } from 'pino';
import { LoggerInterface } from './logger-interface';
import { injectable } from 'inversify';
import "reflect-metadata";

@injectable()
export class PinoLogger implements LoggerInterface {
    readonly logger: Logger;
    constructor() {
        this.logger = pino();
    }

    info(message: string, ...params: unknown[]): void {
        this.logger.info(message, params);
    }
    warn(message: string, ...params: unknown[]): void {
        this.logger.warn(message, params);
    }
    debug(message: string, ...params: unknown[]): void {
        this.logger.debug(message, params);
    }
    trace(message: string, ...params: unknown[]): void {
        this.logger.trace(message, params);
    }
    error(message: string, ...params: unknown[]): void {
        this.logger.error(message, params);
    }

}