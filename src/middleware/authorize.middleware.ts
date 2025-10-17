import { Context, Next } from 'koa';

export function authorize(required: 'admin' | 'user') {
  return async (ctx: Context, next: Next) => {
    const scopes: string[] = ctx.state.user?.scope || [];
    if (!scopes.includes(required)) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden: insufficient scope' };
      return;
    }
    await next();
  };
}
