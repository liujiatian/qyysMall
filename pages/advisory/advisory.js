
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    enterpriseCode: '',
    statusnum: 0, //状态
    navactivenum: 0,
    notextcontitle:"暂无咨询信息",
    nocontentimg: "https://ssl.lucentury.cn/mall/images/noData.png",
    navlist: [
      {
        navindex: 0,
        navtext: "全部"
      },
      {
        navindex: 1,
        navtext: "商品咨询"
      },
      {
        navindex: 2,
        navtext: "配送咨询"
      },
      {
        navindex: 3,
        navtext: "售后咨询"
      }
    ],
    zixunarr:[//咨询的信息
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
  acnavfun(e) {
    const index = e.currentTarget.dataset.index;
    let notextcontitle="";
    if(index==0){
      this.select(0);
      notextcontitle ="暂无咨询信息";
    }else if(index==1){
      this.select(1);
      notextcontitle = "暂无商品咨询信息";
    }
    else if (index == 2) {
      this.select(2);
      notextcontitle = "暂无配送咨询信息";
    }
    else if (index == 3) {
      this.select(3);
      notextcontitle = "暂无售后咨询信息";
    }
    this.setData({
      notextcontitle: notextcontitle,
      navactivenum: index
    });
  },
  select(consultType) {//查询信息
    var _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/consultListH5.do', //接口地址
      data: {
        "memberId": _this.data.uid,
        "consultType": consultType
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if(res.data.code=='1'){
          _this.setData({
            zixunarr:res.data.data,
            statusnum: 0
          });
        }else{
           _this.setData({
             statusnum: 1
           });
        }
      }
    });
  }
})