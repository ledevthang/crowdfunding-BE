import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from 'class-validator';

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
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'This is a required property'
  })
  @IsEnum(UserRole)
  role: UserRole;
}
