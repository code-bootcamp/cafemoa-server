import { Field } from "@nestjs/graphql";

export class OwnerCommentInput{
    @Field(()=> String)
    content: string;
}