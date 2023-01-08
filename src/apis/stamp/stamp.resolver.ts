import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CreateStampInput } from './dto/stamp-create.input';
import { Stamp } from './entities/stamp.entity';
import { StampService } from './stamp.service';

@Resolver()
export class StampResolver {
  constructor(
    private readonly stampService: StampService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Stamp)
  fetchStamp(@Args('stampId') stampId: string) {
    return this.stampService.find({ stampId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchStamps() {
    return this.stampService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchUserStamps(
    @Context() context: IContext,
    @Args({ name: 'page', type: () => Int, nullable: true })
    page: number,
  ) {
    page = page === undefined ? 1 : page;
    return this.stampService.findUserStamp({
      userId: context.req.user.id,
      page,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchCafeStamps(
    @Args('cafeId') cafeId: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    page = page === undefined ? 1 : page;
    return this.stampService.findCafeStamp({ cafeId, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchStampWithLocation(
    @Args('cafeAddr') cafeAddr: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    page = page === undefined ? 1 : page;
    return this.stampService.findStampLocation({ cafeAddr, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Stamp)
  createStamp(@Args('createCouponInput') createStampInput: CreateStampInput) {
    return this.stampService.createStamp({ createStampInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteStamp(@Args('stampId') stampId: string) {
    return this.stampService.deleteCoupon({ stampId });
  }
}