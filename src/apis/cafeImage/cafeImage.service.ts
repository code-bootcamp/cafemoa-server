import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeImage } from './entities/cafeImage.entity';

@Injectable()
export class CafeImageService {
  constructor(
    @InjectRepository(CafeImage)
    private readonly cafeImageRepository: Repository<CafeImage>,
  ) {}
  async find({ cafeInformID }) {
    const result = await this.cafeImageRepository.find({
      where: {
        cafeInform: { id: cafeInformID },
      },
    });
    return result;
  }
}
