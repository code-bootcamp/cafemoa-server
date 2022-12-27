import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class createCommentInput {
  @Field(() => String)
  reply: string;

  @Field(() => Int)
  like: number;

  @Field(() => String)
  cafeaddr: string;

  @Field(() => String)
  tag: string;

  @Field(() => String)
  brandname: string;
}
