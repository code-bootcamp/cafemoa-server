import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => CafeInform, (cafeinform) => cafeinform.owner, {
    onDelete: 'CASCADE',
  })
  cafeInform: CafeInform[];
}
