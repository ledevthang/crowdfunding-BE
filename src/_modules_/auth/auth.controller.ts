import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RenewDto, SignInDto, SignUpDto } from './auth.dto';
import { LocalAuthGuard } from 'guards/local-auth.guard';
import { User } from 'decorators/user.decorator';
import { Claims } from 'types/auth.type';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from 'guards/jwt-refresh.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInDto })
  login(@User() claims: Claims) {
    return this.authService.signIn(claims);
  }

  @Post('/renew')
  @ApiBody({ type: RenewDto })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @User('id') userId: number,
    @Body('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
