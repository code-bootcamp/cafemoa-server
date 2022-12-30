import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  stamp: number;

  @Column()
  @Field(() => Int)
  accstamp: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeInform)
  @Field(() => CafeInform)
  cafeInform: CafeInform;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
