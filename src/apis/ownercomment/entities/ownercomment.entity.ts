import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Owner } from 'src/apis/owner/entities/owner.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class OwnerComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  time: Date;

  @JoinColumn()
  @OneToOne(() => Owner)
  @Field(() => Owner)
  owner: Owner;

  @JoinColumn()
  @OneToOne(() => Comment)
  @Field(() => Comment)
  comment: Comment;
}
