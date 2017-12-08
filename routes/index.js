const router = module.exports = require('koa-router')();

router.get('/', async (ctx, next) => {
  await ctx.render('index');
});
