import { User, UserRole } from '@prisma/client';
import { IsEmail } from 'class-validator';
import { OptionalProperty } from 'decorators/validator.decorator';

export class CreateUserDto {
  email: string;

  firstName: string;

  lastName: string;

  displayName: string;

  password: string;

  role: UserRole;

  organizationName?: string;
  organizationType?: string;
  country?: string;
  organizationWebsite?: string;
}

export class AccountUpdate {
  @OptionalProperty()
  firstName?: string;

  @OptionalProperty()
  lastName?: string;

  @OptionalProperty()
  @IsEmail()
  email?: string;

  @OptionalProperty()
  telephoneNumber?: string;

  @OptionalProperty()
  address?: string;

  @OptionalProperty()
  town?: string;

  @OptionalProperty()
  postCode?: string;

  @OptionalProperty()
  country?: string;

  @OptionalProperty()
  avatarPicture?: string;

  @OptionalProperty()
  newPassword?: string;

  @OptionalProperty()
  currentPassword?: string;

  @OptionalProperty()
  organizationName?: string;

  @OptionalProperty()
  organizationType?: string;

  @OptionalProperty()
  organizationWebsite?: string;

  @OptionalProperty()
  organizationCoutry?: string;
}

export type UserResult = Omit<
  User,
  'password' | 'refreshToken' | 'expiredTime' | 'capcha'
>;
