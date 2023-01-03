import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCouponInput {
  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  cafeId: string;

  @Field(() => Int)
  stamp: number;

  @Field(() => String)
  password: string;
}
