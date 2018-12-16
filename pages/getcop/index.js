// pages/getcop/index.js
const app = getApp();
const common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coplist:[],
    copUrl: app.globalData.config['copUrl']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = {
      member_id: wx.getStorageSync('id')
     }
    //添加卡券成功的回调
    common.reqUrl(app.globalData.config['reqGetcop'], 'POST', obj, this.reqSuccess, this.getFail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getohome: function (e) {
    wx.switchTab({
      url: '../../pages/home/index'
    })
  },
  reqSuccess:function(e){
    this.setData({
      coplist:e.data.info
    })
  },
  //这个要换成查看的
  showTip:function(){
    wx.showToast({
      title: '你已经领取该优惠券了，赶紧去使用吧',
      icon:'none',
      duration:2000
    })
  },
  //领取优惠券
  getcop:function(e){
    let self = this;
    if(wx.addCard) {
      let datas = e.currentTarget.dataset.datas
      wx.addCard({
        cardList: [
          {
            cardId:datas.card_id,
            cardExt: '{"code":"","openid":"","timestamp":' + datas.timestamp + ',"nonce_str":"' + datas.nonce_str + '","signature":"' + datas.signature + '"}'
          }
        ],
        success(res) {
          if (res[0].isSuccess) {
            self.sendCard(res.cardList[0]['code'], res.cardList[0]['cardId'])
          }else{
            self.getFail(res)
          }
        },
        
        fail:function(err){
          if (err.errMsg == 'addCard:fail cancel'){
            wx.showToast({
              title: '你已经取消领取优惠券',
              icon: 'none',
            })
          }else{
            this.getFail(err)
          }
        }
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试！'
      })
    }
  },
    //添加卡券后的回调
  sendCard: function (code, card_id){
    let obj = {
      code: code,
      card_id: card_id,
      member_id: wx.getStorageSync('id') ? wx.getStorageSync('id') : wx.getStorageSync('userIdInfo').id
    }
    common.reqUrl(app.globalData.config['reqCardBack'], 'POST', obj, this.getSuccess, this.getFail)
  },
  getSuccess:function(e){
    wx.showToast({
      title: '领取优惠券成功，快去使用吧！',
      icon: 'success',
      duration: 2000
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '../../pages/getcop/index',
      })
    },2100)
  },
  getFail:function(err){
    common.showError()
  }
})