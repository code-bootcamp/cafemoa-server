import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { gql } from 'apollo-server-express';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeInform)
  updateCafeInform(
    @Args('updateCafeInform') updateCafeInform: UpdateCafeInform, //
    @Args('CafeInformID') CafeInformID: string,
  ) {
    return this.cafeInformService.update({ updateCafeInform, CafeInformID });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeInform)
  CreatecafeInform(
    @Args('cafeInformInput') cafeInformInput: CafeInformInput, //
    @Context() context: IContext,
  ) {
    return this.cafeInformService.create({
      cafeInformInput,
      OwnerId: context.req.user.id,
    });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  PickCafe(
    @Args('CafeInformID') CafeInformID: string, //
    @Context() context: IContext,
  ) {
    return this.cafeInformService.pickcafe({
      CafeInformID,
      UserID: context.req.user.id,
    });
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
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCafeInform(@Args('cafeInformID') cafeInformID: string) {
    return this.cafeInformService.deleteCafeInform({ cafeInformID });
  }

  @Query(() => [CafeInform])
  fetchBestCafe() {
    return this.cafeInformService.findBestCafe();
  }

  @Query(() => [CafeInform])
  fetchCafeInforms() {
    return this.cafeInformService.findAll();
  }

  @Query(() => [CafeInform])
  fetchCafes(
    @Args({ name: 'Location', type: () => String, nullable: true })
    Location: string, //
    @Args({ name: 'Tags', type: () => [String], nullable: true })
    Tags: string[],
    @Args('page') page: number,
  ) {
    return this.cafeInformService.findCafeWithLocationAndTag({
      Location,
      Tags,
      page,
    });
  }
}
