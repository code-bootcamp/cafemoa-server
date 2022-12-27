import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './user-create.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
