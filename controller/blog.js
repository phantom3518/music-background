const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const callCloudStorge = require('../utils/callCloudStorage')

router.get('/blog', async (ctx, next) => {

    const params = ctx.request.query
    // console.log(params)

    //查询博客内容
    const queryblog = `
        db.collection('blog').skip(${params.start}).limit(${params.count}).orderBy('createTime','desc').get()
    `
    const blogRes = await callCloudDB(ctx, 'databasequery', queryblog)
    
    // //查询对应博客的评论
    // const commentTasks = []
    // const comments = []
    // // console.log(blogRes.data.length)
    // for(let i=0,len=blogRes.data.length;i<len;i++) {
    //     // console.log(JSON.parse(blogRes.data[i])._id)
    //     const blogid = JSON.parse(blogRes.data[i])._id
    //     const querycomment = `
    //     db.collection('blog-comment').where({blogId:'${blogid}'}).orderBy('createTime','desc').get()
    // `   
    //     let commentRes = await callCloudDB(ctx, 'databasequery', querycomment)
    //     // console.log(querycomment)
    //     // console.log('1')
    //     commentTasks.push(commentRes)
    //     // console.log(commentTasks)
        
    // }
    // if (commentTasks.length > 0) {
    //     commentList = (await Promise.all(commentTasks)).reduce((acc, cur) => {
    //       return {
    //         data: acc.data.concat(cur.data)
    //       }
    //     })
    // }

    // const blogData =  blogRes.data
    // const commentData = commentList.data
    // for(let i=0,len=blogRes.data.length;i<len;i++) {
    //     blogData: {
                        
    //     }
    // }
    // console.log(blogRes.data)
    // console.log(commentList.data)

    ctx.body = {
        code: 20000,
        data:blogRes.data,
    }
})

router.post('/del', async (ctx, next) => {

    const params = ctx.request.body
    const blog = `db.collection('blog').doc('${params._id}').remove()`
    const comment = `db.collection('blog-comment').where({blogId:'${params._id }'}).remove()`

    const blogDelRes = await callCloudDB(ctx, 'databasedelete', blog)
    const commentDelRes = await callCloudDB(ctx, 'databasedelete', comment)

    const blogImgDelRes = await callCloudStorge.delete(ctx, params.img)

    ctx.body = {
        code: 20000,
        blogDelRes,
        commentDelRes,
        blogImgDelRes
    }
})

module.exports = router