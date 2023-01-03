import { Context, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/types/context';
import { DeletedCouponService } from './deletedcoupon.service';

@Resolver()
export class DeletedCouponResolver {
  constructor(private readonly deletedCouponService: DeletedCouponService) {}

  @Query(() => String)
  fetchExpiredCoupon(@Context() context: IContext) {
    return this.deletedCouponService.findExpiredCoupon({ context });
  }

  @Query(() => String)
  fetchDeletedCoupon(@Context() context: IContext) {
    return this.deletedCouponService.findDeletedCoupon({ context });
  }
}
