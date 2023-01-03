import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { Owner } from '../owner/entities/owner.entity';
import { User } from '../user/entities/user.entity';
import { Coupon } from './entities/coupon.entity';
import * as bcrypt from 'bcrypt';
import { StampHistory } from '../stamphistory/entities/stamphistory.entity';
import { DeletedCoupon } from '../deletedcoupon/entities/deletedcoupon.entity';

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

    @InjectRepository(DeletedCoupon)
    private readonly deletedCouponRepository: Repository<DeletedCoupon>,
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
      relations: ['user', 'cafeInform'],
    });
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (let i = 0; i < result.length; i++) {
      if (Number(result[i].expiredDate.split('-')[0]) < year) {
        const user = await this.userRepository.findOne({
          where: {
            id: result[i].user.id,
          },
        });
        const cafeInforms = await this.cafeInformRepository.findOne({
          where: {
            id: result[i].cafeInform.id,
          },
        });
        await this.deletedCouponRepository.save({
          user: {
            ...user,
          },
          cafeInform: {
            ...cafeInforms,
          },
          expired: true,
        });
        await this.couponRepository.delete({ id: result[i].id });
      } else {
        if (Number(result[i].expiredDate.split('-')[1]) < month) {
          const user = await this.userRepository.findOne({
            where: {
              id: result[i].user.id,
            },
          });
          const cafeInforms = await this.cafeInformRepository.findOne({
            where: {
              id: result[i].cafeInform.id,
            },
          });
          await this.deletedCouponRepository.save({
            user: {
              ...user,
            },
            cafeInform: {
              ...cafeInforms,
            },
            expired: true,
          });
          await this.couponRepository.delete({ id: result[i].id });
        } else {
          if (Number(result[i].expiredDate.split('-')[2]) < day) {
            const user = await this.userRepository.findOne({
              where: {
                id: result[i].user.id,
              },
            });
            const cafeInforms = await this.cafeInformRepository.findOne({
              where: {
                id: result[i].cafeInform.id,
              },
            });
            await this.deletedCouponRepository.save({
              user: {
                ...user,
              },
              cafeInform: {
                ...cafeInforms,
              },
              expired: true,
            });
            await this.couponRepository.delete({ id: result[i].id });
          }
        }
      }
    }
    const result2 = await this.couponRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'cafeInform'],
    });

    return result2.sort((a, b) => b.stamp - a.stamp);
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
    const { stamp, phoneNumber, cafeId, password } = createCouponInput;

    const create = new Date();
    const year = create.getFullYear();
    const month = create.getMonth() + 7;
    const day = create.getDate();

    const expiredDate = `${year}-${month}-${day}`;

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

    const validOwnerPwd = await bcrypt.compare(password, owner.password);
    if (!validOwnerPwd) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const coupon = await this.couponRepository.findOne({
      where: { user: { phoneNumber }, cafeInform: { id: cafeId } },
    });

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
        expiredDate,
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
    const result = await this.couponRepository.findOne({
      where: { id: couponId },
    });

    await this.deletedCouponRepository.save({
      expired: false,
      coupon: { ...result },
    });

    await this.couponRepository.delete({ id: couponId });
    return '삭제가 완료되었습니다.';
  }
}
