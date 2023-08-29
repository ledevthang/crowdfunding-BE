import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Auth } from 'decorators/auth.decorator';
import { User } from 'decorators/user.decorator';
import { AccountUpdate } from './user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth('INVESTOR')
  whoAmI(@User('id') userId: number) {
    return this.userService.findById(userId);
  }

  @Patch()
  @Auth('INVESTOR')
  updateAccount(@Body() body: AccountUpdate, @User('id') userId: number) {
    return this.userService.update(body, userId);
  }
}
