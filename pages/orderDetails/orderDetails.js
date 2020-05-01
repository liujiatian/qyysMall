// pages/orderDetails/orderDetails.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    enterpriseCode:'',
    saleId:'',  //订单id
    proid:'',//评价订单的id
    orderStatus:'',//订单状态
    day: '',          //订单配置的过期天数
    datecotent: {},   //订单数据
    bgtitle:'',                                                            //订单状态描述
    bgtime: '',    //订单状态剩余时间或说明1,5
    bg_text: '',      //订单状态剩余时间或说明   2,3,4,8,6                                                  
    wuliuimg: 'https://ssl.lucentury.cn/mall/images/wuliusd.png',     //物流图片       
    location_icon:'https://ssl.lucentury.cn/mall/images/dinweas.png', //收货地址图标
    waitMoney:'',                                                          //实际付款
    orderTime:'',                                                          //下单时间
    okTime:'',                                                            //完成时间
    discountsArr:[],                                                          //其它运费模板
    logisticsInfo_text:'',//物流标题
    logisticsInfo_ftime:'',//物流时间
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

  //改变标题和背景图,保存状态和订单id
    let orderStatus = options.orderStatus;
    let bgtitle, statusimg, bg_text;
    if (orderStatus==1){
        bgtitle = '等待买家付款';
       statusimg ='https://ssl.lucentury.cn/mall/images/daifukusnas.png';
    } else if (orderStatus == 2 || orderStatus == 3 || orderStatus == 4 || orderStatus == 8){
      bgtitle = '买家已付款';
      bg_text ='等待卖家发货';
      statusimg = 'https://ssl.lucentury.cn/mall/images/yifukuan.png';
    } else if (orderStatus == 5) {
      bgtitle = '卖家已发货';
    statusimg = 'https://ssl.lucentury.cn/mall/images/daishouhuo.png';
    } else if (orderStatus ==6) {
      bgtitle = '交易成功';
      bg_text = '期待您的评价';
      statusimg = 'https://ssl.lucentury.cn/mall/images/evaluated.png';
    }
    _this.setData({
      orderStatus: options.orderStatus,
      saleId: options.saleId,
      proid: options.proid,
      statusimg: statusimg,
      bgtitle: bgtitle,
      bg_text: bg_text,
    });
  },
  onReady: function () {
    var _this=this;
    _this.load_time();
    _this.orderdetiles();
  },
  //查询过期天数
  load_time(){
    let _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/selectByType.do', //接口地址
      data: {
        "type": 2,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 1) {
          _this.setData({
            day: res.data.data.day
          });
        }
      }
    });
  },
 //订单详情
 orderdetiles(){
   var _this=this;
   //订单详情
   wx.request({
     url: 'https://ssl.lucentury.cn/mall/h5/findOrderSales.do', //接口地址
     data: {
       "saleId": _this.data.saleId,
     },
     method: 'POST',
     header: {
       "Content-Type": "application/x-www-form-urlencoded"
     },
     success: function (res) {
       if(res.data.code==1){
         let data = res.data.data;
         //创建订单的时间
         let createTime = data.orderTime;
         //当前日期
         let myData = new Date();
         var currTime = myData.getTime();//当前时间的毫秒数1510920677260
         let day = _this.data.day;
         let days = '';//剩余天数

         let oldsecond = Number(day) * 24 * 60 * 60 * 1000 - (currTime - createTime), minute = 0, hour = 0;
         minute = parseInt((Number(day) * 24 * 60 * 60 * 1000 - (currTime - createTime)) / 1000 / 60); //算出一共有多少分钟
         if (minute > 60) { //如果分钟大于60，计算出小时和分钟
           hour = parseInt(minute / 60);
           minute %= 60;//算出有多分钟
         }
         if (hour > 24) {//如果小时大于24，计算出天和小时
           days = parseInt(hour / 24);
           hour %= 24;//算出有多分钟
         }
         let bgtime = "剩" + days + "天" + hour + "小时自动关闭";
         //物流信息
          var code = data.logisticsCode;
          var number1 = data.logisticsNumber;
         if (code != null && number1!=null) {
           _this.loadLogisticsInfo(code, number1);
         }
         let waitMoney = 0;
         waitMoney = data.orderMoney - data.discountedMoney + data.postage;//待付款金额
         let orderTime = util.formatTime(data.orderTime);
         //订单产品图片
         for (let i = 0; i < data.productList.length;i++){
           let minpicture="";
           var pic = data.productList[i].picture
           if (pic) {
             minpicture = pic.split(',')[0];
           }else{
             minpicture = 'images/xiaochengxv/no_product.png'; //错误图片替换为默认图片
           }
           data.productList[i].minpicture = minpicture; 
         }
         //改变时间，转换为标准格式
         data.orderTime = util.formatTime(data.orderTime);
         data.payTime = util.formatTime(data.payTime);
         data.shipTime = util.formatTime(data.shipTime);
         data.okTime = util.formatTime(data.okTime);
         _this.setData({
           datecotent:data,
           bgtime: bgtime,
           waitMoney: waitMoney,
           orderTime: orderTime,
         });
         _this.findSalesDiscountDetails(_this.data.saleId);
       }
     }
   });
 },
  //物流页面
  tologistics (e){
    let companystr, couriercompanycode, couriernumber, orderstatus;
    companystr = e.currentTarget.dataset.logisticscompany;
    couriercompanycode = e.currentTarget.dataset.logisticscode;
    couriernumber = e.currentTarget.dataset.logisticsnumber;
    orderstatus = e.currentTarget.dataset.orderstatus;
    wx.navigateTo({
      url: '../logistics/logistics?companystr=' + companystr + '&couriercompanycode=' + couriercompanycode + '&couriernumber=' + couriernumber + '&orderstatus=' + orderstatus,
    })
  },
  //取消订单
  closeMoney(e) {
    var _this=this;
    wx.showModal({
      title: '提示',
      content: '是否取消该订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/checkOrderSales.do', //接口地址
            data: {
              "ids": _this.data.saleId + ",",
              "orderStatus": 7,
              "enterpriseCode": _this.data.enterpriseCode,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '取消订单成功！'
                });
              }else{
                wx.showToast({
                  title: '取消该订单失败！'
                });
              }
            }
          });
        }
      }
    });
  },
  //其它运费
  findSalesDiscountDetails(orderId) {
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findSalesDiscountDetails.do', //接口地址
      data: {
        "orderId": orderId,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 1) {
          var data =res.data.data;
          if (data.length>0){
            _this.setData({
              discountsArr: data
            });
          }
          
        }
      }
    });
  },
  //付款
  topaymoney(e) {
    let orderCode = e.currentTarget.dataset.ordercode;
    let price = e.currentTarget.dataset.price;
    wx.redirectTo({
      url: '../payForTheOrder/payForTheOrder?orderCode=' + orderCode + "&price=" + price
    });
  },
  //图片路径错误替换图片
  errorFunction: function (obj) {
    if (obj.type == 'error') {
      let index = obj.target.dataset.index; //获取错误图片循环的下标
      let datecotent = this.data.datecotent; 　　　　　　　//将图片列表数据绑定到变量
      datecotent.productList[index].minpicture = 'images/xiaochengxv/no_product.png'; //错误图片替换为默认图片
      this.setData({
        datecotent: datecotent
      })
    }
  },
  //加载物流信息
  loadLogisticsInfo(code,number1) {
  var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/logisticsInfo.do', //接口地址
      data: {
        "courierCompanyCode": code,
        "courierNumber": number1 
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 1) {
          var data=JSON.parse(res.data.data);

          var logisticsInfo = data.data;
          let logisticsInfo_text, logisticsInfo_ftime;
          if(data.status == 0){
            logisticsInfo_text = "暂无物流信息";
            logisticsInfo_ftime = "";
          }else{    
            if(logisticsInfo.length!=0){
                logisticsInfo_text = logisticsInfo[0].context;
                logisticsInfo_ftime = logisticsInfo[0].ftime;
              }else{
                logisticsInfo_text = "暂无物流信息";
                logisticsInfo_ftime = "";
              }
          }
          _this.setData({
            logisticsInfo_text: logisticsInfo_text,
            logisticsInfo_ftime: logisticsInfo_ftime,
          });
        }
      }
    });
  },
  //确认订单
  receipt(e) {
    var _this = this;
    var saleId = e.currentTarget.dataset.saleid;
    wx.showModal({
      title: '提示',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/checkOrderSales.do', //接口地址
            data: {
              "ids": saleId + ",",
              "orderStatus": 6,
              "enterpriseCode":_this.data.enterpriseCode,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.code == 1) {
                wx.redirectTo({
                  url: '../myOrder/myOrder?index=' + 3
                })
                wx.showToast({
                  title: '确认收货成功！'
                });
              }
            }
          })
        }
      }
    })
  },
  topingjia(e) {//点击评价
    let id = e.currentTarget.dataset.id;
    let saleId = e.currentTarget.dataset.saleid;
    let code = e.currentTarget.dataset.code;
    wx.redirectTo({
      url: '../evaluateOrder/evaluateOrder?id=' + id + "&saleId=" + saleId + "&code=" + code
    })
  },
  chanwuliu(e) {//点击查看物流
    let companystr, couriercompanycode, couriernumber, orderstatus;
    companystr = e.currentTarget.dataset.companystr;
    couriercompanycode = e.currentTarget.dataset.couriercompanycode;
    couriernumber = e.currentTarget.dataset.couriernumber;
    orderstatus = e.currentTarget.dataset.orderstatus;
    wx.navigateTo({
      url: '../logistics/logistics?companystr=' + companystr + '&couriercompanycode=' + couriercompanycode + '&couriernumber=' + couriernumber + '&orderstatus=' + orderstatus,
    })
  },
})