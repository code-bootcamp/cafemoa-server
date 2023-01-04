import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { OwnerComment } from './entities/ownercomment.entity';
import { Comment } from '../comment/entities/comment.entity';
import { resourceLimits } from 'worker_threads';

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

    if (!result) {
      throw new ConflictException('가맹주만 답글을 작성할 수 있습니다.');
    }

    const resultOwner = await this.ownercommentRepository.findOne({
      where: {
        owner: { id: OwnerId },
        comment: { id: commentID },
      },
      relations: ['owner', 'comment'],
    });
    if (resultOwner) {
      throw new ConflictException('한 개의 답변만 가능합니다.');
    }
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

  async update({ UpdateOwnerCommentInput, ownerCommentID, onwerID }) {
    const result = await this.ownercommentRepository.findOne({
      where: {
        id: ownerCommentID,
      },
      relations: ['owner', 'comment'],
    });
    if (result.owner.id !== onwerID) {
      throw new ConflictException('자신의 댓글이 아닙니다.');
    }
    const newOwner = {
      ...result,
      ...UpdateOwnerCommentInput,
    };
    return this.ownercommentRepository.save(newOwner);
  }
  async delete({ ownercommentId, ownerID }) {
    const result2 = await this.ownercommentRepository.findOne({
      where: {
        id: ownercommentId,
      },
      relations: ['owner', 'comment'],
    });

    if (result2.owner.id !== ownerID) {
      throw new ConflictException('자신의 댓글이 아닙니다.');
    }
    const result = await this.ownercommentRepository.softDelete({
      id: ownercommentId,
    });
    return result.affected ? true : false;
  }
  withdelete(): Promise<OwnerComment[]> {
    return this.ownercommentRepository.find({
      withDeleted: true,
    });
  }

  async findById({ OwnerID }) {
    const result = await this.ownercommentRepository.find({
      where: {
        owner: { id: OwnerID },
      },
      relations: ['owner'],
    });
    return result;
  }

  async findByCommentID({ commentID }) {
    const result = await this.ownercommentRepository.findOne({
      where: {
        comment: { id: commentID },
      },
      relations: ['comment'],
    });
    console.log(result);
    return result;
  }
}
