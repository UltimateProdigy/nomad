import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Prisma } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: Prisma.PostCreateInput,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.postsService.create({
      ...createPostDto,
      author: {
        connect: {
          id: req.user.id,
        },
      },
    });
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.postsService.likePost(postId, req.user.id);
  }

  @Post(':id/dislike')
  @UseGuards(JwtAuthGuard)
  async dislikePost(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.postsService.dislikePost(postId, req.user.id);
  }

  @Get(':id/likes')
  async getLikes(@Param('id', ParseIntPipe) postId: number) {
    return this.postsService.getPostLikes(postId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: Prisma.PostUpdateInput,
  ) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
