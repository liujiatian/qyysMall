// pages/OrderToDetermine/OrderToDetermine.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterpriseCode: '',
    memberId: '',//用户id
    PaymentAttr: [//支付方式
      '微信支付'
    ],
    PaymentAttrIndex: 0,//支付下标
    Profile: '请选择收货地址',//收货地址
    productList: 0,//产品清单
    AmountOfProduct: 0,//产品金额
    postage: 0,//邮费
    coupon: 0,//优惠金额
    TotalAmountDue: 0,//应付总金额
    carId:'',//产品唯一标识
    Message:'',//订单备注
    dataaddress:'',//收货地址
  },

  //计算产品金额
  TotalProductAmount: function (obj) {
    let product = this.data.product;
    let len = product.length;
    let y = 0;
    for (let i = 0; i < len; i++) {
      y += product[i].productPrice * product[i].productCount;
    }
    this.setData({
      AmountOfProduct: y
    })
  },

  //计算应付总金额
  TotalAmountDue: function (obj) {
    let y = 0;
    let AmountOfProduct = parseFloat(this.data.AmountOfProduct);
    let postage = parseFloat(this.data.postage);
    let coupon = parseFloat(this.data.coupon);
    y += AmountOfProduct + postage - coupon;
    this.setData({
      TotalAmountDue: y
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let _this = this;
    if (_this.data.isNowBuy == 2) {
      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/deleteShopcar.do',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          "carId": _this.data.carId,
          "enterpriseCode": _this.data.enterpriseCode,
        },
        method: 'POST',
        success: function (res) {
          console.log("购物车id删除成功")
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let _this = this;
    _this.setData({
      enterpriseCode:wx.getStorageSync('enterpriseCode'),
      memberId: wx.getStorageSync('uid'),
    });
    if (options.dataaddress){ 
      let res = JSON.parse(options.dataaddress);
      console.log(res);
      let Profile = '姓名:' + res.contactname + '，\t电话:' + res.contactphone + '\n地址:' + res.province + res.city + res.district + res.name;
      _this.setData({
        dataaddress: res,
        Profile: Profile,
        postage: res.postage,
        carId: res.carId,
        isNowBuy: res.isNowBuy,
      });
    }else{
      if (options.type==3){
       //拼团的参数 关系id：relationId，拼团id：groupBookingId，

      }else{
        _this.setData({
          postage: options.post,
          carId: options.carId,
          isNowBuy: options.isNowBuy,
        });
      }
      
    }
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findShopcar.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "carId": _this.data.carId,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      success: function (res) {
        let _data = res.data;
        //console.log(JSON.stringify(_data.data));
        if (_data.code == 1){
          let data = _data.data;
          let product = [];//产品
          let pid = [];
          for (let i = 0; i < data.length; i++){
            pid.push(data[i].productId.id);
            let imgSrc = data[i].productId.picture;
            imgSrc = imgSrc.split(',');
            let arr = {
              productId: data[i].productId.id,//产品id
              productImg: 'https://ssl.lucentury.cn/mall/' + imgSrc[0],//产品图片
              productName: data[i].productId.name,//产品名称
              productPrice: data[i].productPrice,//产品价格
              productCount: data[i].productNumber,//产品数量
              productSpecification: data[i].spec,//产品规格
              code: data[i].productId.code,
              picture: data[i].productId.picture,
              warehouse: data[i].productId.warehouse.name,
              warehouseId: data[i].productId.warehouse.id,
              spec: data[i].spec,
              specId: data[i].specId,
            };
            product.push(arr);
          }
          _this.setData({
            productList: data.length,
            product: product,
          });

          //计算价格
          _this.TotalProductAmount();
          _this.TotalAmountDue();
        }else{
          console.log('订单查询错误');
        }
      }
    });
  },

  //选择地址
  Profile: function (obj) {
    let _this = this;
    wx.navigateTo({
          url: '../myAddress/myAddress?orderSureId=0' + "&postage=" + _this.data.postage + "&carId=" + _this.data.carId + "&isNowBuy=" + _this.data.isNowBuy,
    })
  },


  //提交订单
  handleBtn: function (obj) {
    let Profile = this.data.Profile;
    let _this = this;
    if (Profile == '请选择收货地址') {
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
        success: function (res) {
          if (res.confirm) {
            _this.Profile();
          }
        }
      })
    } else {
      wx.showModal({
        title: '请确定您的收货地址',
        content: Profile,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定');
            let formData = '';
            formData += '&carId=' + _this.data.carId;//产品唯一标识
            formData += "&provinceCode=" + _this.data.dataaddress.provincecode;//省
            formData += "&cityCode=" + _this.data.dataaddress.citycode;//市
            formData += "&districtCode=" + _this.data.dataaddress.districtcode;//区
            formData += "&enterpriseCode=" + _this.data.enterpriseCode;
            let productStrArr = [];
            let product = _this.data.product;
            for (let i = 0; i < product.length; i++){
              let data = product[i];
              let arr = {
                'code': data.code,//产品编码
                'productId': data.productId,
                'picture': data.picture,//产品图片
                'name': data.productName,
                'warehouse': data.warehouse,//产品仓库
                'warehouseId': data.warehouseId,//产品仓库id
                'number':'',//产品型号
                'spec': data.spec,//产品规格
                'specId': data.specId,//产品规格id
                'unit': '',//产品计量单位
                'count': data.productCount,//产品数量
                'price': data.productPrice,//产品单价
                'total': data.productCount * data.productPrice,//总价
                'discounted': 0,//优惠价格
                'actually': data.productCount * data.productPrice,//实付
                'enterpriseCode': _this.data.enterpriseCode,
              }
              productStrArr.push(arr)
            }
            formData += "&productStr=" + JSON.stringify(productStrArr);
            formData += "&orderTime=" + util.formatTime(new Date().getTime());
            formData += "&orderSource=" + 1; // 1.微信商城，2.APP商城，3.分销订货，4.业务人员待下单
            formData += "&orderStatus=" + 1; // 订单状态
            formData += "&makePeople=微商城";
            formData += "&buyPeople=" + _this.data.memberId;
            formData += "&paymentMethodId.id=" + 1;
            formData += "&deliveryMethod=" + 1; // 1快递物流2自建物流
            formData += "&postage=" + _this.data.postage;//邮费
            formData += "&consignee=" + _this.data.dataaddress.contactname; // 收货人
            formData += "&consigneeMobile=" + _this.data.dataaddress.contactphone; // 收货人手机号
            formData += "&consigneeAddress=" + _this.data.dataaddress.province + _this.data.dataaddress.city +
              _this.data.dataaddress.district + _this.data.dataaddress.name;// 收货地址
            formData += "&orderMoney=" + _this.data.TotalAmountDue;// 订单金额
            formData += "&discountedMoney=" + _this.data.coupon;// 优惠金额
            formData += "&actuallyMoney=0";
            formData += "&buyerMessage=" + _this.data.Message;// 订单备注
            formData += "&consigneeAddressId=" + _this.data.dataaddress.id;//地址id
            wx.request({
              url: 'https://ssl.lucentury.cn/mall/h5/submitOrderH5.do',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: formData,
              method: 'POST',
              success: function (_orderCode) {
                //打开支付页面
                let url = '?post=' + _this.data.postage;//邮费
                url += '&uid=' + _this.data.memberId;//用户id
                url += '&price=' + _this.data.TotalAmountDue;//总金额
                url += '&carId=' + _this.data.carId;//产品唯一标识
                //url += '&isNowBuy=' + 1;
                url += '&enterpriseCode=' + _this.data.enterpriseCode;
                url += '&orderCode=' + _orderCode.data.orderCode;
                url += '&determine=' + 1;
                wx.redirectTo({
                  url: '../../pages/payForTheOrder/payForTheOrder' + url
                })
              }
            })
          }
        }
      })
    }
  },

  //订单备注
  Message:function(res){
    let val = res.detail.value;
    this.setData({
      Message:val
    });
  },

})
