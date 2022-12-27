import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { createCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';
import { UpdateCommentInput } from './dto/updateComment.input';

@Resolver()
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService, //
  ) {}

  @Query(() => [Comment])
  fetchComments() {
    return this.commentService.findAll();
  }
  @Query(() => Comment)
  fetchComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentService.findOne({ commentId });
  }
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentinput') createCommentInput: createCommentInput,
    @Args('ownerId') ownerId: string,
  ) {
    return this.commentService.crate({ createCommentInput, ownerId });
  }
  @Mutation(() => Comment)
  async updateComment(
    @Args('commentId') commentId: string,
    @Args('UpdateCommentInput') UpdateCommentInput: UpdateCommentInput,
  ) {
    return this.commentService.update({ commentId, UpdateCommentInput });
  }
  @Mutation(() => Boolean)
  deleteComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentService.delete({ commentId });
  }
}
