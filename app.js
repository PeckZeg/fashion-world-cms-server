const bodyparser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const proxy = require('koa-proxy');
const views = require('koa-views');
const json = require('koa-json');
const path = require('path');
const Koa = require('koa');

const app = new Koa();

const { FW_API_SERVER = 'http://localhost:3003' } = process.env;

app.use(proxy({
  host: FW_API_SERVER,
  match: /^\/api(?:\/)?/
}));

const index = require('./routes/index')
// const users = require('./routes/users')

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))

app.use(require('koa-static')(path.join(__dirname, 'build')));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
