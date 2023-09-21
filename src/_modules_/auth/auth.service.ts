import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException
} from '@nestjs/common';
import { SignUpDto } from './auth.dto';
import { PrismaService } from '_modules_/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '_modules_/user/user.service';
import { Claims } from 'types/auth.type';
import { exclude } from 'utils/transform.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const {
      email,
      firstName,
      lastName,
      password,
      role,
      organizationName,
      organizationType,
      country,
      organizationWebsite
    } = signUpDto;
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
      role,
      organizationName,
      organizationType,
      country,
      organizationWebsite
    };

    await this.userService.create(sendUser);

    return { msg: 'you have signed up' };
  }

  async signIn(claims: Claims) {
    const [tokens, user] = await Promise.all([
      this.generateTokens(claims),
      this.prisma.user.findUnique({
        where: { id: claims.id }
      })
    ]);
    return {
      ...tokens,
      user: exclude(user, ['password', 'refreshToken'])
    };
  }

  async validateUser(email: string, password: string): Promise<Claims> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) throw new UnauthorizedException('Email is not exist');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      throw new UnauthorizedException('Password is incorrect');

    return exclude(user, ['password', 'refreshToken']);
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (refreshToken !== user.refreshToken) throw new UnauthorizedException();

    const tokens = await this.generateTokens(
      exclude(user, ['password', 'refreshToken'])
    );

    return tokens;
  }

  private async generateTokens(claims: Claims) {
    const accessToken = this.jwtService.sign(claims, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      secret: process.env.ACCESS_TOKEN_SECRET
    });

    const refreshToken = this.jwtService.sign(
      { sub: claims.id },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        secret: process.env.REFRESH_TOKEN_SECRET
      }
    );

    await this.prisma.user.update({
      where: { id: claims.id },
      data: {
        refreshToken
      }
    });

    return {
      accessToken,
      refreshToken
    };
  }
}
