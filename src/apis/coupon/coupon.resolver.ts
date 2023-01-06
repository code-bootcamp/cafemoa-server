import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CouponService } from './coupon.service';
import { CreateCouponInput } from './dto/coupon-create.input';
import { Coupon } from './entities/coupon.entity';

@Resolver()
export class CouponResolver {
  constructor(
    private readonly couponService: CouponService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Coupon)
  fetchCoupon(@Args('couponId') couponId: string) {
    return this.couponService.find({ couponId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Coupon])
  fetchCoupons() {
    return this.couponService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Coupon])
  fetchUserCoupons(@Context() context: IContext, @Args('page') page: number) {
    return this.couponService.findUserCoupon({
      userId: context.req.user.id,
      page,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Coupon])
  fetchCafeCoupons(@Args('cafeId') cafeId: string, @Args('page') page: number) {
    return this.couponService.findCafeCoupon({ cafeId, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Coupon])
  fetchCouponWithLocation(
    @Args('cafeAddr') cafeAddr: string,
    @Args('page') page: number,
  ) {
    return this.couponService.findCouponLocation({ cafeAddr, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Coupon)
  createCoupon(
    @Args('createCouponInput') createCouponInput: CreateCouponInput,
  ) {
    return this.couponService.createCoupon({ createCouponInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  useCoupon(
    @Args('couponId') couponId: string,
    @Args('password') password: string,
  ) {
    return this.couponService.useCoupon({ couponId, password });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteCoupon(@Args('couponId') couponId: string) {
    return this.couponService.deleteCoupon({ couponId });
  }
}
