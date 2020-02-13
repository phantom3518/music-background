const getAccessToken = require('./getAccessToken')
const rp = require('request-promise')
const fs = require('fs')

const cloudStorge = {
    //获取文件下载链接
    async download(ctx, fileList) {
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                file_list: fileList
            },
            json: true
        }
        // console.log(options)
        return await rp(options)
            .then(res => {
                return res
            })
            .catch(err => {
                console.log(err)
            })

    },
    //获取文件上传链接
    async upload(ctx) {
        //1.请求地址
        const ACCESS_TOKEN = await getAccessToken()
        // console.log(ctx.request)
        // console.log(ctx.request.files)
        const file = ctx.request.files.file
        // console.log(file)
        const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
        // console.log(path)
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                path,
                env: ctx.state.env
            },
            json: true
        }
        // console.log(options)
        const info = await rp(options)
            .then(res => {
                return res
            })
            .catch(err => {
                console.log(err)
            })
        // console.log(info)

        //2.上传图片
        const params = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            uri: info.url,
            formData: {
                key: path,
                Signature: info.authorization,
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                file: fs.createReadStream(file.path)
            },
            json: true
        }
        //没有返回值
        await rp(params)
        return info.file_id
    },

    //删除文件
    async delete(ctx, fileid_list) {
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                fileid_list: fileid_list
            },
            json: true
        }

        return await rp(options)
            .then(res => {
                return res
            })
            .catch(err => {
                console.log(err)
            })
    }

}
module.exports = cloudStorge