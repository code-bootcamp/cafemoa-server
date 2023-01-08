import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { CafeInform } from './entities/cafeInform.entity';
import { CafeImage } from '../cafeImage/entities/cafeImage.entity';
import { CafeMenuImage } from '../cafemenuimage/entities/cafemenuimage.entity';
import { CafeTag } from '../cafeTag/entities/cafeTag.entity';
import { PickList } from '../pickList/entities/pickList.entity';
import { User } from '../user/entities/user.entity';
import { throwIfEmpty } from 'rxjs';

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
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
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
      relations: ['cafeTag'],
    });
    if (menu_imageUrl) {
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
      const arr = [];
      const result = await this.cafeImageRepository.find({
        where: {
          cafeInform: { id: CafeInformID },
        },
      });
      for (let i = 0; i < result.length; i++) {
        if (result[i].is_main !== false) {
          arr.push(result[i].cafe_image);
        } else {
          arr.unshift(result[i].cafe_image);
        }
      }
      cafe_imageUrl.concat(arr);
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
    if (cafeTag) {
      for (let i = 0; i < cafeTag.length; i++) {
        const tagName = cafeTag[i].replace('#', '');

        const prevTag = await this.cafeTagRepository.findOne({
          where: {
            tagName: tagName,
          },
        });

        if (prevTag) {
          temp.push(prevTag);
        } else {
          const newTag = await this.cafeTagRepository.save({
            tagName: tagName,
          });
          temp.push(newTag);
        }
      }
    }
    return this.cafeInformrRepository.save({
      ...cafeinform,
      ...CafeInform,
      cafeTag: [...cafeinform.cafeTag, ...temp],
      thumbnail: cafe_imageUrl[0],
    });
  }
  async create({ cafeInformInput, OwnerId }) {
    // 이메일 인증 버튼 및 중복확인, 체크까지
    const { menu_imageUrl, cafe_imageUrl, cafeTag, ...cafeInform } =
      cafeInformInput;
    const Owner = await this.ownerRepository.findOne({
      where: {
        id: OwnerId,
      },
    });
    if (Owner.is_cafeInform === false) {
      await this.ownerRepository.save({
        ...Owner,
        is_cafeInform: true,
      });
    }
    // if (Owner.is_cafeInform === true) {
    //   throw new ConflictException('이미 한개의 카페가 존재합니다.');
    // }

    const temp = [];

    for (let i = 0; i < cafeTag.length; i++) {
      const tagName = cafeTag[i].replace('#', '');

      const prevTag = await this.cafeTagRepository.findOne({
        where: {
          tagName: tagName,
        },
      });

      if (prevTag) {
        temp.push(prevTag);
      } else {
        const newTag = await this.cafeTagRepository.save({
          tagName: tagName,
        });
        temp.push(newTag);
      }
    }

    const result2 = await this.cafeInformrRepository.save({
      owner: {
        ...Owner,
      },
      ...cafeInform,
      thumbNail: cafe_imageUrl[0],
      cafeTag: temp,
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

  async pickcafe({ CafeInformID, UserID }) {
    const cafeInform = await this.cafeInformrRepository.findOne({
      where: {
        id: CafeInformID,
      },
      relations: ['cafeTag', 'owner'],
    });
    const user = await this.userRepository.findOne({
      where: {
        id: UserID,
      },
    });
    const pickList = await this.pickListRepository.findOne({
      where: {
        user: { id: UserID },
        cafeInform: { id: CafeInformID },
      },
      relations: ['user', 'cafeInform'],
    });
    if (pickList) {
      console.log('=====================');
      console.log('있을 때');
      console.log('=====================');

      await this.pickListRepository.delete({ id: pickList.id });
      if (cafeInform.like > 0) {
        await this.cafeInformrRepository.update(
          {
            id: CafeInformID,
          },
          {
            like: cafeInform.like - 1,
          },
        );
      } else {
      }

      const cafeInform2 = await this.cafeInformrRepository.findOne({
        where: {
          id: CafeInformID,
        },
      });

      return cafeInform2.like;
    } else {
      console.log(cafeInform, '없을 때');
      const result = await this.cafeInformrRepository.update(
        {
          id: CafeInformID,
        },
        {
          like: cafeInform.like + 1,
        },
      );

      const cafeInform2 = await this.cafeInformrRepository.findOne({
        where: {
          id: CafeInformID,
        },
      });
      await this.pickListRepository.save({
        cafeInform: {
          ...cafeInform2,
        },
        user: {
          ...user,
        },
      });

      return cafeInform2.like;
    }
  }
  async findCafeInformWithTags({ Tags, page }) {
    const result = await this.cafeInformrRepository.find({
      relations: ['cafeTag', 'owner'],
    });
    const arr = [];
    result.forEach((el) => {
      el.cafeTag.forEach((e) => {
        for (let i = 0; i < Tags.length; i++) {
          if (e.tagName === Tags[i]) {
            if (arr.includes(el)) {
              continue;
            } else {
              arr.push(el);
            }
          }
        }
      });
    });
    if (arr.length > 10) {
      const pageNum = Math.ceil(arr.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = arr.slice(i * 10, (i + 1) * 10);
      }
      return result[page - 1];
    }
    console.log(arr);
    return arr;
  }

  async findCafeInformWithLocation({ Location, page }) {
    const result = await this.cafeInformrRepository.find({
      relations: ['cafeTag', 'owner'],
    });
    const answer = result.filter((el) => el.cafeAddr.includes(Location));
    if (answer.length > 10) {
      const pageNum = Math.ceil(answer.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = answer.slice(i * 10, (i + 1) * 10);
      }
      return result[page - 1];
    }
    return answer;
  }

  async deleteCafeInform({ cafeInformID }) {
    const result = await this.cafeInformrRepository.delete({
      id: cafeInformID,
    });
    return result.affected ? true : false;
  }
  async findBestCafe() {
    const result = await this.cafeInformrRepository.find({
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
    });

    result.sort((a, b) => b.like - a.like);

    return result.slice(0, 5);
  }
  async findAll({ page }) {
    const result = await this.cafeInformrRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
    });
    return result;
  }
  async findCafeWithLocationAndTag({ Location, Tags, page }) {
    if (Location && Tags.length === 0) {
      const result = await this.cafeInformrRepository.find({
        relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      });
      const answer = result.filter((el) => el.cafeAddr.includes(Location));
      if (answer.length > 10) {
        const pageNum = Math.ceil(answer.length / 10);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = answer.slice(i * 10, (i + 1) * 10);
        }
        return result[page - 1];
      }

      return answer;
    } else if (!Location && Tags.length > 0) {
      const result = await this.cafeInformrRepository.find({
        relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      });
      const arr = [];
      result.forEach((el) => {
        el.cafeTag.forEach((e) => {
          for (let i = 0; i < Tags.length; i++) {
            if (e.tagName === Tags[i]) {
              if (arr.includes(el)) {
                continue;
              } else {
                arr.push(el);
              }
            }
          }
        });
      });
      if (arr.length > 10) {
        const pageNum = Math.ceil(arr.length / 10);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = arr.slice(i * 10, (i + 1) * 10);
        }
        return result[page - 1];
      }
      return arr;
    } else if (Location && Tags.length > 0) {
      const result = await this.cafeInformrRepository.find({
        relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      });
      const answer = result.filter((el) => el.cafeAddr.includes(Location));
      const arr = [];
      answer.forEach((el) => {
        el.cafeTag.forEach((e) => {
          for (let i = 0; i < Tags.length; i++) {
            if (e.tagName === Tags[i]) {
              if (arr.includes(el)) {
                continue;
              } else {
                arr.push(el);
              }
            }
          }
        });
      });
      if (arr.length > 10) {
        const pageNum = Math.ceil(arr.length / 10);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = arr.slice(i * 10, (i + 1) * 10);
        }
        return result[page - 1];
      }
      return arr;
    } else {
      const result = await this.cafeInformrRepository.find({
        take: 10,
        skip: (page - 1) * 10,
        relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      });
      return result;
    }
  }

  async findMyCafes({ ownerID, page }) {
    const result = await this.cafeInformrRepository.find({
      where: {
        owner: { id: ownerID },
      },
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      take: 10,
      skip: (page - 1) * 10,
    });
    return result;
  }
}
