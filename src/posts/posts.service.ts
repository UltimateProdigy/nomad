import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createPostDto: Prisma.PostCreateInput) {
    const post = await this.databaseService.post.create({
      data: createPostDto,
    });

    return {
      message: 'Post Created Successfully',
      data: {
        id: post.id,
      },
    };
  }

  async findAll() {
    return this.databaseService.post.findMany();
  }

  async likePost(postId: number, userId: number) {
    const existingLike = await this.databaseService.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return { message: 'Post already liked' };
    }

    return this.databaseService.$transaction([
      this.databaseService.like.create({
        data: {
          user: { connect: { id: userId } },
          post: { connect: { id: postId } },
        },
      }),
      this.databaseService.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  }

  async dislikePost(postId: number, userId: number) {
    const existingLike = await this.databaseService.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return { message: 'Post not liked yet' };
    }

    return this.databaseService.$transaction([
      this.databaseService.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
      this.databaseService.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
  }

  async getPostLikes(postId: number) {
    const post = this.databaseService.post.findUnique({
      where: { id: postId },
      select: { likeCount: true },
    });

    return { likes: post?.likeCount || 0 };
  }

  async findOne(id: number) {
    const post = await this.databaseService.post
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((result) => {
        if (!result) return null;
        const { authorId, published, ...rest } = result;
        return rest;
      });

    if (!post)
      return {
        message: 'Post does not exist',
      };

    return {
      data: post,
    };
  }

  async update(id: number, updatePostDto: Prisma.PostUpdateInput) {
    const post = await this.databaseService.post.update({
      where: {
        id: id,
      },
      data: updatePostDto,
    });

    if (!post)
      return {
        message: 'Post ID not found',
      };

    return {
      message: 'Updated Successfully',
      id: post.id,
    };
  }

  async remove(id: number) {
    const post = await this.databaseService.post.delete({
      where: {
        id: id,
      },
    });
    return {
      id: post.id,
      message: 'Post Successfully deleted',
    };
  }
}
