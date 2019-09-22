// miniprogram/pages/user/menu/review.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionList: [],
    commitList: [],
    count: -1,
    pageNo: 0,
    loadModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      functionList: app.globalData.functionList
    })
    Promise.all([this.getCounts(), this.getCommit()])

  },
  getCounts() {
    db.collection('commit').where({
      _openid: app.globalData.openid //'owZ5W4-QP3IEBIiTVoTAmToz-tro'
    }).count().then(res => {
      this.setData({
        count: res.total
      })
    }).catch(
      err => {
        this.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      }
    )
  },
  getCommit() {
    if (this.data.count != -1 && this.data.commitList.length >= this.data.count) {
      wx.showToast({
        title: '数据已经加载完',
        icon: "none"
      })
      return
    }
    this.showLoading();
    db.collection('commit').where({
      _openid: app.globalData.openid //'owZ5W4-QP3IEBIiTVoTAmToz-tro'
    }).skip(10 * this.data.pageNo).limit(10).get().then(res => {
      this.data.pageNo += 1;
      let commitList = this.data.commitList
      commitList.push(...res.data)
      this.setData({
        commitList: commitList
      })
      this.hideLoading()
    }).catch(
      err => {
        this.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      }
    )
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
    this.getCommit();
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