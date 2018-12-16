// pages/login/index.js
const app = getApp();
const common = require('../../utils/common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    hasUserInfo: false, //是否授权
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    btnshow:false,
    loginshow:false,
    codeMsg:'获取验证码',
    disabled:false,
    phonenum:'',
    isOnTel:false,
    info:'',
    copUrl: app.globalData.config['copUrl'],
    tab:{
      curtitle:0,
      curcon:0
    },
    courselist:[],
    couponslist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success:res => {
        if(!res.authSetting['scope.userInfo']){
            this.setData({
              hasUserInfo:false
            })
        }else{
          wx.getUserInfo({
            success: res => {
              this.setData({
                hasUserInfo: true,
                userInfo:res.userInfo
              })
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.showLoading({
      title: '页面加载中',
    })

    let msg = wx.getStorageSync('userIdInfo');
    let obj = {
      member_id:msg['id']
    }
    if(msg.phone && msg.phone !='') {
      this.setData({
        isOnTel:true
      })
    }
    //获取课程列表
    common.reqUrl(app.globalData.config['reqOrder'], 'POST', obj, this.orderSuccess, this.doFail)
    //获取优惠券
    common.reqUrl(app.globalData.config['reqCardList'], 'POST', obj, this.listSuccess, this.doFail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  openCards:function(e){
     // 查看卡券
    wx.openCard({
      cardList: [{
        cardId: e.currentTarget.dataset.card,
        code: e.currentTarget.dataset.code
      }],
      success(res) {
        if (res.errMsg == 'openCard:ok'){
          common.showMsg('立即去使用吧！！');
        }else{
          common.showError()
        }
      },
      fail:function(err){
        common.showError()
      }
    })
  },
  //获取用户的基本信息
  getAuth:function(e){
    let self = this;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      self.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  getohome:function(e){
    wx.switchTab({
      url: '../../pages/home/index'
    })
  },
  //预约课程和优惠券切换
  tabEvent:function(e){
    let dataId = e.currentTarget.id;
    let obj = {}
    obj['curtitle'] = dataId;
    obj['curcon'] = dataId;
    this.setData({
      tab:obj
    })
  },
  //跳转到领取优惠券的页面
  getcoptra:function(){
    let self = this;
    if (self.data.isOnTel){
      wx.navigateTo({
        url: '../../pages/getcop/index',
      })
    }else{
     common.showMsg('请先完善您的个人信息，完善了方可领取优惠券')
    }
  },
  //获取优惠券列表成功
  listSuccess:function(e){
    this.setData({
      couponslist: e.data.info
    })
  },
  //获取优惠券列表失败
  listFail:function(err){
    common.showError()
  },  
  //到预约课程页面
  getnow:function(){
    wx.switchTab({
      url: '../../pages/actlis/index'
    })
  },
  //点击第一次小程序登录授权
  login:function(){
      let self = this;
      if(self.data.hasUserInfo) {
        self.setData({
          loginshow:'regshow'
        })
      }else{
        wx.setStorageSync('userInfo', app.globalData.userInfo)
      }
  },
  // 关闭完善信息框
  closelogin:function(){
    this.setData({
      loginshow:false
    })
  },
  //获取电话号码
  getPhone:function(e){
    this.setData({
      phonenum: e.detail.value
    })
  },
  //获取验证码
  getcode:function(e){
    console.log(e);
    var self = this;
    let phone = this.data.phonenum;
    if(phone == ''){
      common.showMsg('请输入您得电话号码');
    }
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (reg.test(phone) == false) {
      common.showMsg('请输入正确的手机号码');
      return false;
    }
    var num = 120;
    var timer = setInterval(function(){
        num--
        if(num == 0) {
          self.setData({
            disabled:false,
            codeMsg: '重新发送'
          })
          clearInterval(timer);
        }else{
          self.setData({
            disabled: true,
            codeMsg: '剩余' + num + 's'
          })
        }
    },1000)
    let msg = wx.getStorageSync('userIdInfo');
    let param = {
      member_id: msg['id'],
      phone: phone
    }
    console.log(param)
    common.reqUrl(app.globalData.config.reqgetCode, 'POST', param, this.codeSuccess, this.doFail);
  },
  codeSuccess:function(e){
    console.log(e)
    if (e.statusCode == 200){
      common.showMsg('消息已发送 ，请注意查收');
    }else{
      common.showError()
    }
  },
  formSubmit:function(e){
    if (e.detail.value.named == '' || e.detail.value.tel == '' || e.detail.value.code == '') {
      common.showMsg('请将信息填写完整');
      return false;
    }
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (reg.test(e.detail.value.tel) == false) {
      common.showMsg('请输入正确的手机号码');
      return false;
    }
    let param = {
      member_id: wx.getStorageSync('userIdInfo').id ? wx.getStorageSync('userIdInfo').id : wx.getStorageSync('id'),
      nickname: e.detail.value.named,
      verifi: e.detail.value.code,
      phone: e.detail.value.tel * 1
    }
    //提交数据
    common.reqUrl(app.globalData.config.reqReg, 'POST', param, this.regSuccess, this.doFail);
  },
  regSuccess:function(e){
    let self = this;
    var obj = wx.getStorageSync('userIdInfo');
    obj.phone = self.data.phonenum;
    if (e.statusCode == 200) {
      if (e.data.code == 1) {
        wx.setStorageSync('userIdInfo', obj)
        self.setData({
          isOnTel: true
        })
        wx.showToast({
          title: '信息完善成功',
          icon: 'success',
          duration: 1500
        });

        setTimeout(function () {
          var tag = self.data.loginshow;
          self.setData({
            btnshow: false,
            loginshow: !tag
          })
        }, 1000);
      }else{
         common.showMsg(e.data.msg) 
          setTimeout(function () {
            var tag = self.data.loginshow;
            self.setData({
              btnshow: false,
              loginshow: !tag
            })
          }, 1000);
      }
    }else{
      common.showError();
    }
  },
  doFail:function(err){
    common.showError();
  },
  orderSuccess:function(e){
    wx.hideLoading();
    this.setData({
      courselist: e.data.info
    });
  },
  godetail:function(e){
    wx.navigateTo({
      url: '../../pages/detail/index?ids=' + e.currentTarget.dataset.ids,
    });
  },
  already:function(e){
    wx.showModal({
      title: '温馨提示',
      content: '您好~您已授权~快去领取优惠券吧！',
      success(res) {
        
      }
    })
  }
})