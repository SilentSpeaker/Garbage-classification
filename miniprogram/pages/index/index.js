//index.js
const app = getApp()

Page({
  data: {
    SHOW_TOP: true,
    logined: app.globalData.nickname != '' || app.globalData.avatarUrl != ''
  },
  onLoad: function(options) {
    console.log("首页加载成功！")
    var myDate = new Date();
    var isShowed = wx.getStorageSync("tip")
    if (isShowed != 1) {
      setTimeout(() => {
        this.setData({
          SHOW_TOP: false
        })
        wx.setStorageSync("tip", 1)
      }, 2 * 1000)
    } else {
      this.setData({
        SHOW_TOP: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      logined: app.globalData.nickname != '' || app.globalData.avatarUrl != ''
    })
  },
  /**
   * 点击 搜索
   */
  goSearch: function() {
    wx.navigateTo({
      url: 'search',
    })
  },
  /**
   * 点击 自动识别
   */
  onBindCamera: function() {
    wx.navigateTo({
      url: 'camera/camera',
    })
  },
  /**
   * 点击 智能询问
   */
  onAikefu: function() {
    wx.showToast({
      title: '开发中',
      icon: 'none'
    })
  },
  handleContact(e) {
    console.log(e)
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  /**
   * 分享 界面
   */
  onShareAppMessage: function() {
    return {
      title: "智能分类垃圾",
      imageUrl: "https://6c61-laji-bopv4-1259505195.tcb.qcloud.la/laji.png?sign=7c8d38e435eb3104fcf5933ebff667f5&t=1561904613",
      path: "pages/index/index"
    }
  },
  unLogined() {
    wx.showToast({
      title: '请先授权登录',
      icon: "none"
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/user/user',
      })
    }, 800)
  }
})