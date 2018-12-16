const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  attached:function(){
    let msg = wx.getStorageSync('userIdInfo');
    let show = '';
    if(msg && msg.coupons == 1) {
      show = true
    }else{
      show = false;
    }
    this.setData({
      show:show
    })
  },
   /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    trigCop: function (e) {
      this.triggerEvent('showTap')
    }
  }
})
