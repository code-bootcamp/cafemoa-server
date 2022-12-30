import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Coupon } from 'src/apis/coupon/entities/coupon.entity';
import { Owner } from 'src/apis/owner/entities/owner.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StampHistory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  stamp: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Owner, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => Owner)
  owner: Owner;

  @ManyToOne(() => Coupon, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => Coupon)
  coupon: Coupon;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt;
}
