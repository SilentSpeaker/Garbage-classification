// miniprogram/pages/loading/loading.js
const app = getApp();
const db = wx.cloud.database();
var dateFomat = require('../../utils/Date.js')
var {
  UUID
} = require('../../utils/uuid.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _id = '';
    db.collection('loginlog').add({
      data: {
        loginTime: new Date().Format('MM/dd/yyyy hh:mm:ss'),
        des: ''
      }
    }).then(res => {
      _id = res._id;
      db.collection('loginlog').doc(_id).get().then(res => {
        console.log(res.data._openid)
        app.globalData.openid = res.data._openid;
        wx.cloud.callFunction({
          name: "getWhiteList",
          success(res) {
            if (res.result.findIndex(item => item == app.globalData.openid) == -1) {
              console.log('有新用户访问！')
              /*wx.cloud.callFunction({
                name: "sendMail",
                data: {
                  detail: (app.globalData.nickname == '' ? '未知用户' : app.globalData.nickname) + ' 访问了[小程序]！'
                },
                success(res) {
                  console.log(res, 'success')
                },
                fail(res) {
                  console.log(res)
                }
              })*/
              that.toIndex();
            } else {
              console.log('管理员访问！')
              db.collection('loginlog').doc(_id).update({
                data: {
                  des: '管理员访问！'
                }
              }).then(res => {
                console.log('跳转->首页')
                that.toIndex();
              }).catch(err => {
                that.toIndex('网络连接失败！')
              })
            }
          },
          fail(res) {
            console.log(res)
            that.toIndex('网络连接失败！')
          }
        })
      })
    }).catch(err => {
      that.toIndex('网络连接失败！')
    })
    let i = 0;
    var timer = setInterval(() => {
      if (i > 99) {
        clearInterval(timer)
      }
      this.setData({
        progress: i > 100 ? 100 : i
      })
      i = i + Math.ceil(Math.random() * 20);
    }, 200)

  },
  toIndex(error) {
    if (error) {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    }
    if (this.data.progress != 100) {
      this.setData({
        progress: 100
      })
    }
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 400)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})