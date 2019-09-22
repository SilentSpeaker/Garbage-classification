// miniprogram/pages/user/user.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: !wx.canIUse('button.open-type.getUserInfo'),
    defaultUrl: '/images/icon_user_default.png',
    avatarUrl: app.globalData.avatarUrl,
    nickname: app.globalData.nickname,
    loadProgress: false
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
    if (app.globalData.openid == '' || app.globalData.nickname == '') {
      this.setData({
        loadProgress: true
      })
      this.login(e); //

    } else {
      console.log("已登录", app.globalData.openid)
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickname: e.detail.userInfo.nickName
      })
      app.globalData.nickname = e.detail.userInfo.nickName;
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
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
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
      this.saveUserData(e);
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
    })
  },
  saveUserData(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
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
        if (res.data.length == 0) { // 新增用户
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
                loadProgress: false
              })
            })
            .catch(console.error)
        } else { // 更新用户 
          app.globalData.functionList = res.data[0].functionList
          this.setData({
            avatarUrl: userInfo.avatarUrl,
            nickname: userInfo.nickName,
            loadProgress: false
          });
          // 更新用户信息
          db.collection('user').doc(res.data[0]._id).update({
            data: {
              nickname: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl,
              sex: userInfo.gender,
              city: userInfo.city,
              province: userInfo.province,
              country: userInfo.country,
              language: userInfo.language,
            }
          }).then(res => {
            console.log(`更新了${res.stats.updated}条记录！`)
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  clickMenu(e) {
    if (app.globalData.avatarUrl == '' && app.globalData.nickname == '') {
      if (e.currentTarget.id == 'search' || e.currentTarget.id == 'camera') {} else {
        wx.showToast({
          title: '请先授权登录',
          icon: "none"
        })
        return
      }
    }
    switch (e.currentTarget.id) {
      case 'search': // 搜一搜
        wx.navigateTo({
          url: '/pages/index/search',
        })
        break;
      case 'camera': // 自动识别
        wx.navigateTo({
          url: '/pages/index/camera/camera',
        })
        break;
      case 'feedback': // 问题反馈
        console.log('进入客服会话')
        break;
      case 'add-data': // 添加数据
        wx.navigateTo({
          url: 'menu/addData',
        })
        break;
      case 'review-data': // 审核
        wx.navigateTo({
          url: 'menu/review',
        })
        break;
      default: // 开发中
        wx.showToast({
          title: '开发中',
          icon: 'none'
        })
        break;
    }
  },
  handleContact(e) { // 客服会话返回
    console.log(e)
  }
})