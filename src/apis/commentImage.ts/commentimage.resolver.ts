import { Args, Query, Resolver } from '@nestjs/graphql';
import { CommentImageService } from './commenimage.service';
import { CommentImage } from './entities/commentImage.entity';

@Resolver()
export class CommentImageResolver {
  constructor(
    private readonly commentImageService: CommentImageService, //
  ) {}

  @Query(() => [CommentImage])
  fetchCommentImages() {
    return this.commentImageService.findAll();
  }

  @Query(() => CommentImage)
  fetchCommentImage(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentImageService.findOne({ commentId });
  }

  @Query(() => [CommentImage])
  fetchCommentImagesbyID(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentImageService.find({ commentId });
  }
}
