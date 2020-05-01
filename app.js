App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    let _this = this;
    let enterpriseCode = 'CSGL12345665432';
    let uid = 'BwLtwISfvI7mV6UFFGIW6Q==';
    wx.setStorageSync('enterpriseCode', enterpriseCode);
    wx.setStorageSync('uid', uid);
    //页面登陆
    wx.login({
      success:function(res){
        let code = res.code;
        wx.request({
          url: 'https://ssl.lucentury.cn/mall/h5/xcxLoginCredentialsCheck.do',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            "js_code": code
          },
          method: 'POST',
          success: function (js_res) {
            wx.setStorageSync('js_code', js_res.data.openid); 
          }
        })
      }
    });
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
