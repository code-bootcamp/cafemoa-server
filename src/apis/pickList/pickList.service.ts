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

  async find({ userID }) {
    const result = await this.pickListRepository.find({
      where: { user: { id: userID } },
      relations: ['user', 'cafeInform'],
    });
    console.log(result);
    return result;
  }

  async findWithLocation({ userID, Location }) {
    const result = await this.pickListRepository.find({
      where: {
        user: { id: userID },
      },
      relations: ['user', 'cafeInform'],
    });

    const resultLocation = result.map((el) => {
      if (el.cafeInform.cafeAddr.includes(Location)) {
        return el;
      }
    });

    if (resultLocation[0] === undefined) {
      throw new ConflictException('찜한 카페가 없습니다.');
    }

    return resultLocation;
  }
}
