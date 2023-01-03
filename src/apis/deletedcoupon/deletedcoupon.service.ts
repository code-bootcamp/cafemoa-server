import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Repository } from 'typeorm';
import { DeletedCoupon } from './entities/deletedcoupon.entity';

@Injectable()
export class DeletedCouponService {
  constructor(
    @InjectRepository(DeletedCoupon)
    private readonly deletedCouponRepository: Repository<DeletedCoupon>,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  findExpiredCoupon({ context }) {
    return this.deletedCouponRepository.find({
      where: { expired: true, user: { id: context.user.id } },
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  findDeletedCoupon({ context }) {
    return this.deletedCouponRepository.find({
      where: { expired: false, user: { id: context.user.id } },
    });
  }
}
