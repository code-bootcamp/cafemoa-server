import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CafeMenuImageService } from './cafemenuImage.service';
import { CafeMenuImage } from './entities/cafemenuimage.entity';

@Resolver()
export class CafeMenuImageResolver {
  constructor(private readonly cafeMenuImageService: CafeMenuImageService) {}

  @Query(() => [CafeMenuImage])
  fetchCafeMenuImage(@Args('CafeInformID') CafeInformID: string) {
    return this.cafeMenuImageService.find({ CafeInformID });
  }

  @Mutation(() => Boolean)
  deleteCafeMenuImage(@Args('cafeMenuImageID') cafeMenuImageID: string) {
    return this.cafeMenuImageService.delete({ cafeMenuImageID });
  }
}
