import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Claims } from 'types/auth.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<UserRole>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();

    const user: Claims = request.user;

    return role === user.role;
  }
}
