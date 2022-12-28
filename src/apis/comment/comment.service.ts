import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async findAll() {
    return await this.commentRepository.find();
  }

  async findOne({ commentId }) {
    return await this.commentRepository.findOne({ where: { id: commentId } });
  }

  async crate({ createCommentInput, ownerId }) {
    const result = await this.commentRepository.save({
      ...createCommentInput,
    });
    return result;
  }
  async update({ commentId, UpdateCommentInput }) {
    const mycomment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    const newComment = {
      ...mycomment,
      ...UpdateCommentInput,
    };
    return this.commentRepository.save(newComment);
  }
  async delete({ commentId }) {
    await this.commentRepository.softRemove({ id: commentId }); //

    const result = await this.commentRepository.softDelete({ id: commentId });
  }
  withdelete(): Promise<Comment[]> {
    return this.commentRepository.find({
      withDeleted: true,
    });
  }

  async sendBestComment() {
    const Like = await this.commentRepository.find()
    Like.sort((a, b) => b.like - a.like)
    console.log(Like)
    if(Like[0].like < 5){
      throw new ConflictException("해당하는 댓글이 없습니다.")
    }
    else{
      return Like.slice(0,3)
    }
  }

  



  


}
