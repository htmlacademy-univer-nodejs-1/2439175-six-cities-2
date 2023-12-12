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
    const commentDTO = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.addComment(offerId);
    const all = this.commentModel.find({offerId}).select('rating');
    const offer = await this.offerService.findById(offerId);
    const commentsCount = offer?.comments ?? 1;
    const newRating = all['rating'] / (commentsCount);
    await this.offerService.updateRating(offerId, newRating);
    return commentDTO.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({offerId}).sort({createdAt: -1}).limit(COMMENTS_MAX).populate('authorId');      
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({offerId}).exec();
    return result.deletedCount;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.commentModel.exists({_id: offerId})) !== null;
  }
}