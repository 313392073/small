// pages/coptra/index.js
var app = getApp();
const common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay:false,
    interval:4000,
    duration:1000,
    teachcur:0,
    teachers:[],
    expData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        id: wx.getStorageSync('id')
    })
    // 企业内训
    common.reqUrl(app.globalData.config['reqtraining'], 'POST', {}, this.traSuccess, this.getFail);
    //教师列表
    common.reqUrl(app.globalData.config['reqteacher'], 'POST', {}, this.teaSuccess, this.getFail);
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
  traSuccess:function(e){
    let self = this
    if(e.statusCode == 200) {
      self.setData({
        expData: e.data.info
      })
    }else{
      this.getFail();
    }
    
  },
  teaSuccess:function(e){
    let self = this
    if (e.statusCode == 200) {
      self.setData({
        teachers: e.data.info
      })
    } else {
      this.getFail();
    }
  },
  swiperChange: function (e) {
    this.setData({
      teachcur: e.detail.current
    })
  },
  tapprev: function (e) {
    var self = this;
    this.setData({
      autoplay: false
    })
    var cur = self.data.teachcur
    if (cur >= this.data.teachers.length - 1) {
      cur = -1
    }
    this.setData({
      teachcur: ++cur,
      autoplay: true
    })
  },
  tapnext: function (e) {
    var self = this;
    this.setData({
      autoplay: false
    })
    var cur = self.data.teachcur
    if (cur < 1) {
      cur = self.data.teachers.length
    }
    this.setData({
      teachcur: --cur,
      autoplay: true
    })
  },
  gotomy: function (e) {
    wx.navigateTo({
      url: '../../pages/login/index?id=' + 1
    })
  },
  formSubmit: function (e) {
  
    if (e.detail.value.named == '' || e.detail.value.tech == '' || e.detail.value.need == '' || e.detail.value.contact == '') {
      common.showMsg('请将信息填写完整')
      return false
    } 
    //提交数据
    let param = {
      member_id: wx.getStorageSync('userIdInfo').id ? wx.getStorageSync('userIdInfo').id : wx.getStorageSync('id'),
      name: e.detail.value.named,
      course: e.detail.value.tech,
      data: e.detail.value.need,
      wechat: e.detail.value.contact
    }

    if(wx.getStorageSync('userIdInfo').id || wx.getStorageSync('id')){
      //提交数据
      common.reqUrl(app.globalData.config.reqCoptra, 'POST', param, this.getSuccess, this.getFail)
    }else{
      common.showMsg('请先到个人中心完善你的个人信息');
      setTimeout(function () {
        wx.navigateTo({
          url: '../../pages/login/index'
        })
      }, 1500)
    }
  },
  getSuccess:function(e){
    if (e.statusCode == 200) {
      wx.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      common.showMsg()
    }
  },
  getFail:function(err){
    common.showMsg()
  },
  showVip: function (e) {
    var msg = wx.getStorageSync('userIdInfo');
    let tag = msg.phone ? true : false;
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
          url: '../../pages/login/index'
        })
      }, 1500)
    }
  }
})