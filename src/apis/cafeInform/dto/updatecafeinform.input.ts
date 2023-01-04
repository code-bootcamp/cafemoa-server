import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCafeInform {
  @Field(() => String, { nullable: true })
  cafeinfo: string;

  @Field(() => String, { nullable: true })
  operatingInfo: string;

  @Field(() => String, { nullable: true })
  cafeAddr: string;

  @Field(() => String, { nullable: true })
  ownerNum: string;

  @Field(() => String, { nullable: true })
  brandName: string;

  @Field(() => [String], { nullable: true })
  menu_imageUrl: string[];

  @Field(() => [String], { nullable: true })
  cafe_imageUrl: string[];

  @Field(() => [String])
  cafeTag: string[];
}
