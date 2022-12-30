import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerComment } from './entities/ownercomment.entity';

@Injectable()
export class OwnerCommentService {
  constructor(
    @InjectRepository(OwnerComment)
    private readonly ownercommentRepository: Repository<OwnerComment>,
  ) {}
  async findAll() {
    return await this.ownercommentRepository.find({
      relations: ['comment', 'owner'],
    });
  }
  async findOne({ ownercommentId }) {
    const result = await this.ownercommentRepository.findOne({
      where: { id: ownercommentId },
    });
    return result;
  }

  async create([createownercommentinput]) {}

  async update({ UpdateOwnerCommentInput, ownercommentId }) {
    const result = await this.ownercommentRepository.findOne({
      where: { id: ownercommentId },
    });
    const newOwner = {
      ...result,
      ...UpdateOwnerCommentInput,
    };
    return this.ownercommentRepository.save(newOwner);
  }
}
