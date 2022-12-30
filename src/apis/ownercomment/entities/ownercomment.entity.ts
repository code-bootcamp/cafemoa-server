import { Field, ObjectType } from "@nestjs/graphql";
import { Owner } from "src/apis/owner/entities/owner.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class OwnerComment {
    @PrimaryGeneratedColumn('uuid')
    @Field(()=> String)
    id: string;

    @Column()
    @Field(()=> String)
    content: string;

    @CreateDateColumn()
    @Field(()=> Date)
    time: Date;


    @ManyToOne(()=>Owner)
    @Field(()=>Owner)
    owner:Owner

}