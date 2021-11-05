import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * When applied to a parameter, returns the current user associated with the current request
 * (or a nullish value if there is no user).
 */
export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
