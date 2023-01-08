import { ConflictException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { CommentImage } from '../commentImage.ts/entities/commentImage.entity';
import { User } from '../user/entities/user.entity';
import { PickList } from '../pickList/entities/pickList.entity';
import { LikeComment } from '../likeComment/entities/likecomment.entity';

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

    @InjectRepository(LikeComment)
    private readonly likeCommentRepository: Repository<LikeComment>,
  ) {}
  async findAll({ page }) {
    const result = await this.commentRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
    });
    console.log(result);
    return result;
  }

  async findOne({ commentId }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
    });

    return result;
  }
  async findusercomments({ userID, page }) {
    const result = await this.commentRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      where: { user: { id: userID } },
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
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
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
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
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
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
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
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
  async findCommentWithLocation({ Location, page }) {
    const result = await this.commentRepository.find({
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
    });
    const answer = result.filter((el) =>
      el.cafeinfo.cafeAddr.includes(Location),
    );
    if (answer.length > 10) {
      const pageNum = Math.ceil(answer.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = answer.slice(i * 10, (i + 1) * 10);
      }
      return result[page - 1];
    }
    return answer;
  }

  async findCommentWithLocationAndTag({ Location, Tags, page }) {
    if (Location && Tags.length === 0) {
      const result = await this.commentRepository.find({
        relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
      });
      const answer = result.filter((el) =>
        el.cafeinfo.cafeAddr.includes(Location),
      );
      if (answer.length > 10) {
        const pageNum = Math.ceil(answer.length / 10);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = answer.slice(i * 10, (i + 1) * 10);
        }
        return result[page - 1];
      }
      return answer;
    } else if (!Location && Tags.length > 0) {
      const result = await this.commentRepository.find({
        relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
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
      if (arr.length > 10) {
        const pageNum = Math.ceil(arr.length / 10);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = arr.slice(i * 10, (i + 1) * 10);
        }
        return result[page - 1];
      }
      return arr;
    } else if (Location && Tags.length > 0) {
      const result = await this.commentRepository.find({
        relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
      });
      const answer = result.filter((el) =>
        el.cafeinfo.cafeAddr.includes(Location),
      );
      const arr = [];
      answer.forEach((el) => {
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
      if (arr.length > 10) {
        const pageNum = Math.ceil(arr.length / 10);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = arr.slice(i * 10, (i + 1) * 10);
        }
        return result[page - 1];
      }
      return arr;
    } else {
      const result = await this.commentRepository.find({
        take: 10,
        skip: (page - 1) * 10,
        relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
      });
      return result;
    }
  }

  async likeComment({ commentID, userID }) {
    const user = await this.userRepository.findOne({
      where: {
        id: userID,
      },
    });

    const comment = await this.commentRepository.findOne({
      where: {
        id: commentID,
      },
    });
    const likeComment = await this.likeCommentRepository.findOne({
      where: {
        user: { id: userID },
        comment: { id: commentID },
      },
      relations: ['user', 'comment'],
    });
    if (likeComment) {
      await this.commentRepository.update(
        {
          id: commentID,
        },
        {
          like: comment.like - 1,
        },
      );
      await this.likeCommentRepository.delete({ id: likeComment.id });
      const result = await this.commentRepository.findOne({
        where: {
          id: commentID,
        },
      });
      return result.like;
    } else {
      await this.commentRepository.update(
        {
          id: commentID,
        },
        {
          like: comment.like + 1,
        },
      );
      const resultComment = await this.commentRepository.findOne({
        where: {
          id: commentID,
        },
      });
      const result = await this.likeCommentRepository.save({
        user: {
          ...user,
        },
        comment: {
          ...resultComment,
        },
      });
      return resultComment.like;
    }
  }
  async findCommentBycafeID({ cafeID, page }) {
    const result = await this.commentRepository.find({
      where: {
        cafeinfo: { id: cafeID },
      },
      relations: ['cafeinfo', 'cafeinfo.cafeTag', 'user', 'commentImage'],
      take: 10,
      skip: (page - 1) * 10,
    });
    return result;
  }
}
