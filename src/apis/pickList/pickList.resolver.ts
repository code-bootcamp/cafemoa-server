import { Args, Query, Resolver } from '@nestjs/graphql';
import { PickList } from './entities/pickList.entity';
import { PickListService } from './pickList.service';

@Resolver()
export class PickListResolver {
  constructor(private readonly pickListService: PickListService) {}

  @Query(() => [PickList])
  fetchMyPickLists(
    @Args('userId') userID: string, //
  ) {
    return this.pickListService.find({ userID });
  }

  @Query(() => [PickList])
  fetchMyPickListLocation(
    @Args('userId') userID: string, //
    @Args('Location') Location: string,
  ) {
    return this.pickListService.findWithLocation({ userID, Location });
  }
}
