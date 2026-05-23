import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestUser {
  [key: string]: unknown;
}

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
