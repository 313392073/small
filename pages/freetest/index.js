// pages/freetest/index.js
const common = require('../../utils/common.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:true,
    testlist:[],
    tel:'',
    wechat:'',
    subdata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.reqUrl(app.globalData.config.reqFreetest, 'POST', {}, this.doSuccess, this.getFail)
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
    e.data.info[0]['tag'] = 2
    e.data.info[1]['tag'] = 5
    // testlist
    this.setData({
      testlist: e.data.info
    })
  },
  gotomy: function (e) {
    wx.navigateTo({
      url: '../../pages/login/index'
    })
  },
  choose:function(e){
    var ids = e.target.id;
    var pindex = e.currentTarget.dataset.pindex;
    var list = 'testlist[' + pindex + '].tag';
    this.setData({
      [list]: ids
    })
  },
  getTel:function(e){
    this.setData({
      tel:e.detail.value
    })
  },
  getWechat:function(e){
    this.setData({
      wechat: e.detail.value
    })
  },
  subData:function(){
    var self = this
    if (self.data.tel == '' || self.data.wechat == '') {
      common.showMsg('请将信息填写完整')
      return false;
    }
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (reg.test(self.data.tel) == false) {
      common.showMsg('请输入正确的手机号码')
      return false;
    }
    var subdata = []
    var list = self.data.testlist
    for(var i=0;i<list.length;++i){
      subdata.push(list[i]['tag'])
    }
    var datas = subdata.join(',')
    var param = {
      member_id: wx.getStorageSync('userIdInfo').id ? wx.getStorageSync('userIdInfo').id : wx.getStorageSync('id'),
      data: datas,
      phone: self.data.tel,
      wechat: self.data.wechat
    }

    if(wx.getStorageSync('userIdInfo').id || wx.getStorageSync('id')){
      //提交数据
      common.reqUrl(app.globalData.config.reqFreeres, 'POST', param, this.getSuccess, this.getFail)
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
      wx.showModal({
        title: '结果显示',
        content: '恭喜你，您的测评指数是82。剩下的18分以3个6的形式给你，别骄傲哟，快来加入我们学习吧！！！',
      })
    } else {
      common.showError()
    }
  },
  getFail:function(err){
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