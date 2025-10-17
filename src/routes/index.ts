import Router from 'koa-router';
import auth from './auth.routes';
import me from './me.routes';
import users from './users.routes';
import { auth as requireAuth } from '../middleware/auth.middleware';

const router = new Router();

router.get('/health', async (ctx) => {
  ctx.body = { ok: true };
});

router.get('/protected-dummy', requireAuth, (ctx) => {
  ctx.body = { ok: true, email: ctx.state.email };
});

router.use(auth.routes());
router.use(me.routes());
router.use(users.routes());

export default router;
