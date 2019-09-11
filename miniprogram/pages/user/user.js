// miniprogram/pages/user/user.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: !wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: '',
    nickname: '',
    CustomBar: 40,
    loadProgress: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  onGetUserInfo: function(e) {
    if (app.globalData.openid == '') {
      this.setData({
        loadProgress: 0
      })
      this.login(e); //

    } else {
      console.log("已登录", app.globalData.openid)
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickname: e.detail.userInfo.nickName
      })
      app.globalData.nickname = e.detail.userInfo.nickName;
      for (let i = 0; i <= 100; i++) {
        this.setData({
          loadProgress: i
        })
      }
    }
    if (this.data.loadProgress >= 100) {
      this.setData({
        loadProgress: 0
      })
      console.log('加载完毕！')
    }
  },
  login(e) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
    }).then(res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid;
      app.globalData.nickname = e.detail.userInfo.nickName;
      this.setData({
        loadProgress: 30
      })
      this.saveUserData(e);
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
    })
  },
  saveUserData(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        loadProgress: 50
      })
      console.log(e.detail.userInfo)
      const userInfo = e.detail.userInfo;
      this.refreshUserInfo(userInfo);
    }
  },
  refreshUserInfo(userInfo) {
    db.collection('user').where({
        openID: app.globalData.openid, // 填入当前用户 openid
      }).get()
      .then(res => {
        if (res.data.length == 0) {
          this.setData({
            loadProgress: 60
          })
          db.collection('user').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                openID: app.globalData.openid,
                nickname: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                sex: userInfo.gender,
                city: userInfo.city,
                province: userInfo.province,
                country: userInfo.country,
                language: userInfo.language,
                loginTime: new Date(),
                functionList: [],
                name: '',
                des: '',
                isEnable: true
              }
            }).then(res => {
              console.log(res)
              this.setData({
                loadProgress: 100
              })
            })
            .catch(console.error)
        } else {
          this.setData({
            avatarUrl: userInfo.avatarUrl,
            nickname: userInfo.nickName,
            loadProgress: 100
          })
        }
        if (this.data.loadProgress >= 100) {
          this.setData({
            loadProgress: 0
          })
          console.log('加载完毕！')
        }
      })
      .catch(err => {
        console.error(err)
      })
  }
})