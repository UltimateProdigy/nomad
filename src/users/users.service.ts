import { Injectable } from '@nestjs/common';

import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.user.findMany();
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id: id,
      },
    });
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
