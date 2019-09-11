// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.163.com', //网易163邮箱 smtp.163.com qq smtp.qq.com
  port: 25, //网易邮箱端口 25 qq 465
  auth: {
    user: 'iq36165730@163.com', //邮箱账号
    pass: 'mypass123' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async(event, context) => {
  // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '来自小程序 <iq36165730@163.com>',
    // 主题
    subject: '有新的消息',
    // 收件人
    to: '821866219@qq.com',
    // 邮件内容，text或者html格式
    text: event.nickname + '访问了小程序'
    // + '<img src=' + event.filePath + '>'
    //可以是链接，也可以是验证码
  };

  let res = await transporter.sendMail(mail);
  return res;
}