import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Ip,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from 'generated/prisma';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new MyLoggerService(UsersController.name);
  @Post()
  create(
    @Body()
    user: Prisma.UserCreateInput,
  ) {
    return this.usersService.create(user);
  }
  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: 'USER' | 'ADMIN') {
    this.logger.log(`Request for all Users\t${ip}`, UsersController.name);
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
