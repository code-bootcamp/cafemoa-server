import { Field } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "src/apis/comment/entities/comment.entity";

@Entity()
export class CommentImage {
    @PrimaryGeneratedColumn('uuid')
    @Field(()=> String)
    id: string;

    @Column()
    @Field(()=>String)
    image_url: string;

    @Column()
    @Field(()=>String)
    coid: string;

    @ManyToOne(()=> Comment)
    @Field(()=>Comment)
    comment: Comment;
}

