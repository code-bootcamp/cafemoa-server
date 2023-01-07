import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OwnerCommentService } from './ownercomment.service';
import { OwnerComment } from './entities/ownercomment.entity';
import { UpdateOwnerCommentInput } from './dto/updateownercomment.input';
import { CreateOwnerCommentInput } from './dto/createownercomment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
@Resolver()
export class OwnerCommentResolver {
  constructor(
    private readonly ownercommentService: OwnerCommentService, //
  ) {}

  @Query(() => [OwnerComment])
  fetchOwnerComment(@Args({ name: 'page', type: () => Int }) page: number) {
    page = page === undefined ? 1 : page;
    return this.ownercommentService.findAll({ page });
  }

  @Query(() => OwnerComment)
  fetchOwnerComment1(
    @Args('ownercommentId') ownercommentId: string, //
  ) {
    return this.ownercommentService.findOne({ ownercommentId });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => OwnerComment)
  async createOwnerComment(
    @Args('createOwnerCommentInput')
    createOwnerCommentInput: CreateOwnerCommentInput, //
    @Args('commentID') commentID: string,
    @Context() context: IContext,
  ) {
    return this.ownercommentService.create({
      createOwnerCommentInput,
      OwnerId: context.req.user.id,
      commentID,
    });
  }
  //   @Mutation(() => OwnerComment)
  //   async createOwnerComment(@Args('commentId') Comment: string) {
  //     return this.ownercommentService.create({ Comment }); //
  //   }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => OwnerComment)
  async updateOwnerComment(
    @Args('UpdateOwnerCommentInput')
    UpdateOwnerCommentInput: UpdateOwnerCommentInput,
    @Args('ownerCommentID') ownerCommentID: string,
    @Context() context: IContext,
  ) {
    return this.ownercommentService.update({
      ownerCommentID,
      onwerID: context.req.user.id,
      UpdateOwnerCommentInput,
    });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteOwnerComment(
    @Args('ownerCommentId') ownercommentId: string, //
    @Context() context: IContext,
  ) {
    return this.ownercommentService.delete({
      ownercommentId,
      ownerID: context.req.user.id,
    });
  }

  @Query(() => [OwnerComment])
  fetchMyOwnerComments(
    @Args('OwnerID') OwnerID: string, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    page = page === undefined ? 1 : page;
    return this.ownercommentService.findById({ OwnerID, page });
  }

  @Query(() => String)
  fetchOwnerCommentByCommentID(@Args('commentID') commentID: string) {
    return this.ownercommentService.findByCommentID({ commentID });
  }
}
