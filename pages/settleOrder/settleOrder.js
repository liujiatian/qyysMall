// pages/settleOrder/settleOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordernum:'0',
    orderallmoney:'0.00',
    navactivenum: 0,
    navlist: [
      {
        navindex: 0,
        navtext: "所有订单"
      },
      {
        navindex: 1,
        navtext: "未结算"
      },
      {
        navindex: 2,
        navtext: "已结算"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  acnavfun(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      navactivenum: index
    });
  }
})