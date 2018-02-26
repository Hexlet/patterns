import Koa from 'koa';
import Router from 'koa-router';
import addRoutes from './routes';

export default () => {
  const app = new Koa();

  const router = new Router();
  addRoutes(router);
  app.use(router.routes());

  return app;
};
