import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OwnerInput } from './dto/owner.input';
import { OwnerUpdateInput } from './dto/ownerUpdate.input';
import { Owner } from './entities/owner.entity';
import { OwnerService } from './owner.service';

@Resolver()
export class OwnerResolver {
  constructor(
    private readonly ownerService: OwnerService, //
  ) {}

  @Mutation(() => Owner)
  CreateOwner(
    @Args('createOwnerInput') createOwnerInput: OwnerInput, //
  ) {
    return this.ownerService.create({ createOwnerInput });
  }
  @Query(() => [Owner])
  fetchOwners() {
    return this.ownerService.findAll();
  }
  @Query(() => Owner)
  fetchOwner(@Args('ownerID') ownerID: string) {
    return this.ownerService.findOne({ ownerID });
  }

  @Mutation(() => Boolean)
  deleteOwner(@Args('ownerID') ownerID: string) {
    return this.ownerService.delete({ ownerID });
  }

  @Mutation(() => Owner)
  updateOwner(
    @Args('updateOwnerInput') updateOwnerInput: OwnerUpdateInput, //
    @Args('ownerID') ownerID: string,
  ) {
    return this.ownerService.update({ updateOwnerInput, ownerID });
  }

  @Mutation(() => String)
  findOwnerPassword(@Args('email') email: string) {
    return this.ownerService.emailPassword({ email });
  }
}
