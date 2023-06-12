import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Response } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (createUserDto) {
        const success = await this.userService.create(createUserDto);
        return res.status(HttpStatus.OK).json({ success });
      } else {
        throw new Error('Error payload creating user');
      }
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json(error.response);
    }
  }

  @Get()
  find() {
    return this.userService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
