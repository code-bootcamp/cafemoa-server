import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeInform } from './entities/cafeInform.entity';

@Injectable()
export class CafeInformService {
  constructor(
    @InjectRepository(CafeInform)
    private readonly cafeInformrRepository: Repository<CafeInform>, //
  ) {}

  findOne({ cafeInformID }) {
    return this.cafeInformrRepository.findOne({
      where: {
        id: cafeInformID,
      },
    });
  }

  async update({ updateCafeInform, CafeInformID }) {
    const cafeinform = await this.cafeInformrRepository.findOne({
      where: {
        id: CafeInformID,
      },
    });
    const result = await this.cafeInformrRepository.save({
      ...cafeinform,
      ...updateCafeInform,
    });
    return result;
  }
}
