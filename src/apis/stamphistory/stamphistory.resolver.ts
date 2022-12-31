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
  fetchStamps(@Args('cafeId') cafeId: string): Promise<StampHistory[]> {
    return this.stampHistory.findStamps({ cafeId });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  deleteStamp(
    @Args('ownerpassword') ownerpassword: string,
    @Args('stamphistoryId') stamphistoryId: string,
  ) {
    return this.stampHistory.delete({ ownerpassword, stamphistoryId });
  }
}
