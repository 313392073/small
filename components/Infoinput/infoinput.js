// components/Infoinput/infoinput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // input_title:'免费申请试听'
    inputitle:{
      type: String,
      value:'免费申请试听'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    focus:true,
    datas:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit:function(e){
      // 获取表单的数据
      console.log(e)
      this.setData({
        datas: e.detail.value
      })
      
    }
  },
  submit:function(){
    var self = this
    this.triggerEvent('myEvent', self.data.data)
  },
  usernameevent:function(e){
    console.log(e.detail)
  }
})
