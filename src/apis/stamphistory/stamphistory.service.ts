import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { StampHistory } from './entities/stamphistory.entity';
import * as bcrypt from 'bcrypt';
import { Coupon } from '../coupon/entities/coupon.entity';

@Injectable()
export class StampHistoryService {
  constructor(
    @InjectRepository(StampHistory)
    private readonly stampHistoryRepository: Repository<StampHistory>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async findStamps({ cafeId }) {
    const cafeStamp = await this.stampHistoryRepository.find({
      where: {
        coupon: { cafeInform: { id: cafeId } },
      },
      relations: ['coupon', 'owner', 'user'],
    });
    console.log(String(cafeStamp[0].createdAt));

    const result = cafeStamp.filter((el) => {
      if (el.stamp > 3) return el;
    });

    return result;
  }

  async delete({ ownerpassword, stamphistoryId }) {
    const stamphistory = await this.stampHistoryRepository.findOne({
      where: { id: stamphistoryId },
      relations: ['owner', 'coupon'],
    });

    const owner = await this.ownerRepository.findOne({
      where: {
        id: stamphistory.owner.id,
      },
    });
    const coupon = await this.couponRepository.findOne({
      where: { id: stamphistory.coupon.id },
    });

    await this.couponRepository.update(
      {
        id: stamphistory.coupon.id,
      },
      {
        stamp: coupon.stamp - stamphistory.stamp,
        accstamp: coupon.accstamp - stamphistory.stamp,
      },
    );
    const coupon2 = await this.couponRepository.findOne({
      where: { id: stamphistory.coupon.id },
    });
    if (coupon2.stamp < 0) {
      throw new UnprocessableEntityException(
        '실제로 쿠폰 사용되었습니다. 경찰에 신고하십시오',
      );
    }

    const validOwnerPwd = await bcrypt.compare(
      ownerpassword,
      owner.ownerPassword,
    );
    if (!validOwnerPwd) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const result = await this.stampHistoryRepository.delete({
      id: stamphistoryId,
    });

    return coupon2.stamp;
  }
}