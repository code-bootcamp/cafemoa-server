import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { CommentImage } from '../commentImage.ts/entities/commentImage.entity';
import { User } from '../user/entities/user.entity';
import { skip } from 'rxjs';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CafeInform)
    private readonly cafeInformrRepository: Repository<CafeInform>,
    @InjectRepository(CommentImage)
    private readonly commentImageRepository: Repository<CommentImage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findAll({ page }) {
    return await this.commentRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'ownerComment'],
    });
  }

  async findOne({ commentId }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'ownerComment'],
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
  async findusercomments({ userID }) {
    const result = await this.commentRepository.find({
      where: { user: { id: userID } },
      relations: ['user'],
    });
    return result;
  }

  async create({ createCommentInput, cafeinformId, userID }) {
    const { image_Url, ...Comment } = createCommentInput;

    const resultUser = await this.userRepository.findOne({
      where: {
        id: userID,
      },
    });
    if (!resultUser) {
      throw new ConflictException('댓글은 유저만 작성가능합니다.');
    }

    const result = await this.cafeInformrRepository.findOne({
      where: { id: cafeinformId },
    });

    const result2 = await this.commentRepository.save({
      cafeinfo: {
        ...result,
      },
      user: {
        ...resultUser,
      },
      ...Comment,
    });
    if (image_Url) {
      for (let i = 0; i < image_Url.length; i++) {
        this.commentImageRepository.save({
          image_url: image_Url[i],
          comment: {
            ...result2,
          },
        });
      }
    }

    return result2;
  }

  async update({ commentId, UpdateCommentInput, userID }) {
    const { image_Url, ...comment } = UpdateCommentInput;
    const mycomment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user'],
    });

    if (mycomment.user.id !== userID) {
      throw new ConflictException('자신의 댓글이 아닙니다.');
    }

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
  async delete({ commentId, userID }) {
    const resultUser = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ['user'],
    });
    if (resultUser.user.id !== userID) {
      throw new ConflictException('자신의 댓글이 아닙니다.');
    }
    const result = await this.commentRepository.softDelete({ id: commentId });
    return result.affected ? '삭제에 성공했습니다.' : '삭제에 실패했습니다.';
  }

  withdelete(): Promise<Comment[]> {
    return this.commentRepository.find({
      withDeleted: true,
    });
  }

  async sendBestComment() {
    const Like = await this.commentRepository.find({
      relations: ['user', 'ownerComment', 'cafeinfo'],
    });
    Like.sort((a, b) => b.like - a.like);
    console.log(Like);
    if (Like[0].like < 5) {
      throw new ConflictException('해당하는 댓글이 없습니다.');
    } else {
      return Like.slice(0, 3);
    }
  }

  async findcommentwithTags({ Tags }) {
    const result = await this.commentRepository.find({
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user'],
    });

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

    return arr;
  }
}
