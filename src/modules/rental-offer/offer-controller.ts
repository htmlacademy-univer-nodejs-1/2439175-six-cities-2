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
import { ParamsOfferDetails, UnknownRecord } from "../../types/params.js";
import { CreateRentalOfferDTO, UpdateRentalOfferDTO } from "./dto/rental-offer-dto.js";
import CommentRdo from "../comment/rdo/comment-rdo.js";
import { ValidateObjectIdMiddleware } from "../../middleware/validate-object-id.middleware.js";
import { ValidateDtoMiddleware } from "../../middleware/validate-dto.middleware.js";
import { DocumentExistsMiddleware } from "../../middleware/document-exits.middleware.js";

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
            handler: this.create,
            middlewares: [new ValidateDtoMiddleware(CreateRentalOfferDTO)]
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Get,
            handler: this.show,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Patch,
            handler: this.update,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new ValidateDtoMiddleware(UpdateRentalOfferDTO),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Delete,
            handler: this.delete,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/premium/:city',
            method: HttpMethod.Get,
            handler: this.showPremium
        });

        this.addRoute({
            path: '/favourites/:offerId',
            method: HttpMethod.Post,
            handler: this.addFavourite,
            middlewares: [new ValidateObjectIdMiddleware('offerId')]
        });

        this.addRoute({
            path: '/favourites/:offerId',
            method: HttpMethod.Delete,
            handler: this.removeFavourite,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/favourites',
            method: HttpMethod.Get,
            handler: this.getFavourites,
        });

        this.addRoute({
            path: '/:offerId/comments', 
            method: HttpMethod.Get, 
            handler: this.getComments,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });
    }

    public async index(_req: Request, res: Response): Promise<void> {
        const offers = await this.rentalOfferInterface.find(undefined);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, offers));
    }
    
    public async create({ body }: Request<UnknownRecord, UnknownRecord, CreateRentalOfferDTO>, res: Response): Promise<void> {
        const result = await this.rentalOfferInterface.create(body);
        const offer = await this.rentalOfferInterface.findById(result.id);
        this.created(res, createDTOfromRDO(RentalOfferRDO, offer));
    }

    public async show({params}: Request<ParamsOfferDetails>, res: Response): Promise<void> {
        const { offerId } = params;
        const offer = await this.rentalOfferInterface.findById(offerId);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, offer));
    }

    public async update({params, body}: Request<ParamsOfferDetails, UnknownRecord, UpdateRentalOfferDTO>, res: Response): Promise<void> {
        const updatedOffer = await this.rentalOfferInterface.updateById(params.offerId, body);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, updatedOffer));
    }

    public async getComments(
        { params }: Request<ParamsOfferDetails, UnknownRecord, UnknownRecord>,
        res: Response
      ): Promise<void> {
        const {offerId} = params;
        const comments = await this.commentInterface.findByOfferId(offerId);
        this.ok(res, createDTOfromRDO(CommentRdo, comments));
    }

    public async delete({params}: Request<ParamsOfferDetails>, res: Response): Promise<void> {
        const { offerId } = params;
        const offer = await this.rentalOfferInterface.deleteById(offerId);
        await this.commentInterface.deleteByOfferId(params.offerId);
        this.noContent(res, offer);
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