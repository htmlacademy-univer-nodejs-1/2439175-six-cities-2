import { inject, injectable } from "inversify";
import { DIComponent } from "../../types/di-component.enum.js";
import {DocumentType, types} from '@typegoose/typegoose';
import { CommentEntity } from "./comment-entity.js";
import { RentalOfferServiceInterface } from "../rental-offer/offer-rental-service-interface.js";
import { CommentServiceInterface } from "./comment-interface.js";
import CreateCommentDto from "./dto/create-comment-dto.js";

const COMMENTS_MAX = 50;
@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(DIComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(DIComponent.RentalOfferServiceInterface) private readonly offerService: RentalOfferServiceInterface
  ) {
  }

  public async createForOffer(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const commentDTO = await this.commentModel.create({...dto, publicationDate: Date.now()});
    const offerId = dto.offerId;
    await this.offerService.addComment(offerId);
    const ratings = await this.commentModel.find({offerId}).select('rating');
    const sum = ratings.map(obj => obj.rating).reduce((total, cur) => total + cur, 0)
    const avg = Math.round(sum / ratings.length * 10) /10;
    await this.offerService.updateRating(offerId, avg);
    return commentDTO.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({offerId}).sort({createdAt: -1}).limit(COMMENTS_MAX).populate('userId');      
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({offerId}).exec();
    return result.deletedCount;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.commentModel.exists({_id: offerId})) !== null;
  }
}