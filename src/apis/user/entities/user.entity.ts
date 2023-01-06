import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Stamp } from 'src/apis/stamp/entities/stamp.entity';

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

  @Column()
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

  @Column()
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

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comment: Comment;

  @OneToMany(() => Stamp, (stamp) => stamp.user, { onDelete: 'CASCADE' })
  stamp: Stamp;
}
