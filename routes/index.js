const pathToRegexp = require('path-to-regexp');
const router = module.exports = require('koa-router')();

router.get(pathToRegexp('(/[^\/]+)+'), async (ctx, next) => {
  await ctx.render('index');
});
