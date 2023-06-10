export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export class ResponseUserDto {
  id: number;
  name: string;
  email: string;
}

export class UpdateUserDto {}

