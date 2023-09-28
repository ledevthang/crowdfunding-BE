import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRole, Claims } from 'types/auth.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<AuthRole>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();

    const user: Claims = request.user;

    if (role === 'NORMAL')
      return user.role === 'FUNDRASIER' || user.role === 'INVESTOR';

    if (role === 'ADMINORFUNDRAISER')
      return user.role === 'FUNDRASIER' || user.role === 'ADMIN';

    if (role === 'ALL') return true;

    return role === user.role;
  }
}
