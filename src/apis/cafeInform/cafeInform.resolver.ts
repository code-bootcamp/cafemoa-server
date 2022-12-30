import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CafeInformService } from './cafeInform.service';
import { CafeInformInput } from './dto/cafeinform.input';
import { UpdateCafeInform } from './dto/updatecafeinform.input';
import { CafeInform } from './entities/cafeInform.entity';

@Resolver()
export class CafeInformResolver {
  constructor(private readonly cafeInformService: CafeInformService) {}
  @Query(() => CafeInform)
  fetchCafeInform(@Args('cafeInformID') cafeInformID: string) {
    return this.cafeInformService.findOne({ cafeInformID });
  }

  @Mutation(() => CafeInform)
  updateCafeInform(
    @Args('updateCafeInform') updateCafeInform: UpdateCafeInform, //
    @Args('CafeInformID') CafeInformID: string,
  ) {
    return this.cafeInformService.update({ updateCafeInform, CafeInformID });
  }

  @Mutation(() => CafeInform)
  CreatecafeInform(
    @Args('cafeInformInput') cafeInformInput: CafeInformInput, //
    @Args('OwnerId') OwnerId: string,
  ) {
    return this.cafeInformService.create({ cafeInformInput, OwnerId });
  }

  @Mutation(() => Int)
  PickCafe(
    @Args('CafeInformID') CafeInformID: string, //
    @Args('UserID') UserID: string,
  ) {
    return this.cafeInformService.pickCafe({ CafeInformID, UserID });
  }

  @Query(() => [CafeInform])
  fetchCafeInformWithTag(
    @Args({ name: 'Tags', type: () => [String] }) Tags: string[],
  ) {
    return this.cafeInformService.findCafeInformWithTags({ Tags });
  }

  @Query(() => [CafeInform])
  fetchCafeInformWithLocation(
    @Args('Location') Location: string, //
  ) {
    return this.cafeInformService.findCafeInformWithLocation({ Location });
  }
}
