import { Injectable } from "@nestjs/common";
import { PartialType } from "@nestjs/graphql";
import { createCommentInput } from "src/apis/comment/dto/createComment.input";

@Injectable()
export class UpdateCommentInput extends PartialType(createCommentInput) {}