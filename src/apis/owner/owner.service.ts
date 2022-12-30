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

  async findAll() {
    return this.OwnerRepository.find({
      relations: ['cafeInform'],
    });
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

  async create({ createOwnerInput }) {
    const { password, ownerPassword, ...owner } = createOwnerInput;

    const Password = await bcrypt.hash(password, 10);
    const OwnerPassword = await bcrypt.hash(ownerPassword, 10);

    return this.OwnerRepository.save({
      ...owner,
      password: Password,
      ownerPassword: OwnerPassword,
    });
  }

  async update({ updateOwnerInput, ownerID }) {
    let { password, ownerPassword, ...owner } = updateOwnerInput;
    const result = await this.OwnerRepository.findOne({
      where: {
        id: ownerID,
      },
    });
    if (password) {
      password = await bcrypt.hash(password, 10);
    }
    if (ownerPassword) {
      ownerPassword = await bcrypt.hash(ownerPassword, 10);
    }

    return this.OwnerRepository.save({
      ...result,
      password,
      ownerPassword,
      ...owner,
    });
  }
}
