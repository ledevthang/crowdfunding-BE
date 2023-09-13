import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { AccountUpdate, CreateUserDto, UserResult } from './user.dto';
import { InjectS3, S3 } from 'nestjs-s3';
import { exclude } from 'utils/transform.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectS3() private readonly s3: S3
  ) {}

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

  async update(body: AccountUpdate, id: number) {
    const {
      address,
      avatarPicture,
      country,
      email,
      firstName,
      lastName,
      currentPassword,
      newPassword,
      postCode,
      telephoneNumber,
      town
    } = body;

    let newHash: string;

    if (currentPassword && newPassword) {
      const user = await this.prisma.user.findUnique({
        where: {
          id
        },
        select: {
          password: true
        }
      });

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword)
        throw new ForbiddenException('current password is incorrect');

      newHash = await bcrypt.hash(newPassword, 8);
    }

    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        streetAddress: address,
        avatarPicture,
        country,
        email,
        firstName,
        lastName,
        password: newHash,
        zip: postCode,
        phoneNumber: telephoneNumber,
        displayName: firstName + ' ' + lastName,
        city: town
      },
      select: {
        email: true,
        id: true
      }
    });
  }

  async findByEmail(email: string): Promise<UserResult> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email }
    });
    return foundUser;
  }

  async findById(id: number) {
    const me = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        kycInfor: true
      }
    });
    return exclude(me, ['password', 'refreshToken']);
  }
}
