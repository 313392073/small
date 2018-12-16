// pages/freelis/index.js
const common = require('../../utils/common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.reqUrl(app.globalData.config.reqFreelis, 'POST', {}, this.getSuccess, this.doFail)
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
    if (e.statusCode == 200){
      this.setData({
        datalist: e.data.info
      })
    }else{
      common.showError()
    }
  },
  gotomy: function (e) {
    wx.navigateTo({
      url: '../../pages/login/index'
    })
  },
  formSubmit: function (e) {
    if (e.detail.value.named == '' || e.detail.value.classname == '' || e.detail.value.tel == '' || e.detail.value.wechat == '') {
      common.showMsg('请将信息填写完整')
      return false
    }
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (reg.test(e.detail.value.tel) == false) {
      common.showMsg('请输入正确的手机号码')
      return false
    }
    //提交数据
    let param = {
      member_id: wx.getStorageSync('userIdInfo').id ? wx.getStorageSync('userIdInfo').id : wx.getStorageSync('id'),
      name: e.detail.value.named,
      course: e.detail.value.classname,
      phone: e.detail.value.tel * 1,
      wechat: e.detail.value.wechat
    }
    if(wx.getStorageSync('userIdInfo').id || wx.getStorageSync('id')){
      //提交数据
      common.reqUrl(app.globalData.config.reqFreedata, 'POST', param, this.doSuccess, this.doFail)
    }else{
      common.showMsg('请先到个人中心完善你的个人信息');
      setTimeout(function () {
        wx.navigateTo({
          url: '../../pages/login/index'
        })
      }, 1500)
    }
    
  },
  doSuccess: function (e) {
    if (e.statusCode == 200) {
      wx.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      common.showError()
    }
  },
  doFail: function (e) {
    common.showError()
  },
  showVip: function (e) {
    let msg = wx.getStorageSync('userIdInfo');
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
          url: '../../pages/login/index',
        })
      }, 1500)
    }
  }
})