import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}