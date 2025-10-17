import { Context } from 'koa';
import AppDataSource from '../database/data-source';
import { User } from '../entities/user';
export async function signInOrRegister(ctx: Context) {
  const { email } = ctx.request.body as { email?: string };
  if (!email) {
    ctx.status = 400;
    ctx.body = { message: 'email is required' };
    return;
  }
  const repo = AppDataSource.getRepository(User);
  let user = await repo.findOne({ where: { email } });
  if (!user) {
    user = repo.create({ email, name: email.split('@')[0], role: 'user', isOnboarded: false });
    await repo.save(user);
  }
  ctx.body = { user };
}
