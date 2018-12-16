// pages/home/index.js
var app = getApp();
const common = require('../../utils/common.js');
const cstr = '市面上大数据培训鱼龙混杂，有Java、PHP、数据库大数据等，但真正大数据是hadoop、spark、storm、超大集群调优、机器学习、Docker容器引擎、ElasticSearch、并发编程等，别人不能讲的我们讲，别人能讲的我们讲得很深入。';
const cstr3 = '数据表明，近几年间大数据人才缺口就已高达百万，目前企业高薪都难以找到足够的大数据开发人才，大数据从业者的增长量，远远满足不了市场需求的扩张，大数据人才需求将出现“井喷”现象';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    indicatorDotsd:false,
    pindicatorDots:false,
    autoplay:true,
    pautoplay:true,
    interval:5000,
    duration:1000,
    imgurl:[],
    cstr:cstr,
    cstr3:cstr3,
    planlist: [],
    plancur:0,
    actlist: [],
    msg:{},
    showCop:false, //控制领取优惠券的跳转(授权和未授权)
    copHomebg1: app.globalData.config['copHomebg1'],
    copHomebg2: app.globalData.config['copHomebg2']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    common.reqUrl(app.globalData.config.reqhomedata, 'POST', {}, that.getSuccess, that.getFail);
    //判断授权  已经授权就发起登陆 如果没授权 不登录
    app.isLogin().then(function(res){
      let nickName = app.globalData.userInfo.nickName;
      let avatarUrl = app.globalData.userInfo.avatarUrl;
      let loginInfo = common.getLogin(app.globalData.config['reqlogin'],nickName, avatarUrl);
      loginInfo.then(res => {
        that.setData({
          showCop:true,
          id:res.id
        })
      })
    },function(err){
      console.log(err)
    })
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
  // 首页数据获取成功
  getSuccess:function(e){
    let arr = [];
    let brr = []
    arr = e.data.info.profession;
    if(arr.length>0){
      for (var i = 0; i < arr.length; i++) {
        let obj = {
          title: '',
          text1: '',
          text2: '',
          text3: '',
        }
        if (i == 0) {
          obj.text1 = arr[arr.length - 1]['content'];
        } else {
          obj.text1 = arr[i - 1]['content'];
        }

        if (i == arr.length - 1) {
          obj.text3 = arr[0]['content'];
        } else {
          obj.text3 = arr[i + 1]['content'];
        }
        obj.title = arr[i]['title'];
        obj.text2 = arr[i]['content'];
        brr.push(obj)
      }
    }
  
    if (e.statusCode == 200) {
        this.setData({
          imgurl: e.data.info.banner_list,
          planlist: brr,
          actlist: e.data.info.course_list
        })
    }else{
      common.showError()
    }
  },
  getFail:function(err){
    common.showError()
  },
  // 去个人中心
  gotomy:function(e){
    wx.navigateTo({
      url: '../../pages/login/index'
    })
  },
  swiperChange:function(e){
    this.setData({
      plancur:e.detail.current
    })
  },
  tapprev:function(e){
    var self = this;
    this.setData({
      pautoplay:false
    })
    var cur = self.data.plancur
    if (cur >= this.data.planlist.length - 1) {
      cur = -1
    }
    this.setData({
      plancur: ++cur,
      pautoplay: true
    })   
  },
  tapnext:function(e){
    var self = this;
    this.setData({
      pautoplay: false
    })
    var cur = self.data.plancur
    if (cur < 1) {
      cur = self.data.planlist.length
    }
    this.setData({
      plancur: --cur,
      pautoplay: true
    })
  },
  formSubmit:function(e){
    if (e.detail.value.named == '' || e.detail.value.classname == '' || e.detail.value.tel == '' || e.detail.value.wechat == '') {
      common.showMsg('请将信息填写完整')
      return false
    }
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (reg.test(e.detail.value.tel) == false) {
      common.showMsg('请输入正确的手机号码')
      return false
    }
    let param = {
      member_id: this.data.id ? this.data.id : wx.getStorageSync('id'),
      name:e.detail.value.named,
      course:e.detail.value.classname,
      phone:e.detail.value.tel*1,
      wechat: e.detail.value.wechat
    }
    if(this.data.id || wx.getStorageSync('id')){
      common.reqUrl(app.globalData.config.reqhomesubmit,'POST',param,this.subSuccess,this.subFail)
    }else{
      //提交数据
      common.showMsg('请先到个人中心完善你的个人信息');
      setTimeout(function () {
        wx.navigateTo({
          url: '../../pages/login/index'
        })
      }, 1500)
    }
  },
  subSuccess:function(e){
    let self = this;
    if (e.statusCode == 200) {
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(function () {
          self.setData({
            info: ''
          }, 3000)
        })
    }else{
      common.showError()
    }
  },
  subFail:function(e){
    common.showError()
  },
  showVip: function (e) {
    var msg = wx.getStorageSync('userIdInfo');
    if(msg && msg.phone){
      wx.navigateTo({
        url: '../../pages/getcop/index',
      })
    }else{
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
  },
  gocouese:function(e){
    wx.navigateTo({
      url: '../../pages/detail/index?ids=' + e.currentTarget.dataset.courseid,
    });
  }
})