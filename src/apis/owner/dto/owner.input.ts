import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CafeInformInput } from 'src/apis/cafeInform/dto/cafeinform.input';
import { Owner } from '../entities/owner.entity';

@InputType()
export class OwnerInput extends OmitType(Owner, ['id'], InputType) {
  @Field(() => CafeInformInput)
  cafeInformInput: CafeInformInput;
}
