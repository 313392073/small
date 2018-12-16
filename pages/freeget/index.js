// pages/freeget/index.js
const app = getApp()
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    cdata:'',
    cid:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cid: options.ids ? options.ids*1 : 1
    })
    let param = {
      id: options.ids ? options.ids:this.data.cid
    }
    common.reqUrl(app.globalData.config.reqFreeDetail, 'POST', param, this.doSuccess, this.getFail)
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
  doSuccess:function(e){
    if (e.statusCode == 200) {
      this.setData({
        cdata:e.data.info
      })
    } else {
      common.showError()
    }
  },
  getFail:function(err){
    common.showError()
  },
  gotomy:function(e){
    wx.navigateTo({
      url: '../../pages/login/index'
    })
  },
  getTel:function(e){
    var tel = e.detail.value;
    this.setData({
      tel: tel
    })
  },
  getNow:function(){
    var self = this;
    if(self.data.tel == '') {
      common.showMsg('请输入手机号领取优惠')
      return false;
    }
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (reg.test(self.data.tel) == false) {
      common.showMsg('请输入正确的手机号码')
      return false
    }
    let param = {
      member_id: wx.getStorageSync('userIdInfo').id ? wx.getStorageSync('userIdInfo').id : wx.getStorageSync('id'),
      course_id: this.data.cid,
      phone: self.data.tel*1
    }
    if(wx.getStorageSync('userIdInfo').id || wx.getStorageSync('id')){
      //发送请求
      common.reqUrl(app.globalData.config.reqActget, 'POST', param, this.getSuccess, this.getFail)
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
    if (e.statusCode == 200){
      if(e.data.code == -21) {
        common.showMsg(e.data.msg);
      }else{
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/login/index',
          })
        }, 1000)
      }
    }else{
      common.showError()
    }
   
  },
  getFail:function(err){
    common.showError()
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