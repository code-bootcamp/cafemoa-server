import { Field, ObjectType } from '@nestjs/graphql';
import { Stamp } from 'src/apis/stamp/entities/stamp.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  expiredDate: string;

  @ManyToOne(() => Stamp)
  @Field(() => Stamp)
  stamp: Stamp;
}
