import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { Owner } from '../owner/entities/owner.entity';
import { StampHistory } from '../stamphistory/entities/stamphistory.entity';
import { User } from '../user/entities/user.entity';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CafeInform)
    private readonly cafeInformRepository: Repository<CafeInform>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(StampHistory)
    private readonly stampHistoryRepository: Repository<StampHistory>,
  ) {}

  async find({ couponId }) {
    return await this.couponRepository.findOne({ where: { id: couponId } });
  }

  async findAll() {
    return await this.couponRepository.find();
  }

  async findUserCoupon({ userId }) {
    return await this.couponRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  async findCafeCoupon({ cafeId }) {
    return await this.couponRepository.find({
      where: {
        cafeInform: { id: cafeId },
      },
      relations: ['cafeInform'],
    });
  }

  async createCoupon({ createCouponInput }) {
    const { stamp, userId, cafeId } = createCouponInput;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const cafeInform = await this.cafeInformRepository.findOne({
      where: { id: cafeId },
      relations: ['owner'],
    });

    const owner = await this.ownerRepository.findOne({
      where: { id: cafeInform.owner.id },
    });

    const coupon = await this.couponRepository.findOne({
      where: { user: { id: userId }, cafeInform: { id: cafeId } },
    });
    console.log(coupon, owner);

    if (coupon) {
      const result = await this.couponRepository.save({
        id: coupon.id,
        stamp: coupon.stamp + stamp,
        accstamp: coupon.accstamp + stamp,
        user: { ...user },
        cafeInform: { ...cafeInform },
      });
      await this.stampHistoryRepository.save({
        stamp,
        user: { ...user },
        owner: { ...owner },
        coupon: { ...result },
      });
      return result;
    } else {
      const result = await this.couponRepository.save({
        stamp: stamp,
        accstamp: stamp,
        user: { ...user },
        cafeInform: { ...cafeInform },
      });
      await this.stampHistoryRepository.save({
        stamp,
        user: { ...user },
        owner: { ...owner },
        coupon: { ...result },
      });
      return result;
    }
  }

  async deleteCoupon({ couponId }) {
    await this.couponRepository.delete({ id: couponId });
    return '삭제가 완료되었습니다.';
  }
}
