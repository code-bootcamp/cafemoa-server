import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CouponService } from './coupon.service';
import { CreateCouponInput } from './dto/coupon-create.input';
import { Coupon } from './entities/coupon.entity';

@Resolver()
export class CouponResolver {
  constructor(
    private readonly couponService: CouponService, //
  ) {}

  @Query(() => Coupon)
  fetchCoupon(@Args('couponId') couponId: string) {
    return this.couponService.find({ couponId });
  }

  @Query(() => [Coupon])
  fetchCoupons() {
    return this.couponService.findAll();
  }

  @Query(() => [Coupon])
  fetchUserCoupons(@Args('userId') userId: string) {
    return this.couponService.findUserCoupon({ userId });
  }

  @Query(() => [Coupon])
  fetchCafeCoupons(@Args('cafeId') cafeId: string) {
    return this.couponService.findCafeCoupon({ cafeId });
  }

  @Mutation(() => Coupon)
  createCoupon(
    @Args('createCouponInput') createCouponInput: CreateCouponInput,
  ) {
    return this.couponService.createCoupon({ createCouponInput });
  }

  @Mutation(() => String)
  deleteCoupon(@Args('couponId') couponId: string) {
    return this.couponService.deleteCoupon({ couponId });
  }
}
