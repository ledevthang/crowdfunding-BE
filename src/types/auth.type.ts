import { User, UserRole } from '@prisma/client';

export type Claims = Omit<User, 'password' | 'refreshToken'>;

export type AuthRole = UserRole | 'NORMAL' | 'ALL';
