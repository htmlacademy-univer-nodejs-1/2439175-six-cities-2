import { inject, injectable } from "inversify";
import { Controller } from "../../controller/controller.abstract.js";
import { DIComponent } from "../../types/di-component.enum.js";
// import { RentalOfferServiceInterface } from "../rental-offer/offer-rental-service-interface.js";
import { LoggerInterface } from "../../logger/logger-interface.js";
import { CommentServiceInterface } from "./comment-interface.js";
import { HttpMethod } from "../../types/http-methods.enum.js";
import { Request, Response } from "express";
import { createDTOfromRDO } from "../../helpers/common.js";
import CommentRdo from "./rdo/comment-rdo.js";

@injectable()
export class CommentController extends Controller {
    constructor(
        // @inject(DIComponent.RentalOfferServiceInterface) private readonly _rentalOfferInterface: RentalOfferServiceInterface,
        @inject(DIComponent.LoggerInterface) protected readonly logger: LoggerInterface,
        @inject(DIComponent.CommentServiceInterface) private readonly commentInterface: CommentServiceInterface
    ) {
        super(logger);

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Post,
            handler: this.create
        })
    }

    public async create({body, params}: Request, res: Response): Promise<void> {
        const comment = await this.commentInterface.createForOffer(
            {
              ...body, offerId:
              params.offerId, userId:
              params.id
            }
        );
        this.created(res, createDTOfromRDO(CommentRdo, comment))
    }
}