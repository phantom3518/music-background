//调用云函数
const getAccessToken = require('../utils/getAccessToken.js')
const rp = require('request-promise')

//ctx上下文，fnName 方法名称，parmas 参数
const callCloudFn = async (ctx, fnName,params) => {
    //查询歌单列表
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
        method: 'POST',
        //触发云函数地址，name为云函数名称
        uri: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${fnName}`,
        body: {
           ...params
        },
        json: true // Automatically stringifies the body to JSON
    };
    
    return await rp(options)
        .then((res) => {
            // console.log(res)
            return res
        })
        .catch((err) => {
            // console.log(err)
        });
    
}

module.exports = callCloudFn