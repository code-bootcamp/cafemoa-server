import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CafeInform {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  cafeinfo: string;

  @Column()
  @Field(() => String)
  closedDay: string;

  @Column()
  @Field(() => String)
  operatingTime: string;

  @Column()
  @Field(() => String)
  cafeAddr: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lng: number;
}
