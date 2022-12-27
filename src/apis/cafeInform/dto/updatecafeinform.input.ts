import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCafeInform {
  @Field(() => String, { nullable: true })
  cafeinfo: string;

  @Field(() => String, { nullable: true })
  closedDay: string;

  @Field(() => String, { nullable: true })
  operatingTime: string;

  @Field(() => String, { nullable: true })
  cafeAddr: string;

  @Field(() => Float, { nullable: true })
  lat: number;

  @Field(() => Float, { nullable: true })
  lng: number;
}
