import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CafeInformInput {
  @Field(() => String)
  cafeinfo: string;

  @Field(() => String)
  operatingInfo: string;

  @Field(() => String)
  cafeAddr: string;

  @Field(() => String)
  detailAddr: string;

  @Field(() => String)
  ownerNum: string;

  @Field(() => String)
  brandName: string;

  @Field(() => [String])
  cafeTag: string[];

  @Field(() => [String])
  menu_imageUrl: string[];

  @Field(() => [String])
  cafe_imageUrl: string[];
}
