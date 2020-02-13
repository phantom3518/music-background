const rp = require('request-promise')
const APPID = 'wx6cb7ab8a6a9c263c'
const APPSECRET = '978a6584876eafb73107183a6406bb07'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')

//获取根路径+拼接
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')
// console.log(fileName)

//从微信取token存在本地json文件中
const updateAccessToken = async () => {
    //异步发送请求
    const resStr = await rp(URL)
    //转化为对象
    const res = JSON.parse(resStr)
    console.log(res)
    //写文件
    if (res.access_token) {
        //写文件时需要对象转化成字符串
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await updateAccessToken()
    }
}
//从本地json文件中读取token
const getAccessToken = async () => {
    try {
        const readRes = fs.readFileSync(fileName, 'utf-8')
        const readObj = JSON.parse(readRes)
        // console.log(readObj)
        const createTime = new Date(readObj.createTime).getTime()
        const currentTime = new Date().getTime()
        //老token获取时间超过两小时，说明token过去，重新更新并获取token
        if((currentTime-createTime) / 3600 / 1000 >= 2) {
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    } catch (error) {
        await updateAccessToken()
        await getAccessToken()
    }

}
//token两小时刷新一次
setInterval(async () => {
    await updateAccessToken()
}, (7200 - 300) * 1000)
// updateAccessToken()

//以模块形式导出token
module.exports = getAccessToken
// console.log(getAccessToken())
