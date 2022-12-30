import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { CafeInform } from './entities/cafeInform.entity';
import { CafeImage } from '../cafeImage/entities/cafeImage.entity';
import { CafeMenuImage } from '../cafemenuimage/entities/cafemenuimage.entity';
import { CafeTag } from '../cafeTag/entities/cafeTag.entity';
import { PickList } from '../pickList/entities/pickList.entity';
import { User } from '../user/entities/user.entity';
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

    @InjectRepository(CafeTag)
    private readonly cafeTagRepository: Repository<CafeTag>,

    @InjectRepository(PickList)
    private readonly pickListRepository: Repository<PickList>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const { cafeTag, menu_imageUrl, cafe_imageUrl, ...CafeInform } =
      updateCafeInform;
    const cafeinform = await this.cafeInformrRepository.findOne({
      where: {
        id: CafeInformID,
      },
    });
    if (menu_imageUrl) {
      await this.menuImageRepository.delete({
        cafeInform: {
          id: CafeInformID,
        },
      });

      await Promise.all(
        menu_imageUrl.map(async (el) => {
          await this.menuImageRepository.save({
            menu_imageUrl: el,
            cafeInform: {
              ...cafeinform,
            },
          });
        }),
      );
    }

    if (cafe_imageUrl) {
      await this.cafeImageRepository.delete({
        cafeInform: { id: CafeInformID },
      });

      await Promise.all(
        cafe_imageUrl.map(async (el, i) => {
          await this.cafeImageRepository.save({
            cafe_image: el,
            is_main: i === 0 ? true : false,
            cafeInform: {
              ...cafeinform,
            },
          });
        }),
      );
    }

    const temp = [];
    cafeTag.forEach(async (el) => {
      const tagName = el.replace('#', '');

      const prevTag = await this.cafeTagRepository.findOne({
        where: {
          tagName,
        },
      });
      if (prevTag) {
        temp.push(prevTag);
      } else {
        const newTag = await this.cafeTagRepository.save({
          tagName,
        });
        temp.push(newTag);
      }
    });
    return this.cafeInformrRepository.save({
      ...cafeinform,

      ...CafeInform,
      cafeTag: temp,
    });
  }
  async create({ cafeInformInput, OwnerId }) {
    const { menu_imageUrl, cafe_imageUrl, cafeTag, ...cafeInform } =
      cafeInformInput;
    const Owner = await this.ownerRepository.findOne({
      where: {
        id: OwnerId,
      },
    });
    if (Owner.is_cafeInform === true) {
      throw new ConflictException('이미 한개의 카페를 등록하셨습니다.');
    }
    await this.ownerRepository.save({
      ...Owner,
      is_cafeInform: true,
    });

    const temp = [];
    cafeTag.forEach(async (el) => {
      const tagName = el.replace('#', '');

      const prevTag = await this.cafeTagRepository.findOne({
        where: {
          tagName,
        },
      });
      if (prevTag) {
        temp.push(prevTag);
      } else {
        const newTag = await this.cafeTagRepository.save({
          tagName,
        });
        temp.push(newTag);
      }
    });

    const result2 = await this.cafeInformrRepository.save({
      owner: {
        ...Owner,
      },
      thumbNail: cafe_imageUrl[0],
      cafeTag: temp,
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

  async pickCafe({ CafeInformID, UserID }) {
    const cafeInform = await this.cafeInformrRepository.findOne({
      where: {
        id: CafeInformID,
      },
    });
    const user = await this.userRepository.findOne({
      where: {
        id: UserID,
      },
    });
    const pickList = await this.pickListRepository.findOne({
      where: {
        user,
        cafeInform,
      },
      relations: ['user', 'cafeInform'],
    });
    if (pickList) {
      await this.pickListRepository.delete({ id: pickList.id });
      await this.cafeInformrRepository.update(
        {
          id: CafeInformID,
        },
        {
          like: cafeInform.like - 1,
        },
      );
      return '찜이 해제 되었습니다.';
    } else {
      await this.cafeInformrRepository.update(
        {
          id: CafeInformID,
        },
        {
          like: cafeInform.like + 1,
        },
      );
      await this.pickListRepository.save({
        cafeInform: {
          ...cafeInform,
        },
        user: {
          ...user,
        },
      });
      return '찜하였습니다.';
    }
  }
}
