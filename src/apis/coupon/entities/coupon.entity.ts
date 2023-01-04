import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeInform, {
    onDelete: 'CASCADE',
  })
  @Field(() => CafeInform)
  cafeInform: CafeInform;

  @Column({ default: true })
  @Field(() => String)
  expiredDate: string;
}
