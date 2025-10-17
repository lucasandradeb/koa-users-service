import { Context } from 'koa';
import AppDataSource from '../database/data-source';
import { User } from '../entities/user';

export async function listUsers(ctx: Context) {
  const repo = AppDataSource.getRepository(User);
  const users = await repo.find({ order: { id: 'ASC' } });
  ctx.body = { users };
}

export async function editAccount(ctx: Context) {
  const email: string = ctx.state.user?.email;
  const { name, role } = ctx.request.body as { name?: string; role?: 'admin' | 'user' };
  const scopes: string[] = ctx.state.user?.scope || [];

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { email } });
  if (!user) {
    ctx.status = 404;
    ctx.body = { message: 'User not found' };
    return;
  }

  if (scopes.includes('admin')) {
    if (name) user.name = name;
    if (role) user.role = role;
    await repo.save(user);
    ctx.body = { user };
    return;
  }

  if (name) user.name = name;
  user.isOnboarded = true;
  await repo.save(user);
  ctx.body = { user };
}
