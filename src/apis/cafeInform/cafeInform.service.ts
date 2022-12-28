import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { CafeInform } from './entities/cafeInform.entity';
import * as bcrypt from 'bcrypt';
import { CafeImage } from '../cafeImage/entities/cafeImage.entity';
import { CafeMenuImage } from '../cafemenuimage/entities/cafemenuimage.entity';
@Injectable()
export class CafeInformService {
  constructor(
    @InjectRepository(CafeInform)
    private readonly cafeInformrRepository: Repository<CafeInform>, //

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(CafeImage)
    private readonly cafeImageRepository: Repository<CafeImage>,

    @InjectRepository(CafeMenuImage)
    private readonly menuImageRepository: Repository<CafeMenuImage>,
  ) {}

  async findOne({ cafeInformID }) {
    const result = await this.cafeInformrRepository.findOne({
      where: {
        id: cafeInformID,
      },
      relations: ['owner'],
    });

    return result;
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
  async create({ cafeInformAndOnwerInput }) {
    const { ownerInput, menu_imageUrl, cafe_imageUrl, ...cafeInform } =
      cafeInformAndOnwerInput;
    const { password, ownerPassword, ...owner } = ownerInput;
    const Password = await bcrypt.hash(password, 10);
    const OwnerPassword = await bcrypt.hash(ownerPassword, 10);
    const result = await this.ownerRepository.save({
      password: Password,
      ownerPassword: OwnerPassword,
      ...owner,
    });

    const result2 = await this.cafeInformrRepository.save({
      owner: {
        ...result,
      },
      ...cafeInform,
    });

    await Promise.all(
      menu_imageUrl.map((el) =>
        this.menuImageRepository.save({
          menu_imageUrl: el,
          cafeInform: {
            ...result2,
          },
        }),
      ),
    );

    await Promise.all(
      cafe_imageUrl.map((el, i) =>
        this.cafeImageRepository.save({
          cafe_image: el,
          is_main: i === 0 ? true : false,
          cafeInform: {
            ...result2,
          },
        }),
      ),
    );
    return result2;
  }
}
