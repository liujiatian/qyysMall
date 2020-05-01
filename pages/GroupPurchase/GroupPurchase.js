// pages/GroupPurchase/GroupPurchase.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quantity: 1,//数量
    pid: '',//产品id
    enterpriseCode: '',
    memberId: '',//用户id
    slideshow: [],//产品图片
    productName: '',//产品名称
    originalPrice: '',//原价
    currentPrice: '',//现价
    repertory: '',//库存
    market: '',//已销售
    Ofspecification: true,//显示规格
    DisplayNormalizedOkText: '',//规格值
    DisplayNormalizedOkId: '',//规格ID
    specificationAttr: [],//规格
    OfspecificationFrameRadio: '0',//选中规格
    Param_Brand: '',//产品品牌
    Param_model: '',//产品型号
    Param_remark: '',//产品备注
    Parameters: true,//详情参数
    productReview: '',//产品评论
    activityArr: '',//活动
    IfactivityArr: false,//是否显示活动
    dataType:true,//发起拼图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let _this = this;
    _this.setData({
      'enterpriseCode': wx.getStorageSync('enterpriseCode'),
      'memberId': wx.getStorageSync('uid'),
      'pid': options.pid,
      'activityId': options.activityId,
    });
    wx.request({
      url:'https://ssl.lucentury.cn/mall/h5/mallProductDetails.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "productId": _this.data.pid,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      success: function (res) {
        let data = res.data.data;
        //console.log(JSON.stringify(data))
        let productPicture = data.productPicture;
        productPicture = productPicture.split(',');

        //轮播图
        let pictureAttr = [];
        for (let i = 0; i < productPicture.length; i++) {
          if (productPicture[i] != '') {
            pictureAttr.push('https://ssl.lucentury.cn/mall/' + productPicture[i]);
          }
        }

        //产品名称
        let productName = data.productName;

        //产品价格
        let salePrice = data.salePrice;

        //产品原价
        let marketPrice = data.marketPrice;

        //库存
        let inventory = data.inventoryAmount;

        //已售出
        let soldAmount = data.soldAmount;

        //规格
        let specName = data.productSpecList[0].specName;
        let specId = data.productSpecList[0].specId;
        let specificationAttr = [];
        for (let j = 0; j < data.productSpecList.length; j++) {
          let productSpecList = data.productSpecList[j];
          let arr = { id: productSpecList.specId, name: productSpecList.specName, salePrice: productSpecList.salePrice }
          specificationAttr.push(arr);
        }

        //产品详情
        let article = data.productDescription;
        if (article != "") {
          let reg = new RegExp('src="/mall', "g")
          article = article.replace(reg, 'src="https://ssl.lucentury.cn/mall');
          /**
          * WxParse.wxParse(bindName , type, data, target,imagePadding)
          * 1.bindName绑定的数据名(必填)
          * 2.type可以为html或者md(必填)
          * 3.data为传入的具体数据(必填)
          * 4.target为Page对象,一般为this(必填)
          * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
          */
          //var that = this;
          WxParse.wxParse('article', 'html', article, _this, 5);
        } else {
          _this.setData({
            DetailsOfTheData: true,
          })
        }

        //产品参数
        let Param_Brand = data.productBrand;//产品品牌
        let Param_model = data.productModelNumber;//产品型号
        let Param_remark = data.productRemark;//产品备注

        //显示数据
        _this.setData({
          slideshow: pictureAttr,
          productName: productName,
          currentPrice: salePrice,
          originalPrice: marketPrice,
          repertory: inventory,
          market: soldAmount,
          DisplayNormalizedOkText: specName,
          DisplayNormalizedOkId: specId,
          specificationAttr: specificationAttr,
          Param_Brand: Param_Brand,
          Param_model: Param_model,
          Param_remark: Param_remark,
        });
      }
    });

    //产品评论
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/leaveCommentsListCount.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "id": _this.data.pid,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      success: function (res) {
        let data = res.data;
        let text = '';
        if (data.code == 1) {
          text = '共 ' + data.count + ' 条评论';
        } else {
          text = '暂无评论';
        }
        _this.setData({
          productReview: text
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

  //生成产品订单
  isEnoughBuypromotion(total, carIds) {
    let _this = this;
    let url = '';
    url += '?post=0';//运费
    url += '&uid=' + _this.data.memberId;//用户id
    url += '&price=' + total;//产品价
    url += '&carId=' + carIds;//购物车id
    url += '&isNowBuy=2';//从哪个页面进入
    url += '&pid=' + _this.data.pid;//产品id
    url += '&enterpriseCode=' + _this.data.enterpriseCode;
    wx.navigateTo({
      url: '../../pages/OrderToDetermine/OrderToDetermine' + url
    })
  },

  //加数量
  quantityTapAdd: function (obj) {
    let i = this.data.quantity;
    i++;
    if (i <= this.data.repertory) {
      this.setData({
        quantity: i
      });
    }
  },

  //减数量
  quantityTapMinus: function (obj) {
    let i = this.data.quantity;
    i--;
    if (i > 0) {
      this.setData({
        quantity: i
      });
    }
  },

  //显示规格
  specification: function (e) {
    this.setData({
      DisplayNormalized: true
    })
  },

  //隐藏规格
  DisplayNormalizedBack: function (obj) {
    this.setData({
      DisplayNormalized: false
    })
  },

  //选中规格
  OfspecificationRadio: function (obj) {
    let val = obj.detail.value;
    val = val.split(',');
    let _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findAvailableNumber.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "productId": _this.data.pid,
        "enterpriseCode": _this.data.enterpriseCode,
        "spec": val[0],
      },
      method: 'POST',
      success: function (res) {
        _this.setData({
          repertory: res.data
        })
      }
    });
    this.setData({
      DisplayNormalizedOkId: val[0],
      DisplayNormalizedOkText: val[1],
      currentPrice: val[2],
      OfspecificationFrameRadio: val[3],
      quantity: 1,
    });
  },

  //确定规格
  DisplayNormalizedOk: function (obj) {
    this.setData({
      DisplayNormalized: false
    });
  },

  //详情\参数
  Parameters: function (obj) {
    let index = obj.currentTarget.dataset.index;
    let z = '';
    let Parameters = this.data.Parameters;
    if (index == 0) {
      z = '';
      Parameters = true;
    } else if (index == 1) {
      z = 'ParametersGpsLeft';
      Parameters = false;
    }
    this.setData({
      ParametersGpsLeft: z,
      Parameters: Parameters
    });
  },

  //立即购买
  purchaseNow: function (obj) {
    let _this = this;
    if (_this.data.dataType){//发起拼图
      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/insertMallActivityClinetRelationById.do',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          "groupBookingId": _this.data.activityId,
          "cliens": _this.data.memberId,
          "isInitiator": 1,
          "isPay": 1,
          "productId": _this.data.pid,
          "enterpriseCode": _this.data.enterpriseCode,
          "specificationsName": _this.data.DisplayNormalizedOkText,
          "specificationsId": _this.data.DisplayNormalizedOkId,
          "purchareCount": _this.data.quantity,
        },
        success: function (res) {
          console.log(JSON.stringify(res))
        }
      })
    }else{//立即支付
      let repertory = _this.data.repertory;
      if (repertory > 0) {
        //购买的件数
        let quantity = _this.data.quantity;
        //现价
        let currentPrice = _this.data.currentPrice;
        //总价
        let total = quantity * currentPrice;
        //购物车id集合，提交订单界面是购物车id，所以要在这先新增一个购物车数据，在获取购物车id，赋给carId
        wx.request({
          url: 'https://ssl.lucentury.cn/mall/h5/insertShopcar.do',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            'memberId.id': _this.data.memberId,
            'productId.id': _this.data.pid,
            'productNumber': quantity,
            'spec': _this.data.DisplayNormalizedOkText,
            'specId': _this.data.DisplayNormalizedOkId,
            'enterpriseCode': _this.data.enterpriseCode,
            'orderId': '',
          },
          success: function (res) {
            let carIds = res.data;
            if (carIds.code == 1) {
              _this.isEnoughBuypromotion(total, carIds.data);
            } else {
              console.log('获取购物车id错误！');
            }
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '库存数量不足'
        })
      }
    }
  },

  //产品评论
  Reviews: function (obj) {
    wx.navigateTo({
      url: '../../pages/productReview/productReview?pid=' + this.data.pid
    })
  }
})