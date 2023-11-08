import mongoose, {Mongoose} from "mongoose";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { setTimeout } from "node:timers/promises";
import { DatabaseClientInterface } from "./db-client-interface.js";
import { DIComponent } from "../../types/di-component.enum.js";
import { LoggerInterface } from "../../logger/logger-interface.js";

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export default class MongoClientService implements DatabaseClientInterface {
    private mongoDB: Mongoose | null = null;

    constructor(
        @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface
    ) {}

    private async connectWithRetry_(ip: string): Promise<void> {
        let amount = 0;
        while (amount < RETRY_COUNT) {
            try {
                this.mongoDB = await mongoose.connect(ip);
                return;
            } catch (error) {
                this.logger.warn(`Unable to connect to MongoDB at ${amount + 1} time`)
                amount++;
                await setTimeout(RETRY_TIMEOUT);
            }
        }
    }

    private async disconnect_(): Promise<void> {
        await this.mongoDB?.disconnect();
        this.mongoDB = null;
    }

    async connect(ip: string): Promise<void> {
        if (this.mongoDB !== null) {
            throw new Error("MongoDB already connected");
        }
        this.logger.info("Connecting to MongoDB");
        await this.connectWithRetry_(ip);
        this.logger.info("Connected to MongoDB succesfully");
    }

    public isConnected(): boolean {
        return this.mongoDB !== null;
    }

    async disconnect(): Promise<void> {
        if (this.mongoDB === null) {
            throw new Error("MongoDB already disconnected");
        }
        this.logger.info("Disconnecting to MongoDB");
        await this.disconnect_();
        this.logger.info("Disonnected to MongoDB succesfully");

    }
}