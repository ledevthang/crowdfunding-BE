import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Claims } from 'types/auth.type';

export const User = createParamDecorator(
  (data: keyof Claims, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  }
);
