import { InputType, PartialType } from '@nestjs/graphql';
import { CafeInform } from '../entities/cafeInform.entity';

@InputType()
export class CafeInformInput extends PartialType(CafeInform, InputType) {}
