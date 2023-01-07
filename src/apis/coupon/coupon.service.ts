import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { DeletedCoupon } from '../deletedcoupon/entities/deletedcoupon.entity';
import { Owner } from '../owner/entities/owner.entity';
import { User } from '../user/entities/user.entity';
import { Coupon } from './entities/coupon.entity';
import * as bcrypt from 'bcrypt';
import { Stamp } from '../stamp/entities/stamp.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CafeInform)
    private readonly cafeInformRepository: Repository<CafeInform>,

    @InjectRepository(DeletedCoupon)
    private readonly deletedCouponRepository: Repository<DeletedCoupon>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(Stamp)
    private readonly stampRepository: Repository<Stamp>,
  ) {}

  async findUserCoupon({ userId, page }) {
    const result = await this.couponRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'cafeInform'],
    });

    console.log(result[0].user.id);

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
      } else if (Number(result[i].expiredDate.split('-')[0]) === year) {
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
        } else if (Number(result[i].expiredDate.split('-')[1]) === month) {
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
      take: 10,
      skip: (page - 1) * 10,
      relations: ['user', 'cafeInform'],
    });

    return result2;
  }

  async useCoupon({ password, couponId }) {
    const coupon = await this.couponRepository.findOne({
      where: { id: couponId },
      relations: ['stamp'],
    });

    const stamp = await this.stampRepository.findOne({
      where: { id: coupon.id },
      relations: ['cafeInform', 'user'],
    });

    const cafeInform = await this.cafeInformRepository.findOne({
      where: { id: stamp.cafeInform.id },
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

    const result = await this.deletedCouponRepository.save({
      expired: false,
      user: { ...stamp.user },
      cafeInform: { ...cafeInform },
    });

    await this.couponRepository.delete({ id: couponId });

    return result;
  }
}
