import { inject, injectable } from "inversify";
import { Controller } from "../../controller/controller.abstract.js";
import { DIComponent } from "../../types/di-component.enum.js";
import { LoggerInterface } from "../../logger/logger-interface.js";
import RentalOfferService from "./rental-offer.js";
import { UserServiceInterface } from "../user/user-service-interface.js";
import { CommentServiceInterface } from "../comment/comment-interface.js";
import { HttpMethod } from "../../types/http-methods.enum.js";
import { Request, Response } from "express";
import { createDTOfromRDO } from "../../helpers/common.js";
import { RentalOfferRDO } from "./rdo/rental-offer-rdo.js";
import { FavouriteRentalOfferRDO } from "./rdo/favoirite-rental-offer-rdo.js";

@injectable()
export class RentalOfferController extends Controller {
    constructor(@inject(DIComponent.LoggerInterface) logger: LoggerInterface,
                @inject(DIComponent.RentalOfferServiceInterface) private readonly rentalOfferInterface: RentalOfferService,
                @inject(DIComponent.UserServiceInterface) private readonly userInterface: UserServiceInterface,
                @inject(DIComponent.CommentServiceInterface) private readonly commentInterface: CommentServiceInterface)
    {
        super(logger);

        this.logger.info('Registering routes for rentalOffer');

        this.addRoute({
            path: '/',
            method: HttpMethod.Get,
            handler: this.index
        });

        this.addRoute({
            path: '/',
            method: HttpMethod.Post,
            handler: this.create
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Get,
            handler: this.show
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Patch,
            handler: this.update
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Delete,
            handler: this.delete
        });

        this.addRoute({
            path: '/premium/:city',
            method: HttpMethod.Get,
            handler: this.showPremium
        });

        this.addRoute({
            path: '/favourites/:offerId',
            method: HttpMethod.Post,
            handler: this.addFavourite
        });

        this.addRoute({
            path: '/favourites/:offerId',
            method: HttpMethod.Delete,
            handler: this.removeFavourite
        });

        this.addRoute({
            path: '/favourites',
            method: HttpMethod.Get,
            handler: this.getFavourites,
        });
    }

    public async index({params}: Request, res: Response): Promise<void> {
        const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
        const offers = await this.rentalOfferInterface.find(offerCount);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, offers));
    }
    
    public async create({body}: Request, res: Response): Promise<void> {
        const result = await this.rentalOfferInterface.create(body);
        this.created(res, result);
    }

    public async show({params}: Request, res: Response): Promise<void> {
        const offer = await this.rentalOfferInterface.findById(params.offerId);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, offer));
    }

    public async update({params, body}: Request, res: Response): Promise<void> {
        const updatedOffer = await this.rentalOfferInterface.updateById(params.offerId, body);
        this.ok(res, updatedOffer);
    }

    public async delete({params}: Request, res: Response): Promise<void> {
        await this.rentalOfferInterface.deleteById(params.offerId);
        await this.commentInterface.deleteByOfferId(params.offerId);
        this.noContent(res, `Предложение ${params.offerId} удалено.`);
    }

    public async showPremium({params}: Request, res: Response): Promise<void> {
        const offers = await this.rentalOfferInterface.findPremiumInCity(params.city);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, offers));
    }

    public async getFavourites({params}: Request, _res: Response): Promise<void> {
        const offers = await this.userInterface.getFavourites(params.id);
        this.ok(_res, createDTOfromRDO(FavouriteRentalOfferRDO, offers));
    }

    public async addFavourite({ params }: Request, res: Response): Promise<void> {
        await this.userInterface.addToFavoritesById(params.offerId, params.id);
        this.noContent(res, {message: 'Added to favourites'});
    }

    public async removeFavourite({ params }: Request, res: Response): Promise<void> {
        await this.userInterface.removeFromFavoritesById(params.offerId, params.id);
        this.noContent(res, {message: 'Removed from favourites'});
    }
}