import { Role } from "src/role/entities/role.entity";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export class ResponseUserDto {
  id: number;
  name: string;
  email: string;
  role: Role
}

export class UpdateUserDto {}

