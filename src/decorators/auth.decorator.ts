import {
  applyDecorators,
  CanActivate,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { RolesGuard } from 'guards/role.guard';

export function Auth(
  role: UserRole,
  /* eslint-disable-next-line */
  ...AnyGuardElse: Array<Function | CanActivate>
) {
  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(JwtAuthGuard, RolesGuard, ...AnyGuardElse),
    ApiBearerAuth()
  );
}
