import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/catgory.entity';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  createCategory(@Args('category') category: string) {
    console.log(category);
    return this.categoryService.create({ category });
  }

  @Query(() => [Category])
  fetchCategory() {
    return this.categoryService.find();
  }
}
