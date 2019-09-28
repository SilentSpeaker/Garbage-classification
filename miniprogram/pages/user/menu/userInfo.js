// miniprogram/pages/user/menu/userInfo.js
const regeneratorRuntime = require('../../../utils/regenerator-runtime/runtime')
var dateFomat = require('../../../utils/Date.js')
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: app.globalData.avatarUrl,
    nickname: app.globalData.nickname,
    openID: app.globalData.openid,
    data: [],
    loadModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.showLoading()
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickname: app.globalData.nickname,
      openID: app.globalData.openid,
    })
    Promise.all([this.getLoginLog(), this.getFileLog(), this.getCommitLog()]).then(
      res => {
        let list = []
        list.push(...res[0].data.map(item => {
          let date = new Date(item.loginTime)
          return {
            time: date,
            month_day: date.Format('MM月dd日'),
            year: date.Format('yyyy'),
            clock: date.Format('hh:mm'),
            type: 'login'
          }
        }))
        list.push(...res[1].data.map(item => {
          let date = new Date(item.cTime)
          return {
            time: date,
            month_day: date.Format('MM月dd日'),
            year: date.Format('yyyy'),
            clock: date.Format('hh:mm'),
            type: 'carame'
          }
        }))
        list.push(...res[2].data.map(item => {
          let date = new Date(item.commitTime)
          return {
            time: date,
            month_day: date.Format('MM月dd日'),
            year: date.Format('yyyy'),
            clock: date.Format('hh:mm'),
            type: 'commit'
          }
        }))
        this.setData({
          data: this.dataFormat(list)
        })
        this.hideLoading()
      }
    ).catch()

  },

  async getLoginLog() {
    let count = await db.collection('loginlog').where({
      _openid: app.globalData.openid
    }).count()
    count = count.total
    count = Math.ceil(count / 20)
    let data = [];
    for (let i = 0; i < count; i++) {
      let d = await db.collection('loginlog').where({
        _openid: app.globalData.openid
      }).skip(20 * i).limit(20).get()
      data.push(...d.data)
    }
    return {
      data: data
    }

  },
  async getFileLog() {
    let count = await db.collection('fileList').where({
      _openid: app.globalData.openid
    }).count()
    count = count.total
    count = Math.ceil(count / 20)
    let data = [];
    for (let i = 0; i < count; i++) {
      let d = await db.collection('fileList').where({
        _openid: app.globalData.openid
      }).skip(20 * i).limit(20).get()
      data.push(...d.data)
    }
    return {
      data: data
    }
  },
  async getCommitLog() {
    let count = await db.collection('commit').where({
      _openid: app.globalData.openid
    }).count()
    count = count.total
    count = Math.ceil(count / 20)
    let data = [];
    for (let i = 0; i < count; i++) {
      let d = await db.collection('commit').where({
        _openid: app.globalData.openid
      }).skip(20 * i).limit(20).get()
      data.push(...d.data)
    }
    return {
      data: data
    }
  },

  dataFormat(list) {
    let result = [...new Set(list.map(m => m.year))]
    // result.push("2010")
    result.sort((d1, d2) => d1 - d2)
    result = result.map(m => ({
      year: m,
      month: []
    }))
    result.forEach(y => {
      let month = [...new Set(list.filter(f => f.year == y.year).map(m => m.month_day))]
      month.sort()
      month.sort((d1, d2) => -1)
      month = month.map(m => ({
        month: m,
        day: []
      }))

      month.forEach(m_d => {
        let day = list.filter(f => f.year == y.year && f.month_day == m_d.month)
        day.sort((d1, d2) => d2.time - d1.time)
        m_d.day = (day.map(m => ({
          type: m.type,
          time: m.clock
        })))
      })
      y.month = month

    })
    return result
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

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

  },
  showLoading() {
    this.setData({
      loadModal: true
    });
  },
  hideLoading() {
    console.log('hide')
    this.setData({
      loadModal: false
    })
  }
})