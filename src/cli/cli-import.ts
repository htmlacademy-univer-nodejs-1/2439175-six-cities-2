// import { inject } from "inversify";
// import { DIComponent } from "../types/di-component.enum";
// import { LoggerInterface } from "../logger/logger-interface";
// import { DatabaseClientInterface } from "../db/db-client/db-client-interface";
// import { types } from "@typegoose/typegoose";
// import { UserEntity } from "../modules/user/user-entity";
// import { RentalOfferEntity } from "../modules/rental-offer/rental-offer-entity";
// import { RentalOfferServiceInterface } from "../modules/rental-offer/offer-rental-service-interface";
// import { ConfigInterface } from "../config/config-interface";
// import { PinoLogger } from "../logger/pino-logger";
// import { RentalOffer } from "../types/db-rental-offer";
// import { UserServiceInterface } from "../modules/user/user-service-interface";

// const DEFAULT_PASSWORD = '123456'

// export class CliImportCommand {
//     constructor(
//         @inject(DIComponent.LoggerInterface) private readonly logger: LoggerInterface,
//         @inject(DIComponent.DatabaseClientInterface) private readonly databaseClientInterface: DatabaseClientInterface,
//         @inject(DIComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>,
//         @inject(DIComponent.RentalOfferModel) private readonly rentalOfferModel: types.ModelType<RentalOfferEntity>,
//         @inject(DIComponent.RentalOfferServiceInterface) private readonly rentalOfferService: RentalOfferServiceInterface,
//         @inject(DIComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
//         @inject(DIComponent.ConfigInterface) private readonly configInterface: ConfigInterface<PinoLogger>
//     ) {}
    
//     // public async importOffer(rentalOffer: RentalOffer) {
//     //     const user = this.userService.findOrCreate(
//     //         ...rentalOffer.author, 
//     //     )
//     // }

// }