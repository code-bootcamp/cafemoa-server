import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  personalNum: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => String)
  brandName: string;

  @Column()
  // @Field(() => String)
  password: string;

  @Column()
  // @Field(() => String)
  ownerPassword: string;

  @JoinColumn()
  // @Field(() => CafeInform)
  @OneToOne(() => CafeInform)
  cafeInform: CafeInform;
}
