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

  const isAdmin = scopes.includes('admin');

  if (role && !isAdmin) {
    ctx.status = 403;
    ctx.body = { message: 'You do not have permission to change your role.' };
    return;
  }

  if (name) {
    user.name = name;
  }

  if (isAdmin && role) {
    user.role = role;
  }

  if (!isAdmin) {
    user.isOnboarded = true;
  }

  await repo.save(user);
  ctx.body = { user };
}
