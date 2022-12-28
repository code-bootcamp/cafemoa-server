import { Field, Float, ObjectType } from '@nestjs/graphql';
import { CafeTag } from 'src/apis/cafeTag/entities/cafeTag.entity';
import { Owner } from 'src/apis/owner/entities/owner.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @JoinColumn()
  @OneToOne(() => Owner)
  @Field(() => Owner)
  owner: Owner;

  @ManyToMany(() => CafeTag, (cafeTag) => cafeTag.cafeInform)
  @Field(() => [CafeTag])
  cafeTag: CafeTag[];
}
