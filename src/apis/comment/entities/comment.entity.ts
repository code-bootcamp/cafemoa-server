import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @CreateDateColumn()
  @Field(() => Date)
  time: Date;

  @ManyToOne(() => CafeInform)
  @Field(() => CafeInform)
  cafeinfo: CafeInform;

  @DeleteDateColumn()
  deletedAt: Date;
}
