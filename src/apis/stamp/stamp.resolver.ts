import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateStampInput } from './dto/stamp-create.input';
import { Stamp } from './entities/stamp.entity';
import { StampService } from './stamp.service';

@Resolver()
export class StampResolver {
  constructor(
    private readonly stampService: StampService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Stamp)
  fetchCoupon(@Args('stampId') stampId: string) {
    return this.stampService.find({ stampId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchCoupons() {
    return this.stampService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchCafeCoupons(
    @Args('cafeId') cafeId: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    page = page === undefined ? 1 : page;
    return this.stampService.findCafeStamp({ cafeId, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchCouponWithLocation(
    @Args('cafeAddr') cafeAddr: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    page = page === undefined ? 1 : page;
    return this.stampService.findStampLocation({ cafeAddr, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Stamp)
  createCoupon(@Args('createCouponInput') createStampInput: CreateStampInput) {
    return this.stampService.createStamp({ createStampInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteCoupon(@Args('stampId') stampId: string) {
    return this.stampService.deleteCoupon({ stampId });
  }
}
