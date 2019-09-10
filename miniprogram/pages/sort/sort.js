// pages/sort/sort.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [{}],
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function(options) {

  // },
  onLoad() {
    let that = this
    this.showLoading();
    db.collection('sort').get({
      success: function(res) {
        let list = res.data;
        that.setData({
          list: list,
          listCur: list[0]
        })

      },
      fail: res => {
        that.hideLoading();
        wx.showToast({
          title: '网络较慢',
          icon: "none"
        })
      }
    })
  },
  onReady() {
    this.hideLoading();
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          console.log(data)
          list[i].top = tabHeight;
          tabHeight = tabHeight 
          // + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
  showLoading() {
    this.setData({
      loadModal: true
    });
  },
  hideLoading() {
    console.log('hide')
    // wx.hideLoading()
    this.setData({
      loadModal: false
    })
  }
})