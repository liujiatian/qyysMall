// pages/payForTheOrder/payForTheOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,//按钮状态
    orderReference: '',//订单编号
    modeOfPayment: '微信支付',//支付方式
    amountPayable: '',//应付金额
    openid:'',
    paySuccess:false,//支付成功
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = options;
    let _this = this;
    this.setData({
      orderReference: data.orderCode,
      amountPayable: data.price,
      memberId: wx.getStorageSync('uid'),
      enterpriseCode: wx.getStorageSync('enterpriseCode'),
      js_code: wx.getStorageSync('js_code'),
    })

    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findMemberById.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        id :_this.data.memberId
      },
      method: 'POST',
      success: function (res) {
        let code = res.data.code;
        let data = res.data.data;
        //console.log(data)
        _this.setData({
          openid: data.thirdPartyIdentity,
        })
      }
    });
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

  //立即支付
  primary: function (obj) {
    let _this = this;
    _this.setData({
      loading: true
    });
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findSalesIsPromotion.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        orderCode: _this.data.orderReference,
        enterpriseCode: _this.data.enterpriseCode,
      },
      method: 'POST',
      success: function (res) {
        if(res.data.code == -1){
          //该订单促销活动时间已过，请重新购买
          console.log('该订单促销活动时间已过，请重新购买');
        }else{
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/unifiedorder.do',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              "totalFee": _this.data.amountPayable,
              "body": "商品描述",
              "orderCode": _this.data.orderReference,
              "openid": _this.data.js_code, 
              "enterpriseCode": _this.data.enterpriseCode,
              "relationId": '',
              "groupBookingId": '',
              "client": _this.data.memberId,
              "productId": '',
              "type": 1, // 类型：1.正常，2.拼团
              "orderSource": 1,
              "pidrelationId": '',
            },
            method: 'POST',
            success: function (apires) {
              let apiData = apires.data;
              wx.requestPayment({
                timeStamp: apiData.timeStamp,
                nonceStr: apiData.nonceStr,
                package: apiData.package,
                signType: apiData.signType,
                paySign: apiData.paySign,
                success: function (requestPayment){//支付成功
                  console.log('支付成功：' + JSON.stringify(requestPayment));
                  _this.setData({
                    paySuccess:true,
                  })
                  wx.reLaunch({
                    url: '../paySuccess/paySuccess'
                  });
                },
                fail: function (fail){//支付失败
                  console.log('支付失败：' + JSON.stringify(fail));
                  wx.showToast({
                    icon:'none',
                    title:'您放弃了支付',
                  });
                  _this.setData({
                    loading: false
                  });
                },
                complete: function (complete) {//支付完成
                  console.log('支付完成：' + JSON.stringify(complete));
                }
              });
            }
          })
        }
      }
    })
  }
})