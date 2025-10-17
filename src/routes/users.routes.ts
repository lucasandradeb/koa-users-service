import Router from 'koa-router';
import { editAccount, listUsers } from '../controllers/users.controller';
import { auth } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = new Router();
router.get('/users', auth, authorize('admin'), listUsers);
router.put('/edit-account', auth, editAccount);

export default router;
