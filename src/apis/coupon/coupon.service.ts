import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { Owner } from '../owner/entities/owner.entity';
import { User } from '../user/entities/user.entity';
import { Coupon } from './entities/coupon.entity';
import * as bcrypt from 'bcrypt';
import { StampHistory } from '../stamphistory/entities/stamphistory.entity';

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
    const result = await this.couponRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
    return result.sort((a, b) => b.stamp - a.stamp);
  }

  async findCafeCoupon({ cafeId }) {
    return await this.couponRepository.find({
      where: {
        cafeInform: { id: cafeId },
      },
      relations: ['cafeInform'],
    });
  }

  async findCouponLocation({ cafeAddr }) {
    const cafe = await this.couponRepository.find({
      relations: ['cafeInform'],
    });
    return cafe.filter((el) => el.cafeInform.cafeAddr.includes(cafeAddr));
  }

  async createCoupon({ createCouponInput }) {
    const { stamp, phoneNumber, cafeId } = createCouponInput;

    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    const cafeInform = await this.cafeInformRepository.findOne({
      where: { id: cafeId },
      relations: ['owner'],
    });

    const owner = await this.ownerRepository.findOne({
      where: { id: cafeInform.owner.id },
    });

    const coupon = await this.couponRepository.findOne({
      where: { user: { phoneNumber }, cafeInform: { id: cafeId } },
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

  async useCoupon({ password, couponId }) {
    const coupon = await this.couponRepository.findOne({
      where: { id: couponId },
      relations: ['user', 'cafeInform'],
    });

    const cafeInform = await this.cafeInformRepository.findOne({
      where: { id: coupon.cafeInform.id },
      relations: ['owner'],
    });

    const owner = await this.ownerRepository.findOne({
      where: {
        id: cafeInform.owner.id,
      },
    });

    const validOwnerPwd = await bcrypt.compare(password, owner.password);
    if (!validOwnerPwd) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    if (coupon.stamp < 10) {
      throw new UnauthorizedException('스탬프 수가 부족합니다.');
    }

    const reduceStamp = coupon.stamp - 10;

    await this.couponRepository.save({
      id: couponId,
      ...coupon,
      stamp: reduceStamp,
    });

    return coupon.user.name;
  }

  async deleteCoupon({ couponId }) {
    await this.couponRepository.delete({ id: couponId });
    return '삭제가 완료되었습니다.';
  }
}
