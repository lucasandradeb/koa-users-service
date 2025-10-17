// src/middleware/auth.middleware.ts
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
    const email = await verifyToken(token);
    ctx.state.email = email; // { sub, email, scope, raw }
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid or expired token' };
  }
}
