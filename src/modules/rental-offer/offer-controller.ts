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
import { ParamsCountForOFfer, ParamsOfferDetails, UnknownRecord } from "../../types/params.js";
import { CreateRentalOfferDTO, UpdateRentalOfferDTO } from "./dto/rental-offer-dto.js";
import CommentRdo from "../comment/rdo/comment-rdo.js";
import { ValidateObjectIdMiddleware } from "../../middleware/validate-object-id.middleware.js";
import { ValidateDtoMiddleware } from "../../middleware/validate-dto.middleware.js";
import { DocumentExistsMiddleware } from "../../middleware/document-exits.middleware.js";
import { PrivateRouteMiddleware } from "../../middleware/private-route.middleware.js";
import { ConfigInterface } from "../../config/config-interface.js";
import { SitiesSchema } from "../../config/sities-schema.js";
import { UploadFileMiddleware } from "../../middleware/upload-file.middleware.js";
import UploadImageResponse from "./rdo/upload-image-response.js";

@injectable()
export class RentalOfferController extends Controller {
    constructor(@inject(DIComponent.LoggerInterface) logger: LoggerInterface,
                @inject(DIComponent.RentalOfferServiceInterface) private readonly rentalOfferInterface: RentalOfferService,
                @inject(DIComponent.UserServiceInterface) private readonly userInterface: UserServiceInterface,
                @inject(DIComponent.CommentServiceInterface) private readonly commentInterface: CommentServiceInterface,
                @inject(DIComponent.ConfigInterface) configInterface: ConfigInterface<SitiesSchema>)
    {
        super(logger, configInterface);

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
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateDtoMiddleware(CreateRentalOfferDTO)
            ]
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
                new PrivateRouteMiddleware(),
                new ValidateObjectIdMiddleware('offerId'),
                new ValidateDtoMiddleware(UpdateRentalOfferDTO),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Delete,
            handler: this.delete,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/premium/:city',
            method: HttpMethod.Get,
            handler: this.showPremium,
            middlewares: [
                new PrivateRouteMiddleware(),
            ]
        });

        this.addRoute({
            path: '/favourites/:offerId',
            method: HttpMethod.Post,
            handler: this.addFavourite,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateObjectIdMiddleware('offerId')
            ]
        });

        this.addRoute({
            path: '/favourites/:offerId',
            method: HttpMethod.Delete,
            handler: this.removeFavourite,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/favourites',
            method: HttpMethod.Get,
            handler: this.getFavourites,
            middlewares: [
                new PrivateRouteMiddleware(),
            ]
        });

        this.addRoute({
            path: '/:offerId/comments', 
            method: HttpMethod.Get, 
            handler: this.getComments,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(this.rentalOfferInterface, 'RentalOffer', 'offerId')]
        });

        this.addRoute({
            path: '/:offerId/image',
            method: HttpMethod.Post,
            handler: this.uploadImage,
            middlewares: [
              new PrivateRouteMiddleware(),
              new ValidateObjectIdMiddleware('offerId'),
              new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'preview'),
            ]
          });
    }

    public async index({params}: Request<ParamsCountForOFfer>, res: Response): Promise<void> {
        const offerCount = params.count ? parseInt(`${params.count}`, 10) : 60;
        const offers = await this.rentalOfferInterface.find(offerCount);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, offers));
    }
    
    public async create({ body, tokenPayload }: Request<UnknownRecord, UnknownRecord, CreateRentalOfferDTO>, res: Response): Promise<void> {
        const result = await this.rentalOfferInterface.create({...body, author: tokenPayload.id});
        const offer = await this.rentalOfferInterface.findById(result.id);
        this.created(res, createDTOfromRDO(RentalOfferRDO, offer));
    }

    public async show({params}: Request<ParamsOfferDetails>, res: Response): Promise<void> {
        const { offerId } = params;
        const offer = await this.rentalOfferInterface.findById(offerId);
        this.ok(res, createDTOfromRDO(RentalOfferRDO, offer));
    }

    public async update({params, body}: Request<ParamsOfferDetails, UnknownRecord, UpdateRentalOfferDTO>, res: Response): Promise<void> {
        const updatedOffer = await this.rentalOfferInterface.updateById(params.offerId, {...body});
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

    public async getFavourites({tokenPayload}: Request, _res: Response): Promise<void> {
        const offers = await this.userInterface.getFavourites(tokenPayload.id);
        this.ok(_res, createDTOfromRDO(FavouriteRentalOfferRDO, offers));
    }

    public async addFavourite({ params, tokenPayload }: Request, res: Response): Promise<void> {
        await this.userInterface.addToFavoritesById(tokenPayload.id, params.offerId);
        this.noContent(res, {message: 'Added to favourites'});
    }

    public async removeFavourite({ params, tokenPayload }: Request, res: Response): Promise<void> {
        await this.userInterface.removeFromFavoritesById(tokenPayload.id, params.offerId);
        this.noContent(res, {message: 'Removed from favourites'});
    }

    public async uploadImage(req: Request<ParamsOfferDetails>, res: Response) {
        const {offerId} = req.params;
        const updateDto = { preview: req.file?.filename };
        await this.rentalOfferInterface.updateById(offerId, updateDto);
        this.created(res, createDTOfromRDO(UploadImageResponse, {updateDto}));
      }
}