import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OwnerCommentService } from './ownercomment.service';
import { OwnerComment } from './entities/ownercomment.entity';
import { OwnerCommentInput } from './dto/createownercomment.input';
import { UpdateCommentInput } from './dto/updateownercomment.input';

@Resolver()
export class OwnerCommentResolver {
  constructor(
    private readonly ownerService: OwnerCommentService, //
  ) {}

  @Query(() => OwnerComment)
  fetchOwnerComment(
    @Args('ownercommentId') ownercommentId: string, //
  ) {
    return this.ownerService.findOne({ ownercommentId });
  }
  @Mutation(() => OwnerComment)
  createOwnerComment(
    @Args('createownercommentinput') createownercommentinput: OwnerCommentInput,
    // @Args('')
  ) {}

  @Mutation(() => OwnerComment)
  updateOwnerComment(
    @Args('ownercommentIdc') ownercommentId: string,
    @Args('UpdateOwnerCommentInput')
    UpdateOwnerCommentInput: UpdateCommentInput,
  ) {
    return this.ownerService.update({
      ownercommentId,
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
