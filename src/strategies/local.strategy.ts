import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '_modules_/auth/auth.service';
import { Strategy } from 'passport-local';
import { Claims } from 'types/auth.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }
  async validate(email: string, password: string): Promise<Claims> {
    const user = await this.authService.validateUser(email, password);
    return user;
  }
}
