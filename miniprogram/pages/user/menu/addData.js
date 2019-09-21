// miniprogram/pages/user/menu/addData.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    picker: [],
    sort: [],
    name: '',
    errMsg: '',
    des: '',
    loadModal: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.name) {
      this.setData({
        name: options.name
      })
    }
    let that = this;
    db.collection('sort').get().then(res => {
      that.setData({
        sort: res.data,
        picker: res.data.map(item => item.name)
      })
    })
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
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  nameChange(e) {
    let that = this
    this.setData({
      name: e.detail.value
    })
  },
  textareaAInput(e) {
    this.setData({
      des: e.detail.value
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  commit() {
    let that = this
    that.showLoading();
    db.collection('product').where({
      name: that.data.name
    }).get().then(res => {
      if (res.data.length > 0) {
        that.hideLoading();
        wx.showToast({
          title: '[' + that.data.name + ']已经存在了哦！',
          icon: "none"
        })
      } else {
        db.collection('commit').where({
          name: that.data.name
        }).get().then(res => {
          if (res.data.length > 0) {
            that.hideLoading();
            wx.showToast({
              title: '[' + that.data.name + ']已经有人提交了哦！',
              icon: "none"
            })
          } else {
            that.commitData();
          }
        }).catch(
          err => {
            that.hideLoading();
            wx.showToast({
              title: '网络连接失败',
              icon: "none"
            })
          })
      }
    }).catch(
      err => {
        that.hideLoading();
        wx.showToast({
          title: '网络连接失败',
          icon: "none"
        })
      }
    )
  },
  commitData() {
    db.collection('commit').add({
      data: {
        name: this.data.name,
        sortId: this.data.sort[this.data.index]._id,
        des: this.data.des,
        commitTime: new Date(),
        status: 'unReview'
      }
    }).then(
      res => {
        console.log(res)
        if (res._id != '' && res._id != undefined) {
          this.hideLoading();
          wx.showToast({
            title: '提交成功，等待审核',
            icon: "none",
            duration: 2500
          })
          setTimeout(() => {
            this.back();
          }, 1000)

        }
      }
    ).catch(
      err => {
        this.hideLoading();
        wx.showToast({
          title: '网络连接失败',
          icon: "none"
        })
      }
    )
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