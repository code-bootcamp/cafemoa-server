import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { createCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';
import { UpdateCommentInput } from './dto/updateComment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { query } from 'express';

@Resolver()
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService, //
  ) {}

  @Query(() => [Comment])
  fetchComments(@Args('page') page: number) {
    return this.commentService.findAll({ page });
  }
  @Query(() => Comment)
  fetchComment(@Args('commentId') commentId: string) {
    return this.commentService.findOne({ commentId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentinput') createCommentInput: createCommentInput,
    @Args('cafeinformId') cafeinformId: string,
    @Context() context: IContext,
  ) {
    return this.commentService.create({
      createCommentInput,
      cafeinformId,
      userID: context.req.user.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  async updateComment(
    @Args('commentId') commentId: string,
    @Args('UpdateCommentInput') UpdateCommentInput: UpdateCommentInput,
    @Context() context: IContext,
  ) {
    return this.commentService.update({
      commentId,
      UpdateCommentInput,
      userID: context.req.user.id,
    });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteComment(
    @Args('commentId') commentId: string, //
    @Context() context: IContext,
  ) {
    return this.commentService.delete({
      commentId,
      userID: context.req.user.id,
    });
  }
  @Query(() => [Comment])
  fetchbestcomment() {
    return this.commentService.sendBestComment();
  }

  @Query(() => [Comment])
  fetchCommentWithTag(
    @Args({ name: 'Tags', type: () => [String] }) Tags: string[],
  ) {
    return this.commentService.findcommentwithTags({ Tags });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Comment])
  fetchUserComments(
    @Args('commentId') commentId: string,
    @Context() Context: IContext,
  ) {
    return this.commentService.findusercomments({
      userID: Context.req.user.id,
    });
  }
}
