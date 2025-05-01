import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(postId: number, createCommentDto: Prisma.CommentsCreateInput) {
    return this.databaseService.comments.create({
      data: {
        ...createCommentDto,
        post: { connect: { id: postId } },
      },
    });
  }

  async findAll(postId: number) {
    const comments = this.databaseService.comments.findMany({
      where: {
        postId: postId,
      },
    });

    return comments;
  }

  async findOne(id: number) {
    return this.databaseService.comments.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCommentDto: Prisma.CommentsUpdateInput) {
    return this.databaseService.comments.update({
      where: {
        id,
      },
      data: updateCommentDto,
    });
  }

  remove(id: number) {
    return this.databaseService.comments.delete({
      where: {
        id,
      },
    });
  }
}
