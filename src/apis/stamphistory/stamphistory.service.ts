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
import { Stamp } from '../stamp/entities/stamp.entity';

@Injectable()
export class StampHistoryService {
  constructor(
    @InjectRepository(StampHistory)
    private readonly stampHistoryRepository: Repository<StampHistory>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(Stamp)
    private readonly stampRepository: Repository<Stamp>,
  ) {}

  async findStamps({ ownerId, page }) {
    const cafeStamp = await this.stampHistoryRepository.find({
      where: {
        owner: { id: ownerId },
      },
      take: 10,
      skip: (page - 1) * 10,
      relations: ['stamp', 'owner', 'user', 'stamp.cafeInform'],
    });

    const result = cafeStamp.filter((el) => {
      if (el.count > 3) return true;
    });

    if (result.length > 10) {
      const pageNum = Math.ceil(result.length / 10);
      const result10 = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result10[i] = result.slice(i * 10, (i + 1) * 10);
      }
      return result10[page - 1];
    }
    return result;
  }

  async delete({ ownerpassword, stamphistoryId }) {
    const stamphistory = await this.stampHistoryRepository.findOne({
      where: { id: stamphistoryId },
      relations: ['owner', 'stamp'],
    });

    const owner = await this.ownerRepository.findOne({
      where: {
        id: stamphistory.owner.id,
      },
    });

    const validOwnerPwd = await bcrypt.compare(
      ownerpassword,
      owner.ownerPassword,
    );
    if (!validOwnerPwd) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const coupon = await this.stampRepository.findOne({
      where: { id: stamphistory.stamp.id },
    });

    await this.stampRepository.update(
      {
        id: stamphistory.stamp.id,
      },
      {
        count: coupon.count - stamphistory.count,
      },
    );
    const coupon2 = await this.stampRepository.findOne({
      where: { id: stamphistory.stamp.id },
    });
    if (coupon2.count < 0) {
      throw new UnprocessableEntityException(
        '실제로 쿠폰 사용되었습니다. 경찰에 신고하십시오',
      );
    }

    await this.stampHistoryRepository.delete({
      id: stamphistoryId,
    });

    return coupon2.count;
  }
}
