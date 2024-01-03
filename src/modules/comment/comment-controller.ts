import { inject, injectable } from "inversify";
import { Controller } from "../../controller/controller.abstract.js";
import { DIComponent } from "../../types/di-component.enum.js";
import { RentalOfferServiceInterface } from "../rental-offer/offer-rental-service-interface.js";
import { LoggerInterface } from "../../logger/logger-interface.js";
import { CommentServiceInterface } from "./comment-interface.js";
import { HttpMethod } from "../../types/http-methods.enum.js";
import { Request, Response } from "express";
import { createDTOfromRDO } from "../../helpers/common.js";
import CommentRdo from "./rdo/comment-rdo.js";
import { UnknownRecord } from "../../types/params.js";
import CreateCommentDto from "./dto/create-comment-dto.js";
import { HttpError } from "../../errors/http-errors.js";
import { StatusCodes } from "http-status-codes";
import { ValidateObjectIdMiddleware } from "../../middleware/validate-object-id.middleware.js";
import { ValidateDtoMiddleware } from "../../middleware/validate-dto.middleware.js";
import { PrivateRouteMiddleware } from "../../middleware/private-route.middleware.js";
import { ConfigInterface } from "../../config/config-interface.js";
import { SitiesSchema } from "../../config/sities-schema.js";

@injectable()
export class CommentController extends Controller {
    constructor(
        @inject(DIComponent.RentalOfferServiceInterface) private readonly rentalOfferInterface: RentalOfferServiceInterface,
        @inject(DIComponent.LoggerInterface) protected readonly logger: LoggerInterface,
        @inject(DIComponent.CommentServiceInterface) private readonly commentInterface: CommentServiceInterface,
        @inject(DIComponent.ConfigInterface) configInterface: ConfigInterface<SitiesSchema>
    ) {
        super(logger, configInterface);

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Post,
            handler: this.create,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateObjectIdMiddleware('offerId'),
                new ValidateDtoMiddleware(CreateCommentDto) ]
        })
    }

    public async create({params, body, tokenPayload}: Request<UnknownRecord, UnknownRecord, CreateCommentDto>, res: Response): Promise<void> {
        if (!await this.rentalOfferInterface.exists(params.offerId)) {
            throw new HttpError (
                StatusCodes.NOT_FOUND,
                `Offer with id ${params.offerId} not found`,
                'CommentController'
            );
        }
        const comment = await this.commentInterface.createForOffer({...body, userId: tokenPayload.id, offerId: params.offerId});
        await this.rentalOfferInterface.addComment(params.offerId)
        this.created(res, createDTOfromRDO(CommentRdo, comment))
    }
}