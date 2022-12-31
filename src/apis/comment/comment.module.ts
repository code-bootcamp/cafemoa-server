import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CafeInform])],
  providers: [
    CommentResolver, //
    CommentService,
  ],
})
export class CommentModule {}
