import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CafeImage } from 'src/apis/cafeImage/entities/cafeImage.entity';
import { CafeMenuImage } from 'src/apis/cafemenuimage/entities/cafemenuimage.entity';
import { CafeTag } from 'src/apis/cafeTag/entities/cafeTag.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Owner } from 'src/apis/owner/entities/owner.entity';
import { PickList } from 'src/apis/pickList/entities/pickList.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @Column()
  @Field(() => String)
  ownerNum: string;

  @Column()
  @Field(() => String)
  brandName: string;

  @Column()
  @Field(() => String)
  thumbNail: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lng: number;

  @ManyToOne(() => Owner, { onDelete: 'CASCADE' })
  @Field(() => Owner)
  owner: Owner;

  @JoinTable()
  @ManyToMany(() => CafeTag, (cafeTag) => cafeTag.cafeInform, {
    onDelete: 'CASCADE',
  })
  @Field(() => [CafeTag])
  cafeTag: CafeTag[];

  @OneToMany(() => CafeImage, (cafeImage) => cafeImage.cafeInform, {
    cascade: true,
  })
  cafeImage: CafeImage[];

  @OneToMany(() => CafeMenuImage, (cafeMenuImage) => cafeMenuImage.cafeInform, {
    cascade: true,
  })
  cafeMenuImage: CafeMenuImage[];

  @OneToMany(() => PickList, (pickList) => pickList.cafeInform, {
    onDelete: 'CASCADE',
  })
  pickList: PickList[];

  @OneToMany(() => Comment, (comment) => comment.cafeinfo, {
    onDelete: 'CASCADE',
  })
  comment: Comment;
}
