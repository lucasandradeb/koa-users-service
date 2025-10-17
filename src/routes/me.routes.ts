import Router from 'koa-router';
import { me } from '../controllers/me.controller';
import { auth } from '../middleware/auth.middleware';

const router = new Router({ prefix: '/me' });
router.get('/', auth, me);
export default router;
