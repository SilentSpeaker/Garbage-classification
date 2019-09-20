// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let whiteList = [
    "owZ5W4-QP3IEBIiTVoTAmToz-tro",
    "owZ5W45cveIptYAmY8tghTqRbTUg"  //未知用户 一直访问
  ]
  return whiteList
}