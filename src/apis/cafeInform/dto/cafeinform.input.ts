import { Field, Float, InputType } from '@nestjs/graphql';
import { OwnerInput } from 'src/apis/owner/dto/owner.input';

@InputType()
export class CafeInformInput {
  @Field(() => String)
  cafeinfo: string;

  @Field(() => String)
  closedDay: string;

  @Field(() => String)
  operatingTime: string;

  @Field(() => String)
  cafeAddr: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;

  @Field(() => [String])
  menu_imageUrl: string[];

  @Field(() => [String])
  cafe_imageUrl: string[];

  @Field(() => OwnerInput)
  ownerInput: OwnerInput;
}
