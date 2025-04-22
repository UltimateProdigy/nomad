import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Leah Jeneah',
      email: 'leah@mail.com',
      role: 'USER',
    },
    {
      id: 2,
      name: 'Akinola Ifeoluwa',
      email: 'ife@mail.com',
      role: 'USER',
    },
    {
      id: 3,
      name: 'Taiwo Ifeloluwa',
      email: 'ife@mail.com',
      role: 'ADMIN',
    },
  ];

  findAll(role?: 'USER' | 'ADMIN') {
    if (role) {
      const rolesArray = this.users.filter((user) => user.role === role);
      if (rolesArray.length === 0)
        throw new NotFoundException('User Role Not Found');
      return rolesArray;
    }
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  create(user: CreateUserDto) {
    const newUser = {
      id: 0,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updatedUser: UpdateUserDto) {
    this.users ===
      this.users.map((user) => {
        if (user.id === id) {
          return { ...user, ...updatedUser };
        }
        return user;
      });

    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
