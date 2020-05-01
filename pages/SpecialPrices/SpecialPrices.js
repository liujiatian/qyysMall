// pages/SpecialPrices/SpecialPrices.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: '',//产品id
    enterpriseCode: '',
    slideshow: [],//产品图片
    productName: '冰媚儿冰冻草莓150g*4/盒（因天气原因，乡镇及偏远地区购买前请联系客服，敬请谅解！！！）',//产品名
    originalPrice: 22.8,//原价
    currentPrice: 18.8,//现价
    repertory: 200,//库存
    market: 1078,//已销售 
    freight: 0,//运费
    quantity: 1,//数量
    ParametersGpsLeft: '',//详情参数位置
    Parameters: true,//详情参数
    DetailsOfTheData: false,//产品详情数据
    ProductParameterData: true,//产品参数数据
    hePictures: [//产品详情图片
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180724/20180724084416_167.jpg',
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180716/20180716174902_151.jpg',
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180716/20180716174902_952.jpg',
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180716/20180716174902_578.jpg',
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180716/20180716174902_123.jpg',
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180716/20180716174902_210.jpg',
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180716/20180716174903_799.jpg',
      'http://benduoduo.qiyiyunshang.com/mall/upload/image/20180716/20180716174903_128.jpg',
    ],
    peisong: '',//物流公司
    singleLinkAttr: [],//物流方式
    singleLinkAttrIndex: 0,//物流方式下标
    Ofspecification: true,//显示规格
    DisplayNormalized: false,//显示值
    DisplayNormalizedOkText: '',//规格值
    DisplayNormalizedOkId: [],//规格ID
    specificationAttr: [],//规格
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (obj) {
    let _this = this;
    let peisong = obj.peisong == undefined ? '' : obj.peisong;
    _this.setData({
      'enterpriseCode': wx.getStorageSync('enterpriseCode'),
      'peisong': peisong,
      'pid': obj.id,
    });
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findProductById.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "id": obj.id,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      success: function (res) {
        let data = res.data.data;
        //console.log(JSON.stringify(data))
        let picture = data.picture.split(",");
        let pictureAttr = [];
        for (let i = 0; i < picture.length; i++) {
          if (picture[i] != '') {
            pictureAttr.push('https://ssl.lucentury.cn/mall/' + picture[i]);
          }
        }

        _this.setData({
          "productName": data.name,
          "slideshow": pictureAttr,
          "originalPrice": data.marketPrice,
          "originalPrice": data.marketPrice,
          "currentPrice": data.sellingPrice,
          "repertory": data.number,
          "market": data.salesNumber,
        });

        //查询库存
        if (data.modality != 2) {
          let specifications = data.specifications;
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/findAvailableNumberH5.do',
            method: 'POST',
            data: {
              "id": obj.id,
              "enterpriseCode": _this.data.enterpriseCode,
              "productSpec": specifications.substr(0, specifications.length - 1),
            },
            success: function (res) {
              var availableNumber = 0;
              if (res.code == 1) {
                availableNumber = res.data;
              }
              if (res.code == -1) {
                availableNumber = 0;
              }
              _this.setData({
                "repertory": availableNumber,
              });
            }
          });
        };

        //根据后台运费模板默认计算运费
        wx.request({
          url: 'https://ssl.lucentury.cn/mall/h5/findAvailableNumberH5.do',
          method: 'POST',
          data: {
            "isDefault": 1,
            "enterpriseCode": _this.data.enterpriseCode,
          },
          success: function (res) {
            let money = 0;
            let code = res.code;
            let data = res.data;
            if (code == 1) {
              let type = data.calcMethod;
              switch (type) {
                case 2:
                  money = res.unifiedPrice;
                  break;
                case 1:
                  break;
                case 3://暂未计算
                  break;
                case 4://暂未计算
                  break;
              }
            }
            _this.setData({
              'freight': money
            });
          },
        });

        //查询物流公司
        let peisong = _this.data.peisong;
        if (peisong != null && peisong != "" && peisong != "null" && peisong != "undefined") {
          $("#wulius").html(decodeURI(peisong));
        } else {
          _this.setData({
            'singleLinkAttr': ['快递物流'],
            'singleLinkAttrIndex': 0,
          })
        }

        //产品规格
        let list = data.list;
        if (list != null & list != "") {
          let attr = [];
          for (let i = 0; i < list.length; i++) {
            let attrF2 = [];
            for (let j = 0; j < list[i].valueIds.length; j++) {
              let data = list[i].valueIds;
              let attr_F2 = {
                'id': data[j].valueId,
                'text': data[j].valueName,
              };
              attrF2.push(attr_F2);
            }
            let attrF1 = {
              'id': list[i].id,
              'name': list[i].name,
              'pitchOn': '',
              'pitchText': '',
              'attr': attrF2,
            };
            attr.push(attrF1);
          }
          _this.setData({
            specificationAttr: attr
          });
        } else {
          _this.setData({
            Ofspecification: false,
          });
        }

        //产品详情
        let article = data.description;
        //console.log(article)
        WxParse.wxParse('DetailsOfTheData', 'html', article, _this, 0);
      }
    });
  },

  //预览产品图片
  slideshowImage: function (obj) {
    let url = obj.currentTarget.dataset.url;
    wx.previewImage({
      current: 'https://longyc-1257050523.cos.ap-beijing.myqcloud.com/images/1511141692043_193.png', // 当前显示图片的http链接
      urls: ['https://longyc-1257050523.cos.ap-beijing.myqcloud.com/images/1511141692043_193.png', 'https://longyc-1257050523.cos.ap-beijing.myqcloud.com/images/1511141692043_193.png'] // 需要预览的图片http链接列表
    })
  },

  //加数量
  quantityTapAdd: function (obj) {
    let i = this.data.quantity;
    i++;
    this.setData({
      quantity: i
    });
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

  //进入购物车
  shoppingCart: function (obj) {
    wx.switchTab({
      url: '/pages/index-Cart/index-Cart'
    })
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

  //选择物流方式
  logistics: function (e) {
    this.setData({
      singleLinkAttrIndex: e.detail.value
    })
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
    //console.log(obj);
    let attr = this.data.specificationAttr;
    let index = obj.target.dataset.index;
    let val = obj.detail.value;
    val = val.split(',');
    attr[index].pitchOn = val[0];
    attr[index].pitchText = val[1];
    this.setData({
      specificationAttr: attr
    });
  },

  //确定规格
  DisplayNormalizedOk: function (obj) {
    let attr = this.data.specificationAttr;
    let attrId = [];
    let text = '';
    for (let i = 0; i < attr.length; i++) {
      text += attr[i].pitchText + ',';
      attrId.push(attr[i].pitchOn);
    }
    this.setData({
      DisplayNormalizedOkId: attrId,
      DisplayNormalizedOkText: text,
      DisplayNormalized: false
    });
  },

  //立即购买
  purchaseNow: function (obj) {
    wx.navigateTo({
      url: '../../pages/OrderToDetermine/OrderToDetermine'
    })
  },

  //产品评论
  Reviews: function (obj) {
    wx.navigateTo({
      url: '../../pages/productReview/productReview?pid=' + this.data.pid
    })
  }
})