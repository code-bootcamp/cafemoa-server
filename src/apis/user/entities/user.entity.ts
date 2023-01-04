import { Field, ObjectType } from '@nestjs/graphql';
import { Coupon } from 'src/apis/coupon/entities/coupon.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column({ default: true })
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  personalNumber: string;

  @Column()
  @Field(() => String)
  phoneNumber: string;

  @Column({ default: true })
  @Field(() => String)
  age: string;

  @Column()
  // @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  profileImage: string;

  // @DeleteDateColumn()
  // @Field(() => Date)
  // deletedAt: Date;
  @OneToMany(() => Coupon, (coupon) => coupon.user, { onDelete: 'CASCADE' })
  coupon: Coupon;
}
