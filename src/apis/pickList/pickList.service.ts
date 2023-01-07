import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickList } from './entities/pickList.entity';

@Injectable()
export class PickListService {
  constructor(
    @InjectRepository(PickList)
    private readonly pickListRepository: Repository<PickList>,
  ) {}

  async find({ userID, page }) {
    const result = await this.pickListRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      where: { user: { id: userID } },
      relations: [
        'user',
        'cafeInform',
        'cafeInform.cafeTag',
        'cafeInform.owner',
      ],
    });
    if (!result) {
      throw new ConflictException('찜한 카페가 없습니다.');
    }
    return result;
  }

  async findWithLocation({ userID, Location, page }) {
    const result = await this.pickListRepository.find({
      where: {
        user: { id: userID },
      },
      relations: [
        'user',
        'cafeInform',
        'cafeInform.cafeTag',
        'cafeInform.owner',
      ],
    });

    const resultLocation = result.filter((el) =>
      el.cafeInform.cafeAddr.includes(Location),
    );

    if (resultLocation[0] === undefined) {
      throw new ConflictException('찜한 카페가 없습니다.');
    }

    if (resultLocation.length > 10) {
      const pageNum = Math.ceil(resultLocation.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = resultLocation.slice(i * 10, (i + 1) * 10);
      }
      return result[page - 1];
    }

    return resultLocation;
  }
}
