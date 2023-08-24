import { User, UserRole } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  password: string;
  role: UserRole;
}

export type UserResult = Omit<
  User,
  'password' | 'refreshToken' | 'expiredTime' | 'capcha'
>;
