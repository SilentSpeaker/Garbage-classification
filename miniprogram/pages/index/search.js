// miniprogram/pages/index/search.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MAX_LIMIT: 20,
    page: 0,
    dataCount: 0,
    datas: [],
    sort: [],
    searchTxt: "",
    logo: "",
    typeDescribe: "",
    isSHow: false,
    placeholderText: '让我看看你是什么垃圾'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    this.data.dataCount = db.collection('product').count()
    db.collection('sort').get({
        success: function(res) {
          that.setData({
            sort: res.data
          })
        },
        fail: res => {
          wx.showToast({
            title: '网络较慢',
            icon: "none"
          })
        }
      })
    if (options.search) {
      console.log('带参跳转！')
      this.setData({
        searchTxt: options.search
      })
      this.onGetData();
    }
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
    this.data.page = 0
    this.data.datas = []
    this.onGetData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 点击 搜索
  onReachBottom: function() {
    this.onGetData()
  },
  // 点击 搜索
  searchIcon: function(e) {
    this.data.searchTxt = e.detail.value
    console.log("输入:" + e.detail.value)
    this.data.page = 0
    this.onGetData()
  },

  // 获取 数据
  onGetData: function() {
    // wx.showLoading({
    //   title: '正在加载数据中.....',
    // })
    var that = this
    this.showLoading()
    if (this.data.dataCount < this.data.page * this.data.MAX_LIMIT) {
      wx.showToast({
        title: '数据已经加载完',
        icon: "none"
      })
      that.hideLoading()
      return
    }
    console.log(`获取第${this.data.page}页`)
    if (this.data.page == 0) {
      this.data.datas = []
    }

    var datas = db.collection('product').skip(this.data.page * this.data.MAX_LIMIT).limit(this.data.MAX_LIMIT).where({
      name: db.RegExp({
        regexp: that.data.searchTxt,
      })
    }).get({
      success: function(res) {
        that.hideLoading()
        that.data.page = that.data.page + 1
        for (var i = 0; i < res.data.length; i++) {
          that.data.datas.push(res.data[i])
        }
        that.setData({
          datas: that.data.datas
        })
        console.log(that.data.datas)
      },
      fail: res => {
        that.hideLoading()
        wx.showToast({
          title: '数据加载失败',
          icon: "none"
        })
      }
    })
    // console.log(datas)
  },
  // 点击 返回项
  onItemClick: function(event) {
    let index = event.currentTarget.dataset.index
    let logoImg = ""
    let result = this.data.datas.filter((i) => {
      return i.id == index
    })[0]
    switch (parseInt(result.sortId)) {
      case 1:
        logoImg = "/images/RecycleableWaste.jpg"
        break;
      case 2:
        logoImg = "/images/HazardouAwaste.jpg"
        break;
      case 3:
        logoImg = "/images/HouseholdfoodWaste.jpg"
        break;
      case 4:
        logoImg = "/images/ResidualWaste.png"
        break;
    }
    console.log(this.data.sort)
    let des = result.des != undefined ? result.des :
      this.data.sort.filter((i) => {
        return i._id == result.sortId
      })[0].action.join("; ") + "。";
    this.setData({
      logo: logoImg,
      typeDescribe: des,
      isShow: !this.data.isShow
    })
    console.log(this.data.isShow)
  },
  hideModal: function() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
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