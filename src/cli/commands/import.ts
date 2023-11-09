import { Command } from '../command-interface.js';
import { TSVFileReader } from '../../file-reader/tsv-file-reader.js';
import { MongoDBURI } from '../../helpers/db-address.js';
import { UserServiceInterface } from '../../modules/user/user-service-interface.js';
import { createOffer } from '../../helpers/create-offer.js';
import { RentalOfferServiceInterface } from '../../modules/rental-offer/offer-rental-service-interface.js';
import { RentalOfferModel } from '../../modules/rental-offer/rental-offer-entity.js';
import { DatabaseClientInterface } from '../../db/db-client/db-client-interface.js';
import MongoClientService from '../../db/db-client/mongo-client-service.js';
import { LoggerInterface } from '../../logger/logger-interface.js';
import { ConsoleLogger } from '../../logger/console-logger.js';
import { UserModel } from '../../modules/user/user-entity.js';
import { RentalOffer } from '../../types/db-rental-offer.js';
import RentalOfferService from '../../modules/rental-offer/rental-offer.js';
import { UserService } from '../../modules/user/user-service.js';

const DEFAULT_USER_PASSWORD = '123456';
const DEFAULT_DB_PORT = '27017';

export class ImportCommand implements Command {
  private userService: UserServiceInterface;
  private offerService: RentalOfferServiceInterface;
  private databaseClient: DatabaseClientInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new RentalOfferService(this.logger, RentalOfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseClient = new MongoClientService(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: RentalOffer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      date: offer.date,
      photoes: offer.photoes,
      preview: offer.preview,
      city: offer.city,
      isPremium: offer.isPremium, 
      isFavourite: offer.isFavourite,
      rating: offer.rating,
      type: offer.type,
      rooms: offer.rooms,
      guests: offer.guests,
      cost: offer.cost,
      extras: offer.extras,
      author: user.id, 
      coordinates: offer.coordinates,
    });

  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = MongoDBURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(error);
    }
  }
}