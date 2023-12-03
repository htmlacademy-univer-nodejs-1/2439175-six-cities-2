import typegoose, { Ref, defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { RentalOfferEntity } from '../rental-offer/rental-offer-entity.js'
import { UserEntity } from '../user/user-entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
      collection: 'comments'
    }
  })
  export class CommentEntity extends defaultClasses.TimeStamps {
    @prop({type: () => String, required: true, minlength: 5, maxlength: 1024})
    public text!: string;
  
    @prop({ref: RentalOfferEntity, required: true})
    public offerId!: Ref<RentalOfferEntity>;
  
    @prop({type: () => Date,required: true})
    public publicationDate!: Date;
  
    @prop({ref: UserEntity, required: true,})
    public authorId!: Ref<UserEntity>;
  
    @prop({type: () => Number, required: true, min: 1, max: 5})
    public rating!: number;
  }
  
  export const CommentModel = getModelForClass(CommentEntity);