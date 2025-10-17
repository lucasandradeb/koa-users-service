import Router from 'koa-router';
import { signInOrRegister } from '../controllers/auth.controller';

const router = new Router({ prefix: '/auth' });
router.post('/', signInOrRegister);

export default router;
