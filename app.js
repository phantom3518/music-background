const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const env = 'test-r9ykx'
//cors跨域
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials:true
}))

// 接受post参数的解析
app.use(koaBody({
    multipart: true
}))

app.use(async (ctx,next) => {
    console.log('全局中间件')
    // ctx.body = "hello world"
    ctx.state.env = env
    await next()
})


//导入文件
const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')

//注册中间件
//定义一个路由/playlist
router.use('/playlist', playlist.routes())
//定义一个路由/playlist
router.use('/swiper', swiper.routes())
//定义一个路由/blog
router.use('/blog', blog.routes())


//注册路由
app.use(router.routes(),router.allowedMethods())

app.listen(3000, () => {
    console.log('服务开启在3000端口')
})

//