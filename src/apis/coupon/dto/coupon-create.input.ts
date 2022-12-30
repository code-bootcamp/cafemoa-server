import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCouponInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  cafeId: string;

  @Field(() => Int)
  stamp: number;
}
