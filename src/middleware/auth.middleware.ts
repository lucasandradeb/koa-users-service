import { Context, Next } from 'koa';
import { verifyToken } from '../services/cognito.service';

export async function auth(ctx: Context, next: Next) {
  const authHeader = ctx.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { message: 'Missing or invalid Authorization header' };
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const user = await verifyToken(token);
    ctx.state.user = user; // { sub, email, scope, raw }
    await next();
  } catch (error) {
    ctx.status = 401;
    const errorMessage = error instanceof Error ? error.message : String(error);
    ctx.body = { message: 'Invalid or expired token', error: errorMessage };
  }
}
