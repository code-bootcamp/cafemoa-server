import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { OwnerComment } from './entities/ownercomment.entity';
import { Comment } from '../comment/entities/comment.entity';

@Injectable()
export class OwnerCommentService {
  constructor(
    @InjectRepository(OwnerComment)
    private readonly ownercommentRepository: Repository<OwnerComment>,
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async findAll() {
    return await this.ownercommentRepository.find({
      relations: ['comment', 'owner'],
    });
  }

  async findOne({ ownercommentId }) {
    const result = await this.ownercommentRepository.findOne({
      where: { id: ownercommentId },
      relations: ['comment', 'owner'],
    });

    return result;
  }

  async create({ createOwnerCommentInput, OwnerId, commentID }) {
    const result = await this.ownerRepository.findOne({
      where: { id: OwnerId },
    });
    const result3 = await this.commentRepository.findOne({
      where: { id: commentID },
    });
    const result2 = await this.ownercommentRepository.save({
      owner: {
        ...result,
      },
      comment: {
        ...result3,
      },
      ...createOwnerCommentInput,
    });

    return result2;
  }

  async update({ UpdateOwnerCommentInput, OwnerId }) {
    const result = await this.ownercommentRepository.findOne({
      where: { id: OwnerId },
    });
    const newOwner = {
      ...result,
      ...UpdateOwnerCommentInput,
    };
    return this.ownercommentRepository.save(newOwner);
  }
  async delete({ ownercommentId }) {
    const result = await this.ownercommentRepository.softDelete({
      id: ownercommentId,
    });
  }
  withdelete(): Promise<OwnerComment[]> {
    return this.ownercommentRepository.find({
      withDeleted: true,
    });
  }
}
