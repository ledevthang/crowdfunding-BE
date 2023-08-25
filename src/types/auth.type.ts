import { User } from '@prisma/client';

export type Claims = Omit<User, 'password' | 'refreshToken'>;
