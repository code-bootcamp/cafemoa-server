import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { StampHistory } from './entities/stamphistory.entity';
import { StampHistoryService } from './stamphistory.service';

@Resolver()
export class StampHistoryResolver {
  constructor(private readonly stampHistory: StampHistoryService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [StampHistory])
  fetchUnusualStamps(
    @Args('cafeId') cafeId: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ): Promise<StampHistory[]> {
    page = page === undefined ? 1 : page;
    return this.stampHistory.findStamps({ cafeId, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  deleteUnusualStamp(
    @Args('ownerpassword') ownerpassword: string,
    @Args('stamphistoryId') stamphistoryId: string,
  ) {
    return this.stampHistory.delete({ ownerpassword, stamphistoryId });
  }
}
