import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
// import {cafeInformrRepository} 

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CafeInform)
    private readonly cafeInformrRepository: Repository<CafeInform>,
    
  ) {}
  async findAll() {
    return await this.commentRepository.find({
      relations:['cafeinfo']
    });
  }

  async findOne({ commentId }) {
    const result = await this.commentRepository.findOne({ where: { id: commentId } ,
      relations:['cafeinfo','cafeinfo.cafeTag']});
      // const result2 = await this.cafeInformrRepository.findOne({
      //   where: {
      //     id: result.cafeinfo.id
      //   },
      //   relations: ['cafeTag']
      // })
      console.log(result)
      return result
  }
   
  async create({ createCommentInput, cafeinformId }) {
   const result = await this.cafeInformrRepository.findOne({
    where:{ id: cafeinformId }
  });
  
   const result2 = await this.commentRepository.save({
   
    cafeinfo: {
      ...result
    },
    ...createCommentInput,
  });
  console.log(result2.cafeinform)
  return result2
  }

  async update({ commentId, UpdateCommentInput  }) {
    const mycomment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    const newComment = {
      ...mycomment,
      ...commentId,
      ...UpdateCommentInput,
    };
    return this.commentRepository.save(newComment)


  }
  async delete({ commentId }) {
    const result = await this.commentRepository.softDelete({ id: commentId });
  }


  withdelete(): Promise<Comment[]> {
    return this.commentRepository.find({
      withDeleted: true,
    });
  }


  
  async sendBestComment() {
    const Like = await this.commentRepository.find();
    Like.sort((a, b) => b.like - a.like);
    console.log(Like);
    if (Like[0].like < 5) {
      throw new ConflictException('해당하는 댓글이 없습니다.');
    } else {
      return Like.slice(0, 3);
    }
  }
  async findCafeInformWithTags({ Tags }) {
    const result = await this.cafeInformrRepository.find({
      relations: ['cafeTag'],
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

    console.log(arr);
    return arr;
  }
}
