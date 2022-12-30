import { Args, Query, Resolver } from '@nestjs/graphql';
import { CafeImageService } from './cafeImage.service';
import { CafeImage } from './entities/cafeImage.entity';

@Resolver()
export class CafeImageResolver {
  constructor(private readonly cafeImageService: CafeImageService) {}
  @Query(() => [CafeImage])
  fetchCafeImage(
    @Args('cafeInformID') cafeInformID: string, //
  ) {
    return this.cafeImageService.find({ cafeInformID });
  }
}
