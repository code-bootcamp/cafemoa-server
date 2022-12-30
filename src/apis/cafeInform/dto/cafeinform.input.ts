import { Field, Float, InputType } from '@nestjs/graphql';

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
