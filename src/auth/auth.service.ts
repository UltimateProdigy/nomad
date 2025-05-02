import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;

    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: Prisma.UserCreateInput) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.databaseService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        username: registerDto.username,
        description: registerDto.description,
      },
    });

    return {
      message: 'User registered successfully',
      data: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
