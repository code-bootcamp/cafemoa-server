import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';
import { Repository } from 'typeorm';
import { CafeMenuImage } from './entities/cafemenuimage.entity';

@Injectable()
export class CafeMenuImageService {
  constructor(
    @InjectRepository(CafeMenuImage)
    private readonly cafeMenuImageRepository: Repository<CafeMenuImage>,
  ) {}

  find({ CafeInformID }) {
    return this.cafeMenuImageRepository.find({
      where: {
        cafeInform: {
          id: CafeInformID,
        },
      },
    });
  }

  async delete({ cafeMenuImageID }) {
    const result = await this.cafeMenuImageRepository.delete({
      id: cafeMenuImageID,
    });
    return result.affected ? true : false;
  }
}
