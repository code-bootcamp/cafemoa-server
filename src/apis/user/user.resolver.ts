import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateUserInput } from './dto/user-create.input';
import { UpdateUserInput } from './dto/user-update.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create({
      createUserInput,
    });
  }

  @Query(() => [User])
  fetchUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(@Args('email') email: string): Promise<User> {
    return this.userService.find({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    return await this.userService.update({
      updateUserInput,
      userId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(@Args('userId') userId: string): Promise<boolean> {
    return this.userService.delete({ userId });
  }

  @Mutation(() => String)
  findUserPwd(@Args('email') email: string) {
    return this.userService.findUserPwd({ email });
  }
}
