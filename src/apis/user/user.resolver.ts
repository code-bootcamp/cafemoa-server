import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Query(() => User)
  fetchUser(@Args('email') email: string): Promise<User> {
    return this.userService.find({ email });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    return await this.userService.update({
      updateUserInput,
    });
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('userId') userId: string): Promise<boolean> {
    return this.userService.delete({ userId });
  }

  //로그인 필요
  @Mutation(() => Boolean)
  async changeUserPwd(
    @Args('password') password: string,
    @Args('email') email: string,
  ) {
    return this.userService.changeUserPwd({ password, email });
  }
}
