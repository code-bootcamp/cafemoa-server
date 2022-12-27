import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import * as bcrypt from 'bcrypt';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private readonly OwnerRepository: Repository<Owner>,

    @InjectRepository(CafeInform)
    private readonly cafeInformRepository: Repository<CafeInform>,
  ) {}

  async create({ createOwnerInput }) {
    const { password, personalNum, cafeInformInput, ...Owner } =
      createOwnerInput;
    const owner = await this.OwnerRepository.findOne({
      where: {
        email: Owner.email,
      },
    });
    const Password = bcrypt.hash(password, 10);
    if (owner) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    const result2 = await this.cafeInformRepository.save({
      ...cafeInformInput,
    });
    const Personal = personalNum.slice(0, 8) + '******';
    const result = await this.OwnerRepository.save({
      password: Password,
      personalNum: Personal,
      cafeInform: {
        ...result2,
      },
      ...Owner,
    });

    return result;
  }

  async findAll() {
    return this.OwnerRepository.find();
  }

  async findOne({ ownerID }) {
    const result = await this.OwnerRepository.findOne({
      where: {
        id: ownerID,
      },
    });
    if (result) {
      return result;
    } else {
      throw new ConflictException('존재하지 않는 아이디입니다.');
    }
  }

  async delete({ ownerID }) {
    const result = await this.OwnerRepository.softDelete({ id: ownerID });
    return result.affected ? true : false;
  }

  async update({ updateOwnerInput, ownerID }) {
    const { password, ...owner } = updateOwnerInput;
    const result = await this.OwnerRepository.findOne({
      where: {
        id: ownerID,
      },
    });
    if (password) {
      const Password = bcrypt.hash(password, 10);
      const ownerResult = await this.OwnerRepository.save({
        ...result,
        password: Password,
        ...owner,
      });
      return ownerResult;
    } else {
      return this.OwnerRepository.save({
        ...result,
        ...owner,
      });
    }
  }
}
