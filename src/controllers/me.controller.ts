import { Context } from 'koa';
import AppDataSource from '../database/data-source';
import { User } from '../entities/user';

export async function me(ctx: Context) {
  const email: string = ctx.state.user?.email;
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { email } });
  ctx.body = { user };
}
