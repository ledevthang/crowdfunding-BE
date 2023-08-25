import { Injectable, NotAcceptableException } from '@nestjs/common';
import { SignUpDto } from './auth.dto';
import { PrismaService } from '_modules_/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '_modules_/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, firstName, lastName, password, role } = signUpDto;
    const user = await this.userService.findByEmail(email);

    if (user)
      throw new NotAcceptableException('Email has already been registered!');

    const hash = await bcrypt.hash(password, 8);

    const sendUser = {
      email,
      password: hash,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      role
    };

    await this.userService.create(sendUser);

    return { msg: 'you have signed up' };
  }
}
