import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const post = await this.databaseService.post
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((result) => {
        if (!result) throw new NotFoundException('User does not exist');
        const { authorId, published, ...rest } = result;
        return rest;
      });

    if (!post)
      return {
        message: 'Post ID not found',
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
