import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerCommentResolver } from './ownercomment.resolver';
import { OwnerCommentService } from './ownercomment.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    OwnerCommentResolver, //
    OwnerCommentService,
  ],
})
export class OwnerCommentModule {}
