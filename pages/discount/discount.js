
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    enterpriseCode: '',
    statusnum:0, //状态  ，有没有优惠券
    notextcontitle:"暂无优惠券",
    navactivenum: 0, //点击的tab下标
    nocontentimg: "https://ssl.lucentury.cn/mall/images/youliu.png",//无优惠券背景图
    cadeimg: "https://ssl.lucentury.cn/mall/images/bgquan.png",//卡券的背景图
    navlist: [
      {
        navindex: 0,
        navtext: "未使用"
      },
      {
        navindex: 1,
        navtext: "已使用"
      },
      {
        navindex: 2,
        navtext: "已过期"
      },
      {
        navindex: 3,
        navtext: "未领取"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        _this.setData({
          uid: res.data
        });
      }
    });
    wx.getStorage({
      key: 'enterpriseCode',
      success: function (res) {
        _this.setData({
          enterpriseCode: res.data
        });
      }
    });
  },
  onReady: function () {
    this.select(0);
  },
  //tab切换
  acnavfun(e) {
    this.select(0);
    const index = e.currentTarget.dataset.index;
    let notextcontitle = "";
    if (index == 0) {
      notextcontitle = "暂无优惠券";
    } else if (index == 1) {
      notextcontitle = "暂无已使用的优惠券";
    }
    else if (index == 2) {
      notextcontitle = "暂无已过期的优惠券";
    }
    else if (index == 3) {
      notextcontitle = "暂无未领取的优惠券";
    }
    this.setData({
      notextcontitle: notextcontitle,
      navactivenum: index
    });
  },
  select(consultType) {//查询信息
  var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/consultListH5.do', //接口地址
      data: {
        "memberId": _this.data.uid,
        "consultType": consultType
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
      }
    });
  },
  //点击调到 优惠券使用规则
  toRegulations(){
    wx.navigateTo({
      url: '../serviceRegulations/serviceRegulations',
    })
  }
})