import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  reply: string;

  @Column()
  @Field(() => Int)
  like: number;

  @Column()
  @Field(() => String)
  cafeaddr: string;

  @Column()
  @Field(() => String)
  tag: string;

  @Column()
  @Field(() => String)
  brandname: string;

  // @Column()
  // @Field(()=>[String])
  // image: string;

  // @ManyToOne(()=>owner)
  // owner:owner;

  // @ManyToOne(()=>user)
  // user:user;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;
}
