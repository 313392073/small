// pages/detail/index.js
const app = getApp();
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:{
      curTitle: 0,
      curCon: 0
    },
    introlist:[],
    introSpec:[],
    introbject:[],
    introinfo:{},
    step:[],
    videoimage: "block" //默认显示封面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ids = options.ids
    console.log(ids)
    let param = {
      id: ids*1
    }
    common.reqUrl(app.globalData.config.reqCourse_info, 'POST', param, this.getSuccess, this.doFail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoCtx = wx.createVideoContext('myVideo')
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
  //点击播放按钮，封面图片隐藏,播放视频
  bindplay: function (e) {
    this.setData({
      tab_image: "none"
    }),
      this.videoCtx.play()
  },
  tohome: function(e){
    wx.switchTab({
      url:'../../pages/home/index'
    })
  },
  tabEvent:function(e){
    let dataId = e.currentTarget.id;
    let obj = {};
    obj['curTitle'] = dataId;
    obj['curCon'] = dataId;
    this.setData({
      tab:obj
    })
  },
  isdetail:function(e){
    var index = e.currentTarget.dataset.index
    var step = "step["+index+"].tag";
    var setdata = !this.data.step[index].tag
    this.setData({
      [step]: setdata
    })
  },
  formSubmit: function (e) {
    if (e.detail.value.named == '' || e.detail.value.classname == '' || e.detail.value.base == '' || e.detail.value.contact == '') {
      common.showMsg('请将信息填写完整')
      return false
    }
    //提交数据
    let param = {
      member_id: wx.getStorageSync('userIdInfo').id ? wx.getStorageSync('userIdInfo').id : wx.getStorageSync('id'),
      name: e.detail.value.named,
      course: e.detail.value.classname,
      is_basis: e.detail.value.base,
      phone: e.detail.value.contact
    }
    if(wx.getStorageSync('userIdInfo').id || wx.getStorageSync('id')){
        //提交数据
        common.reqUrl(app.globalData.config.reqCourseFree, 'POST', param, this.doSuccess, this.doFail)
    }else{
      common.showMsg('请先到个人中心完善你的个人信息');
      setTimeout(function () {
          wx.navigateTo({
            url: '../../pages/login/index'
          })
        }, 1500)
      }
  },
  doSuccess:function(e){
    if (e.statusCode == 200) {
      wx.showToast({
        title: '稍后老师将与你详谈',
        icon: 'success',
        duration: 2000
      })
    } else {
      this.doFail(e);
    }
  },
  doFail:function(err){
    common.showError();
  },
  getSuccess:function(e){
    this.setData({
      introlist: e.data.info.target_list ? e.data.info.target_list:[],
      introSpec: e.data.info.features ? e.data.info.features:[],
      introbject: e.data.info.object ? e.data.info.object:[],
      step: e.data.info.outline_list ? e.data.info.outline_list:[],
      introinfo:e.data.info
    })
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