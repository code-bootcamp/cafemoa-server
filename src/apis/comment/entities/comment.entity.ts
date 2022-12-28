import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Owner } from 'src/apis/owner/entities/owner.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @CreateDateColumn()
  @Field(() => Date)
  time: Date;

  @ManyToOne(() => Owner)
  @Field(() => Owner)
  owner: Owner;
}
