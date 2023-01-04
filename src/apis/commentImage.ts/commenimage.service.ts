import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentImage } from './entities/commentImage.entity';
import { Comment } from '../comment/entities/comment.entity';

@Injectable()
export class CommentImageService {
  constructor(
    @InjectRepository(CommentImage)
    private readonly CommentImageRepository: Repository<CommentImage>,
    @InjectRepository(Comment)
    private readonly CommentRepository: Repository<Comment>,
  ) {}
  async findAll() {
    return await this.CommentImageRepository.find({
      relations: ['comment'],
    });
  }
  async findOne({ commentId }) {
    const result = await this.CommentImageRepository.findOne({
      where: { comment: { id: commentId } },
      relations: ['comment'],
    });
    return result;
  }

  async find({ commentId }) {
    const result = await this.CommentImageRepository.find({
      where: { comment: { id: commentId } },
      relations: ['comment'],
    });
    return result;
  }
}
