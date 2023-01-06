import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { PickList } from './entities/pickList.entity';
import { PickListService } from './pickList.service';

@Resolver()
export class PickListResolver {
  constructor(private readonly pickListService: PickListService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [PickList])
  fetchMyPickLists(
    @Context() context: IContext, //
    @Args('page') page: number,
  ) {
    page = page === null ? 1 : page;
    return this.pickListService.find({ userID: context.req.user.id, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [PickList])
  fetchMyPickListLocation(
    @Args('Location') Location: string, //
    @Context() context: IContext,
    @Args('page') page: number,
  ) {
    page = page === null ? 1 : page;
    return this.pickListService.findWithLocation({
      userID: context.req.user.id,
      Location,
      page,
    });
  }
}
