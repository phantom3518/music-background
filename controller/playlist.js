// 引入koa-router并对其实例化
const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB.js')

//配置路由
router.get('/list', async (ctx, next) => {
    //查询歌单列表
    const query = ctx.request.query
    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(query.start),
        count: parseInt(query.count)
    })
    let data = []
    if (res.resp_data) {
        data = JSON.parse(res.resp_data).data
        // console.log(JSON.parse(res.resp_data))
    }
    ctx.body = {
        data,
        code: 20000
    }
})
//根据id查询歌单信息
router.get('/getById', async (ctx, next) => {
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    // console.log(res)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})
//根据id更新歌单信息
router.post('/updatePlaylist', async (ctx, next) => {
    const params = ctx.request.body
    const query = `db.collection('playlist').doc('${params._id}').update({
        data: {
            name:'${params.name}',
            copywriter: '${params.copywriter}'
        }
    })`
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    // console.log(res)
    ctx.body = {
        code: 20000,
        data: res
    }
})

//根据id删除歌单信息
router.post('/deletePlaylist', async (ctx, next) => {
    const params = ctx.request.body
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete', query)
    // console.log(res)
    ctx.body = {
        code: 20000,
        data: res
    }
})
module.exports = router