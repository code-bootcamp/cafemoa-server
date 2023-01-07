import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  expiredDate: string;

  @ManyToOne(() => CafeInform)
  @Field(() => CafeInform)
  cafeInform: CafeInform;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
