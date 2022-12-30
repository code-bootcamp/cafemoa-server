import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

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
}
