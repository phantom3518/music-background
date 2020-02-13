const Router = require('koa-router')
const router = new Router()
//读取云数据库
const callCloudDB = require('../utils/callCloudDB.js')
const callCloudStorge = require('../utils/callCloudStorage')


//从云存储中获取轮播图封面信息
//从云数据库中发送两次请求，fileid转化为图片http链接获取到页面上
router.get('/list', async (ctx, next) => {
    //http的api默认获取十条数据
    const query = `db.collection('swiper').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    // console.log(res)
    //文件下载链接 batchDownloadFile 格式变成数组对象
    let fileList = []
    const data = res.data

    // console.log(data)
    for (let i = 0, len = data.length; i < len; i++) {
        fileList.push({
            fileid: JSON.parse(data[i]).fileid,
            max_age: 7200
        })
    }
    // console.log(fileList)
    //调用文件下载链接函数
    const dlRes = await callCloudStorge.download(ctx, fileList)
    // console.log(dlRes)
    const swiperList = []
    for (let i = 0, len = fileList.length; i < len; i++) {
        swiperList.push({
            ...JSON.parse(data[i]),
            download_url: dlRes.file_list[i].download_url
        })
    }
    // console.log(swiperList)
    ctx.body = {
        data: swiperList,
        code: 20000
    }
})

//将轮播图封面上传云存储
router.post('/upload', async (ctx, next) => {
    const fileid = await callCloudStorge.upload(ctx)
    console.log(fileid)
    //写入数据库
    const query = `
        db.collection('swiper').add({
            data: {
                fileid:'${fileid}'
            }
        })
    `
    //将云存储的图片数据存到云数据库
    const res = await callCloudDB(ctx, 'databaseadd', query)
    ctx.body = {
        code: 20000,
        id_list: res.id_list
    }
})

//删除轮播图封面
router.get('/del', async(ctx, next) => {
    const params = ctx.request.query
    // console.log(params)
    const query = `db.collection('swiper').doc('${params._id}').remove()`
    //删除云数据库中内容
    const delDBRes = await callCloudDB(ctx, 'databasedelete', query)
    //删除云存储中内容
    const delStorageRes = await callCloudStorge.delete(ctx, [params.fileid])
    //返回前端，不写会404
    ctx.body = {
        code: 20000,
        data: {
            delDBRes,
            delStorageRes
        }
    }

})

module.exports = router