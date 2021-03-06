/* eslint-disable global-require */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import logger from './libs/logger';
import createRoutes from './routes';

const createApp = mongoose => {
  const app = new Koa();

  // If you app runnig after proxy (nginx, apache, etc.)
  app.proxy = true;
  // Because we use custom error handler
  // we don't need to output error to stderr
  // https://github.com/koajs/koa/blob/master/docs/api/index.md#error-handling
  app.silent = false;

  // logging requests only in development mode,
  // because this may generate very-very big logs on production
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const morgan = require('morgan');
    app.use(morgan('dev'));
    app.use(async (ctx, next) => {
      await next();
      logger.info({
        query: ctx.request.query,
        body: ctx.request.body,
        url: ctx.request.url,
        headers: ctx.request.headers,
      });
    });
  }

  // enable parsing request body
  app.use(bodyParser());
  const routes = createRoutes(mongoose);
  app.use(routes.routes()).use(routes.allowedMethods());

  app.use((ctx, next) => {
    ctx.response.status = 404;
    ctx.response.body = 'Not found';
    next();
  });

  app.on('error', (err, ctx) => {
    if (err.logged || ctx.status >= 500 || process.env.NODE_ENV === 'development') {
      logger.error({
        err,
        req: ctx.req,
        res: ctx.res,
      });
    }
  });

  return app;
};
export default createApp;
