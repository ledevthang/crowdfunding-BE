import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../src/user/user.service';
import { SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  
  async signIn(verifyDto: SignInDto): Promise<any> {
    const { email, password } = verifyDto;
    const user = await this.userService.verifyUser(email, password);
    if (user) {
      const payload = { id: user.id, email: user.email, roleId: user.roleId};
      // const [accessToken, refreshToken] = await Promise.all([this.generateAccessToken(payload),this.generateRefreshToken(payload)])
      const accessToken = await this.generateAccessToken(payload)
      return {
        access_token: accessToken,
        // refresh_token: refreshToken,
      }
    }

    return new UnauthorizedException();
    // TODO: Generate a JWT and return it here
    // instead of the user object
  }

  async generateAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  // async generateRefreshToken(payload: any) {
  //   return await this.jwtService.signAsync(payload, { expiresIn: '7d' });
  // }
}
