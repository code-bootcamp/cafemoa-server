import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OwnerCommentService } from './ownercomment.service';
import { OwnerComment } from './entities/ownercomment.entity';
import { UpdateOwnerCommentInput } from './dto/updateownercomment.input';
import { CreateOwnerCommentInput } from './dto/createownercomment.input';
@Resolver()
export class OwnerCommentResolver {
  constructor(
    private readonly ownercommentService: OwnerCommentService, //
  ) {}

  @Query(() => OwnerComment)
  fetchOwnerComment(
    @Args('ownercommentId') ownercommentId: string, //
  ) {
    return this.ownercommentService.findOne({ ownercommentId });
  }
  @Mutation(() => OwnerComment)
  async createOwnerComment(
    @Args('createOwnerCommentInput')
    createOwnerCommentInput: CreateOwnerCommentInput, //
    @Args('ownerId') OwnerId: string,
    @Args('commentID') commentID: string,
  ) {
    return this.ownercommentService.create({
      createOwnerCommentInput,
      OwnerId,
      commentID,
    });
  }
  //   @Mutation(() => OwnerComment)
  //   async createOwnerComment(@Args('commentId') Comment: string) {
  //     return this.ownercommentService.create({ Comment }); //
  //   }

  @Mutation(() => OwnerComment)
  async updateOwnerComment(
    @Args('OwnerId') OwnerId: string,
    @Args('UpdateOwnerCommentInput')
    UpdateOwnerCommentInput: UpdateOwnerCommentInput,
  ) {
    return this.ownercommentService.update({
      OwnerId,
      UpdateOwnerCommentInput,
    });
  }
  //    @Mutation(()=> Boolean)
  //    deleteOwnerComment(
  //     @Args('ownerCommentId') ownerCommentId: string,//
  //    ){
  //     return this.ownerService.delete()
  //    }
}
