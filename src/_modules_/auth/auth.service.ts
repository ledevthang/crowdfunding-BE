import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { SignUpDto } from './auth.dto';
import { PrismaService } from '_modules_/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ValidationExeption } from 'exception/validation.exception';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, firstName, lastName, password, role } = signUpDto;
    const find = await this.userService.findByEmail(email);
    if (!find) {
      const bcryptSalt = +process.env.BCRYPT_SALT;
      const hash = await bcrypt.hash(password, bcryptSalt);
      const sendUser = {
        email,
        password: hash,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        role
      };
      const createdUser = await this.userService.create(sendUser);
      //Send Email or Message to validate user with capcha in user
      return { msg: 'you have signed up' };
    } else {
      throw new ValidationExeption('Email has already been registered!');
    }
  }
}
