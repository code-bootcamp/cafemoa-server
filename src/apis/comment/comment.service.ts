import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { CommentImage } from '../commentImage.ts/entities/commentImage.entity';
// import {cafeInformrRepository}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CafeInform)
    private readonly cafeInformrRepository: Repository<CafeInform>,
    @InjectRepository(CommentImage)
    private readonly commentImageRepository: Repository<CommentImage>,
  ) {}
  async findAll() {
    return await this.commentRepository.find({
      relations: ['cafeinfo'],
    });
  }

  async findOne({ commentId }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['cafeinfo', 'cafeinfo.cafeTag'],
    });
    // const result2 = await this.cafeInformrRepository.findOne({
    //   where: {
    //     id: result.cafeinfo.id
    //   },
    //   relations: ['cafeTag']
    // })
    console.log(result);
    return result;
  }

  async create({ createCommentInput, cafeinformId }) {
    const { image_Url, ...Comment } = createCommentInput;

    const result = await this.cafeInformrRepository.findOne({
      where: { id: cafeinformId },
    });

    const result2 = await this.commentRepository.save({
      cafeinfo: {
        ...result,
      },
      ...Comment,
    });
    for (let i = 0; i < image_Url.length; i++) {
      this.commentImageRepository.save({
        image_url: image_Url[i],
        comment: {
          ...result2,
        },
      });
    }

    return result2;
  }

  async update({ commentId, UpdateCommentInput }) {
    const { image_Url, ...comment } = UpdateCommentInput;
    const mycomment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    const result = await this.commentRepository.save({
      ...mycomment,
      ...comment,
    });
    if (image_Url) {
      await this.commentImageRepository.delete({ comment: { id: commentId } });

      for (let i = 0; i < image_Url.length; i++) {
        this.commentImageRepository.save({
          image_url: image_Url[i],
          comment: {
            ...result,
          },
        });
      }
    }
    return result;
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
  async findcommentwithTags({ Tags }) {
    const result = await this.commentRepository.find({
      relations: ['cafeinfo', 'cafeinfo.cafeTag'],
    });
    console.log(result);
    const arr = [];
    result.forEach((el) => {
      el.cafeinfo.cafeTag.forEach((e) => {
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
    console.log(result[3].cafeinfo.cafeTag[0].tagName);
    return arr;
  }
}
