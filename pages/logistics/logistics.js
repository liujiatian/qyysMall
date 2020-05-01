// pages/logistics/logistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    enterpriseCode: '', 
    companystr:'暂无信息',
    couriercompanycode:'暂无信息',
    couriernumber:'暂无信息',
    orderstatus:'暂无信息',
    stateStr:'暂无信息',
    notimeimg:'https://ssl.lucentury.cn/mall/images/xiaochengxv/no_product.png',
    wuliu: '',//物流数据
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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

    let companystr = decodeURI(options.companystr);
    let couriercompanycode = options.couriercompanycode;
    let couriernumber = options.couriernumber;
    let orderstatus = options.orderstatus;
    _this.loadaddress(couriercompanycode, couriernumber);
    _this.setData({
      companystr: companystr,
      couriercompanycode: couriercompanycode,
      couriernumber: couriernumber,
      orderstatus: orderstatus,
    });
  },
  onReady: function () {
  },
  //物流信息
  loadaddress(courierCompanyCode, courierNumber){
    var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/logisticsInfo.do', //接口地址
      data: {
        "courierCompanyCode": courierCompanyCode,
        "courierNumber":courierNumber
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 1) {
          var data=JSON.parse(res.data.data);
          console.log(data);
          if (data.status=='200'){
            var wuliu = data.data;
            var state = data.state;
            var stateStr = "";
            switch (state) {
              case "0":
                stateStr = "在途中";
                break;
              case "1":
                stateStr = "揽件中";
                break;
              case "2":
                stateStr = "疑难";
                break;
              case "3":
                stateStr = "已签收";
                break;
              case "4":
                stateStr = "退签";
                break;
              case "5":
                stateStr = "派件中";
                break;
              case "6":
                stateStr = "退回";
                break;
              case "10":
                stateStr = "待清关";
                break;
              case "11":
                stateStr = "清关中";
                break;
              case "12":
                stateStr = "已清关";
                break;
              case "13":
                stateStr = "清关异常";
                break;
              case "14":
                stateStr = "收件人拒签";
                break;
            }
            _this.setData({
              wuliu: wuliu,
              stateStr: stateStr,
            });
            
          }
        }
      }
    });
  }
})