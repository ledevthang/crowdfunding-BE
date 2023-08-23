import { UserRole } from '@prisma/client';

export type Claims = {
  id: string;
  email: string;
  role: UserRole;
};
