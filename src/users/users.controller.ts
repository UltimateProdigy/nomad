import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from 'generated/prisma';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body()
    user: Prisma.UserCreateInput,
  ) {
    return this.usersService.create(user);
  }
  @Get()
  findAll(@Query('role') role?: 'USER' | 'ADMIN') {
    return this.usersService.findAll(role);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: Prisma.UserUpdateInput) {
    return this.usersService.update(+id, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
