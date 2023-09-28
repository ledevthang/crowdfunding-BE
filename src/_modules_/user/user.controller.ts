import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Auth } from 'decorators/auth.decorator';
import { User } from 'decorators/user.decorator';
import { AccountUpdate } from './user.dto';
import { UserRole } from '@prisma/client';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth('ALL')
  whoAmI(@User('id') userId: number) {
    return this.userService.findById(userId);
  }

  @Patch()
  @Auth('ALL')
  updateAccount(
    @Body() body: AccountUpdate,
    @User('id') userId: number,
    @User('role') role: UserRole
  ) {
    return this.userService.update(body, userId, role);
  }
}
