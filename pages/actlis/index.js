// pages/actlis/index.js
const common = require('../../utils/common.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:'',
    acilist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.reqUrl(app.globalData.config.reqActlis, 'POST', {}, this.getSuccess, this.getFail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getSuccess:function(e){
    if (e.statusCode == 200) {
      this.setData({
        notice:e.data.title,
        acilist: e.data.info
      })
    }else{
      this.getFail();
    }
  },
  getFail:function(err){
    common.showError()
  },
  gotomy: function (e) {
    wx.navigateTo({
      url: '../../pages/login/index'
    })
  },
  tofreeget:function(e){
    if (e.currentTarget.dataset.act == 'true'){
      wx.navigateTo({
        url: '../../pages/freeget/index?ids=' + e.target.dataset.ids,
      })
    }else{
      wx.showToast({
        title: '已领完了',
        icon:'none',
        image:'../../image/face.png',
        duration: 2000
      })
    }
  },
  showVip: function (e) {
    let msg = wx.getStorageSync('userIdInfo');
    let tag = msg.phone?true:false;
    if (tag) {
      wx.navigateTo({
        url: '../../pages/getcop/index',
      })
    } else {
      wx.showToast({
        title: '请先个人中心绑定手机号后方可领取优惠券',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '../../pages/login/index',
        })
      }, 1500)
    }
  }
})