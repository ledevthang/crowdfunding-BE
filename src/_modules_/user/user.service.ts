import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { CreateUserDto, UserResult } from './user.dto';
import { exclude } from 'utils/transform.util';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { displayName, email, firstName, lastName, password, role } =
      createUserDto;

    return await this.prisma.user.create({
      data: {
        displayName,
        email,
        firstName,
        lastName,
        password,
        role
      }
    });
  }

  async findByEmail(email: string): Promise<UserResult> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email }
    });
    return exclude(foundUser, ['password', 'refreshToken']);
  }

  async findOne(id: number): Promise<UserResult> {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    return exclude(foundUser, ['password', 'refreshToken']);
  }
}
