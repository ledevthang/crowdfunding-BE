import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  @ApiProperty({ enum: UserRole })
  password: string;
  role: UserRole;
}

export type UserResult = Omit<
  User,
  'password' | 'refreshToken' | 'expiredTime' | 'capcha'
>;
