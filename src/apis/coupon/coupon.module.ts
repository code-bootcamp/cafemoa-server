import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { DeletedCoupon } from '../deletedcoupon/entities/deletedcoupon.entity';
import { Owner } from '../owner/entities/owner.entity';
import { StampHistory } from '../stamphistory/entities/stamphistory.entity';
import { User } from '../user/entities/user.entity';
import { CouponResolver } from './coupon.resolver';
import { CouponService } from './coupon.service';
import { Coupon } from './entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Coupon, //
      User,
      CafeInform,
      Owner,
      StampHistory,
      DeletedCoupon,
    ]),
  ],
  providers: [CouponService, CouponResolver],
})
export class CouponModule {}
