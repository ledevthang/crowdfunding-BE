import {
  applyDecorators,
  CanActivate,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { RolesGuard } from 'guards/role.guard';
import { AuthRole } from 'types/auth.type';

export function Auth(
  role: AuthRole,
  /* eslint-disable-next-line */
  ...AnyGuardElse: Array<Function | CanActivate>
) {
  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(JwtAuthGuard, RolesGuard, ...AnyGuardElse),
    ApiBearerAuth()
  );
}
