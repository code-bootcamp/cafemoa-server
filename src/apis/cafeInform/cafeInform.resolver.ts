import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  CreateOwnerAndCafeInform(
    @Args('cafeInformAndOnwerInput') cafeInformAndOnwerInput: CafeInformInput, //
  ) {
    return this.cafeInformService.create({ cafeInformAndOnwerInput });
  }
}
