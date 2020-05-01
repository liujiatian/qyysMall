// pages/index-myOrder/index-myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    enterpriseCode: '',
    navactivenum:0,
    nocontentimg: "https://ssl.lucentury.cn/mall/images/warn.png",
    shownodate:'false',
    statusindex:0,
    navlist: [
      {
        navindex:0,     
        navtext: "全部"
      },
      {
        navindex:1,
        navtext: "待付款"
      },
      {
        navindex:2,
        navtext: "待发货"
      },
      {
        navindex: 3,
        navtext: "待收货"
      },
      {
        navindex: 4,
        navtext: "待评价"
      }
    ],
    //全部
    allorder: []
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
    let statusindex=0;
    if(!isNaN(options.index)){
      if (options.index==0){
        statusindex=1;
      } else if (options.index == 1){
        statusindex = 3;
      } else if (options.index == 2) {
        statusindex = 5;
      } else if (options.index == 3) {
        statusindex = 6;
      }
       let index = parseInt(options.index);
       _this.setData({
         navactivenum: index + 1,
         statusindex: statusindex,
       });
    }
   
  },
  onReady: function () {
    var _this=this;
    let statusindex = _this.data.statusindex;
    _this.select(statusindex);
  },
  acnavfun (e){//点击切换不同的订单状态
  var _this=this;
    const index = e.currentTarget.dataset.index;
    let shownodate = this.data.shownodate;
    if (index==0){
     _this.select(0);
    }else if (index==1){
      _this.select(1);
    }else if (index ==2) {
      _this.select(3);
    }else if (index == 3) {
      _this.select(5);
    }else if (index == 4) {
      _this.select(6);
    }
    this.setData({
      navactivenum: index,
      shownodate: shownodate
     });
  },
  orderDetails (e){//订单详情
  var _this=this;
    const orderStatus = e.currentTarget.dataset.orderstatus;
    const saleId = e.currentTarget.dataset.saleid;
    const proid = e.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?orderStatus=' + orderStatus + "&saleId=" + saleId + "&proid=" + proid
    })
  },
  chanwuliu (e){//点击查看物流
    let companystr, couriercompanycode, couriernumber, orderstatus;
     companystr = e.currentTarget.dataset.companystr;
     couriercompanycode = e.currentTarget.dataset.couriercompanycode;
     couriernumber = e.currentTarget.dataset.couriernumber;
     orderstatus = e.currentTarget.dataset.orderstatus;
    wx.navigateTo({
      url: '../logistics/logistics?companystr=' + companystr + '&couriercompanycode=' + couriercompanycode + '&couriernumber=' + couriernumber + '&orderstatus=' + orderstatus,
    })
  },
  topingjia (e){//点击评价
    let id = e.currentTarget.dataset.id;
    let saleId = e.currentTarget.dataset.saleid;
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../evaluateOrder/evaluateOrder?id=' + id + "&saleId=" + saleId+"&code="+code
    })
  },
  select(orderStatus) {//查询数据
  var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findOrderByStatus.do', //接口地址
      data: {
        "orderStatus": orderStatus,
        "encryptBuyPeople": _this.data.uid,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      header: { 
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var result = "";
        /*订单状态（1.待付款，2待发货 --> 未审核，3.待发货 --> 审核后4.待发货 --> 已出库5.已发货6.已完成7.已关闭*/
        var data = res.data.data;
        if (data != null) {
          //根据后台运费模板默认计算运费
          var money = 0;
            wx.request({
              url: 'https://ssl.lucentury.cn/mall/h5/findFreight.do', //接口地址
              data: {
                "isDefault": 1,
                "enterpriseCode": _this.data.enterpriseCode
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                let code = res.data.code;
                let data = res.data.data;
                if (code == 1) {
                  var type = data.freightName;
                  switch (type) {
                    case "统一计价":
                      money = data.unifiedPrice;
                      break;
                    case "全场包邮":
                      break;
                    case "按重量计算"://暂未计算
                      break;
                    case "按件数计算"://暂未计算
                      break;
                  }
                }
              }
            });
            //循环添加计算的变量，改变数量
            for(let i=0;i<data.length;i++){
              let ppid='';
              let pcount = '';
              for (let j = 0; j < data[i].productListVo.length;j++){
                ppid += data[i].productListVo[j].productId+',';
                pcount += data[i].productListVo[j].productCount + ',';
              }
              data[i].ppid = ppid;
              data[i].pcount = pcount;
            }
          _this.setData({
            allorder: data,
            shownodate: false,
          });
         
        }else{
          _this.setData({
            allorder:[],
            shownodate: true
          });
        }
      }
    });
  },
  //付款
  topaymoney(e){
    let orderCode = e.currentTarget.dataset.code;
    let price = e.currentTarget.dataset.price;
    wx.navigateTo({
      url: '../payForTheOrder/payForTheOrder?orderCode=' + orderCode + "&price=" + price
    });
  },
  //取消订单
  closeMoney(e){
    var _this=this;
    let ordercode, pcount, ppid, salesid,index;
    ordercode = e.currentTarget.dataset.ordercode;
    pcount = e.currentTarget.dataset.pcount;
    ppid = e.currentTarget.dataset.ppid;
    salesid = e.currentTarget.dataset.salesid;
    index = e.currentTarget.dataset.index;
    //删除分销订单
    _this.deleteDistributionOrder(ordercode);
    wx.showModal({
      title:'提示',
      content:'是否取消该订单？',
      success: function (res) {
        if (res.confirm){
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/checkOrderSales.do', //接口地址
            data: {
              "ids": salesid + ",",
              "orderStatus": 7,
              "enterpriseCode": _this.data.enterpriseCode,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.code==1){
                 //修改库存和销量
                //flag=1是提交订单，flag=0是取消订单
                var flag = 0;
                _this.changeCount(ppid, pcount, flag,index);             
              }
            }
          });
        }
      }
    });
  },
  //修改产品数量和产品销售数量
  changeCount(ppid, pcount, flag, index) {
     var _this=this;
     var s = ppid.split(",");
     var ss = pcount.split(",");
      for(var i = 0; i<s.length- 1; i++) {
        var a = s[i];
        var b = ss[i];
        wx.request({
          url: 'https://ssl.lucentury.cn/mall/h5/updateNumber.do', //接口地址
          data: {
            "id": a,
            "count": b,
            "flag": flag,
            "enterpriseCode": _this.data.enterpriseCode
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            let data = _this.data.allorder;
            data.splice(index, 1);
            _this.setData({
              allorder: data
            });
            wx.showToast({
              title: '取消订单成功'
            });
        }
    });
  }
},
//删除分销订单
  deleteDistributionOrder(ordercode) {
    var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/selectDistributionOrder.do', //接口地址
      data: {
        "orderCode": ordercode,
        "enterpriseCode": _this.data.enterpriseCode
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        let code = res.data.code;
        let data=res.data.data;
        if (code == 1) {
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/deleteDistributionOrder.do', //接口地址
            data: {
              "disOrderId": data[0].disOrderId
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              //删除分销订单
            }
          });
        }
      }
    });
  },
 //确认收货
  receipt(saleId) {
    var _this=this;
    wx.showModal({
      title: '提示',
      content: '是否确认收到该商品？',
      success: function (res) {
        wx.request({
          url: 'https://ssl.lucentury.cn/mall/h5/checkOrderSales.do', //接口地址
          data: {
            "ids": saleId + ",",
            "orderStatus": 6,
            "enterpriseCode": _this.data.enterpriseCode,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {

          }
        });
      }
    });
  },
  //图片路径错误替换图片
  errorFunction: function (obj) {
    if (obj.type == 'error') {
      let fatherindex = obj.target.dataset.fatherindex; //获取错误图片一级循环的下标
      let index = obj.target.dataset.index;//获取错误图片二级循环的下标
      let allorder = this.data.allorder; 　　　　　　　//将图片列表数据绑定到变量
      allorder[fatherindex].productListVo[index].productPicture = 'images/xiaochengxv/no_product.png'; //错误图片替换为默认图片
      this.setData({
        allorder: allorder
      })
    }
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
              "enterpriseCode": _this.data.enterpriseCode,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.code == 1) {                          
                _this.setData({
                  navactivenum: 4
                });
                _this.select(6);
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
})