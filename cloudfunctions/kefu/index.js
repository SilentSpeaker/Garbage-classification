// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('event', event);
  console.log('context', context);
  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: '客服功能开发中',
    },
  })

  return 'success'
}