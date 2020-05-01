// pages/index-Cart/index-Cart.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterpriseCode: '',
    memberId: '',//用户id
    shoppingAttr: [],//产品
    shoppingRedact: false,//是否编辑
    shoppingRedactText: '编辑',
    shoppingRedactGps: '北京市 北京市 昌平区 西三旗 西三旗桥东 新龙大厦 B1121号',
    shoppingAttrTotal: 0.00,//购物车列表总价
    shoppingAttrSelected: 0,//购物车列表已选数
    shoppingBe: false,//是否有商品
    shoppingAttrAll: false,//购物车列表全选
    shoppingRedactAll: false,//编辑列表全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      enterpriseCode: wx.getStorageSync('enterpriseCode'),
      memberId: wx.getStorageSync('uid'),
    });
    this.shopping();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.shopping();
  },

  //加载购物车
  shopping(){
    let _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/mallShopCarList.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "memberId": _this.data.memberId,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      success: function (res) {
        let _data = res.data;
        if (_data.code == 1) {
          let data = _data.data;
          let shoppingAttr = [];
          for (let i = 0; i < data.length; i++) {
            let arr = {
              carId: data[i].carId,
              memberId: data[i].memberId,
              goodsId: data[i].productId,
              goodsUrl: '#',
              goodsImg: 'https://ssl.lucentury.cn/mall/' + data[i].productPicture,
              goodsName: data[i].productName,
              goodsPrice: data[i].productPrice,
              goodsNum: data[i].productNumber,
              goodsClose: false,
              goodsRemove: false,
              productSpecId: data[i].productSpecId,
              productSpecName: data[i].productSpecName,
              productWeight: data[i].productWeight,
            }
            shoppingAttr.push(arr);
          }
          _this.setData({
            shoppingBe: false,
            shoppingAttr: shoppingAttr
          })
          _this.Activity();
        } else {
          console.log('查询无商品');
          _this.setData({
            shoppingBe:true,
          })
        }
      }
    });
  },

  //查询商品活动
  Activity(){
    let _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findBuyPromotionList.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      success: function (res) {
        let code = res.data.code;
        let data = res.data.data;
        if (code == 1){
          //console.log(JSON.stringify(data))
          let shoppingAttr = _this.data.shoppingAttr;
          for (let j = 0; j < shoppingAttr.length; j++){//循环产品
            let productId = shoppingAttr[j].goodsId;
            for(let i = 0; i<data.length; i++){//循环活动
              let mydate = new Date();
              if (data[i].onlineTerminal == 2) {
                // 促销类型 1.满额送2.满件送
                let buyPromotionType = data[i].activityType;
                if (buyPromotionType == 1) {//满额送
                  // 活动时间范围
                  if (mydate.getTime() > data[i].activityStartDate && mydate.getTime() < data[i].activityEndDate) {
                    // 商品范围 //1.全部2.部分
                    let productRange = data[i].productRange;
                    if (productRange == 1) {//全部
                      let arrs = {
                        'if': true,
                        'text':'manzeng',
                        'money': data[i].costPrice,
                        'type': data[i].activityType,
                        'giftcount': data[i].giftNumber,
                        'giftnumber': data[i].productGift,
                        'span':'满赠',
                        'dataText': "满额送：满" + data[i].costPrice + "元，送赠品各" + data[i].giftNumber +"件",
                      };
                      shoppingAttr[j].Activity = arrs;
                    } else if (productRange == 2) {//部分
                      let activityProduct = data[i].activityProduct.split(",");//部分产品的集合
                      for (let z = 0; z < activityProduct.length - 1; z++) {//循环
                        if (productId == activityProduct[z]) {
                          let arrs = {
                            'if': true,
                            'text': 'manzeng',
                            'money': data[i].costPrice,
                            'type': data[i].activityType,
                            'giftcount': data[i].giftNumber,
                            'giftnumber': data[i].productGift,
                            'span': '满赠',
                            'dataText': "满额送：满" + data[i].costPrice + "元，送赠品各" + data[i].giftNumber + "件",
                          };
                          shoppingAttr[j].Activity = arrs;
                        }
                      }
                    }
                  } else {
                    console.log("不在活动时间范围");
                  }
                } else if (buyPromotionType == 2) {//满件送
                  // 活动时间范围
                  if (mydate.getTime() > data[i].activityStartDate && mydate.getTime() < data[i].activityEndDate) {
                    // 商品范围 //1.全部2.部分
                    let productRange = data[i].productRange;
                    if (productRange == 1) {//全部
                      let arrs = {
                        'if': true,
                        'text': 'manzeng',
                        'money': data[i].costPrice,
                        'type': data[i].activityType,
                        'giftcount': data[i].giftNumber,
                        'giftnumber': data[i].productGift,
                        'span': '满赠',
                        'dataText': "满额送：满" + data[i].costPrice + "元，送赠品各" + data[i].giftNumber + "件",
                      };
                      shoppingAttr[j].Activity = arrs;
                    } else if (productRange == 2) {//部分
                      let activityProduct = data[i].activityProduct.split(",");	// 部分产品的集合
                      for (let z = 0; z < activityProduct.length - 1; z++) {	// 循环
                        if (productId == activityProduct[j]) {
                          let arrs = {
                            'if':true,
                            'text': 'manzeng',
                            'money': data[i].costPrice,
                            'type': data[i].activityType,
                            'giftcount': data[i].giftNumber,
                            'giftnumber': data[i].productGift,
                            'span': '满赠',
                            'dataText': "满额送：满" + data[i].costPrice + "元，送赠品各" + data[i].giftNumber + "件",
                          };
                          shoppingAttr[j].Activity = arrs;
                        }
                      }
                    }
                  } else {
                    console.log("不在活动时间范围");
                  }
                }
              } else if (data[i].onlineTerminal == 1) {
                console.log("app活动");
              }
            }
          }
          _this.setData({
            shoppingAttr: shoppingAttr,
          });
        }
      }
    })
  },

  //计算合计
  aggregation() {
    let goodsAttrLength = this.data.shoppingAttr.length;
    let goodsAttr = this.data.shoppingAttr;
    let totalPrices = 0;
    for (let i = 0; i < goodsAttrLength; i++) {
      if (goodsAttr[i].goodsClose) {
        let goodsPrice = goodsAttr[i].goodsPrice;//价格
        let goodsNum = goodsAttr[i].goodsNum;//数量
        totalPrices = totalPrices + (goodsPrice * goodsNum);
      }
    };
    totalPrices = parseFloat(totalPrices).toFixed(2);
    this.setData({
      shoppingAttrTotal: totalPrices
    });
  },

  //计算结算件数
  operationBtnText() {
    let goodsAttrLength = this.data.shoppingAttr.length;
    let goodsAttr = this.data.shoppingAttr;
    let operationBtnText = 0;
    for (let i = 0; i < goodsAttrLength; i++) {
      if (goodsAttr[i].goodsClose == true) {
        let goodsNum = goodsAttr[i].goodsNum;//数量
        operationBtnText = operationBtnText + goodsNum;
      }
    };
    this.setData({
      shoppingAttrSelected: operationBtnText
    });
  },

  //全选
  checkAllReturn(obj1, obj2) {
    let Attr = this.data.shoppingAttr;
    let shoppingAttrAll = this.data.shoppingAttrAll;
    let shoppingRedactAll = this.data.shoppingRedactAll;
    if (obj1 == 1) {
      for (let i = 0; i < Attr.length; i++) {
        Attr[i].goodsRemove = obj2;
      }
      shoppingRedactAll = obj2;
    } else if (obj1 == 2) {
      for (let i = 0; i < Attr.length; i++) {
        Attr[i].goodsClose = obj2
      }
      shoppingAttrAll = obj2;
    }
    this.setData({
      shoppingAttr: Attr,
      shoppingAttrAll: shoppingAttrAll,
      shoppingRedactAll: shoppingRedactAll,
    })
    this.aggregation();
    this.operationBtnText();
  },

  //监听全选
  checkAllMonitor() {
    let Attr = this.data.shoppingAttr;
    let shoppingRedact = this.data.shoppingRedact;
    let shoppingAttrAll = this.data.shoppingAttrAll;
    let shoppingRedactAll = this.data.shoppingRedactAll;
    let shoppingBe = this.data.shoppingBe;
    let shoppingRedactText = this.data.shoppingRedactText;
    if (Attr.length <= 0) {
      shoppingAttrAll = false;
      shoppingRedactAll = false;
      shoppingBe = true;
      shoppingRedact = false;
      shoppingRedactText = '编辑';
    } else {
      if (!shoppingRedact) {
        shoppingAttrAll = true;
        for (let i = 0; i < Attr.length; i++) {
          if (!Attr[i].goodsClose) {
            shoppingAttrAll = false;
          }
        }
      } else {
        shoppingRedactAll = true;
        for (let i = 0; i < Attr.length; i++) {
          if (!Attr[i].goodsRemove) {
            shoppingRedactAll = false;
          }
        }
      };
    }
    this.setData({
      shoppingAttrAll: shoppingAttrAll,
      shoppingRedactAll: shoppingRedactAll,
      shoppingBe: shoppingBe,
      shoppingRedact: shoppingRedact,
      shoppingRedactText: shoppingRedactText,
    });
  },

  //编辑商品
  compileText: function (obj) {
    if (this.data.shoppingRedact) {
      this.setData({
        shoppingRedact: false,
        shoppingRedactText: '编辑'
      });
    } else {
      this.setData({
        shoppingRedact: true,
        shoppingRedactText: '完成'
      });
    };
  },

  //触发全选
  checkAll: function (obj) {
    let objs = obj.detail.value;
    let objsIf = false;
    if (objs.length > 0) {
      objsIf = true;
    }
    if (this.data.shoppingRedact) {//编辑
      this.checkAllReturn(1, objsIf);
    } else {//购买
      this.checkAllReturn(2, objsIf);
    }
  },

  //购物车选中
  goodsClose: function (obj) {
    let ifs = obj.detail.value.length;
    let index = obj.target.dataset.index;
    let Attr = this.data.shoppingAttr;
    if (!this.data.shoppingRedact) {//不是编辑
      if (ifs == 1) {
        Attr[index].goodsClose = true;
      } else {
        Attr[index].goodsClose = false;
      }
    } else if (this.data.shoppingRedact) {//是编辑
      if (ifs == 1) {
        Attr[index].goodsRemove = true;
      } else {
        Attr[index].goodsRemove = false;
      }
    }
    this.setData({
      shoppingAttr: Attr
    })
    this.aggregation();
    this.operationBtnText();
    this.checkAllMonitor();
  },

  //数量加加
  goodsNumAdd: function (obj) {
    let index = obj.currentTarget.dataset.index;
    let goodsAttr = this.data.shoppingAttr;
    goodsAttr[index].goodsNum = goodsAttr[index].goodsNum + 1;
    this.setData({
      shoppingAttr: goodsAttr
    });
    this.aggregation();
    this.operationBtnText();
  },

  //数量减减
  goodsNumMinus: function (obj) {
    let index = obj.currentTarget.dataset.index;
    let goodsAttr = this.data.shoppingAttr;
    if (goodsAttr[index].goodsNum - 1 > 0) {
      goodsAttr[index].goodsNum = goodsAttr[index].goodsNum - 1;
      this.setData({
        shoppingAttr: goodsAttr
      });
      this.aggregation();
      this.operationBtnText();
    }
  },

  //删除商品
  checkAllFalseTap: function () {
    let Attr = this.data.shoppingAttr;
    let checkAllFalseTap = '';
    let _this = this;
    for (let i = 0; i < Attr.length; i++) {
      if (Attr[i].goodsRemove) {
        checkAllFalseTap += Attr[i].carId + ',';
      }
    }
    if (checkAllFalseTap <= 0) {
      wx.showModal({
        content: '请选择要删除的产品！',
        showCancel: false,
        success: function (res) { }
      })
    } else {
      wx.showModal({
        content: '是否删除选中的产品！',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'https://ssl.lucentury.cn/mall/h5/deleteShopcar.do',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                "carId": checkAllFalseTap,
                "enterpriseCode": _this.data.enterpriseCode,
              },
              method: 'POST',
              success: function (res) {
                console.log("购物车id删除成功");
                _this.setData({
                  shoppingAttr:[],
                });
                _this.shopping();
                _this.aggregation();
                _this.operationBtnText();
                _this.checkAllMonitor();
              }
            })
          }
        }
      })
    }
  },

  //去结算
  ToSettleAccounts:function(res){
    let Attr = this.data.shoppingAttr;
    if (Attr.length < 1){
      wx.showToast({
        title: '暂无产品',
        icon:'none',
      })
    }else{
      let checkAllFalseTap = '';
      let _this = this;
      for (let i = 0; i < Attr.length; i++) {
        if (Attr[i].goodsClose) {
          checkAllFalseTap += Attr[i].carId + ',';
        }
      }
      if (checkAllFalseTap <= 0) {
        wx.showModal({
          content: '请选择产品！',
          showCancel: false,
        })
      } else {
        let _this = this;
        let url = '';
        url += '?post=0';//运费
        url += '&uid=' + _this.data.memberId;//用户id
        url += '&price=' + _this.data.shoppingAttrTotal;//产品价
        url += '&carId=' + checkAllFalseTap;//购物车id
        url += '&isNowBuy=1';//从那个页面进入
        wx.navigateTo({
          url: '../../pages/OrderToDetermine/OrderToDetermine' + url
        })
      }
    }
  },
})