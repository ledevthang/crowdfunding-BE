import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { CreateUserDto, UserResult } from './user.dto';
import { exclude } from 'ultils/transform.ultil';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createUserDto
    });
  }

  async findByEmail(email: string): Promise<UserResult> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email }
    });
    return exclude(foundUser, ['password', 'refreshToken', 'expiredTime', 'capcha']);
  }

  async findOne(id: number): Promise<UserResult> {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    return exclude(foundUser, ['password', 'refreshToken', 'expiredTime', 'capcha']);
  }
}
