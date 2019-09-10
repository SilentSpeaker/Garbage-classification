//index.js
const app = getApp()

Page({
  data: {
    SHOW_TOP: true,
  },

  onLoad: function(options) {
    console.log("index-onLoad")
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
    // wx.navigateTo({
    //   url: '/pages/android/qa',
    // })
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
  }
})