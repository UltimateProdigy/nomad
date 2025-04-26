import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const users = await this.databaseService.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.databaseService.user
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((result) => {
        if (!result) throw new NotFoundException('User does not exist');
        const { password, createdAt, updatedAt, ...rest } = result;
        return rest;
      });

    return {
      data: user,
    };
  }

  create(user: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: user,
    });
  }

  update(id: number, updatedUser: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        id: id,
      },
      data: updatedUser,
    });
  }

  delete(id: number) {
    return this.databaseService.user.delete({
      where: {
        id: id,
      },
    });
  }
}
