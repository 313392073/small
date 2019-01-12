const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  attached:function(){
    this.updateCopState()
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
    },
    updateCopState: function(){
      let self = this;
      setTimeout(function(){
        let msg = wx.getStorageSync('couStatus');
        let show = '';
        if (msg) {
          show = true
        } else {
          show = false;
        }
        self.setData({
          show: show
        })
      },500)
    }
  },
})
