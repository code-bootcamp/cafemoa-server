import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Owner } from '../entities/owner.entity';

@InputType()
export class OwnerInput extends OmitType(Owner, ['id'], InputType) {
  @Field(() => String)
  password: string;
  @Field(() => String)
  ownerPassword: string;
}
