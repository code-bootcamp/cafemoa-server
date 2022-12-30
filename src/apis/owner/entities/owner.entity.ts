import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => Boolean)
  is_main: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  is_cafeInform: boolean;

  @Column()
  // @Field(() => String)
  password: string;

  @Column()
  // @Field(() => String)
  ownerPassword: string;
}
