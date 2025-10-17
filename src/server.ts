import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes/index';
import AppDataSource from './database/data-source';
import env from './config/env';

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

AppDataSource.initialize()
  .then(() => {
    app.listen(env.port, () => console.log(`API running on :${env.port}`));
  })
  .catch((err: any) => {
    console.error('Init error', err);
    process.exit(1);
  });
