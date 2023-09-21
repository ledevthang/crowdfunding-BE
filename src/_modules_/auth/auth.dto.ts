import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'This is a required property'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'This is a required property'
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class RenewDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
