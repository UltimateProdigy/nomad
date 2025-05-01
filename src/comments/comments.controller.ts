import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Prisma } from 'generated/prisma';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() postId: number, createCommentDto: Prisma.CommentsCreateInput) {
    return this.commentsService.create(postId, createCommentDto);
  }

  @Get(':postId')
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(+postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: Prisma.CommentsUpdateInput,
  ) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
