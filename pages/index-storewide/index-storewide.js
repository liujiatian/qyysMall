// pages/index-storewide/index-storewide.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterpriseCode: '',
    atPresent: false,
    atPresentImg: '../../img/productList2.png',
    merchandiseModel: 1,//默认样式
    goodsTabNum: 2,//tab下标
    screenFrame: false,//筛选
    screenMin: '',//筛选input小
    screenMax: '',//筛选input大
    goodsAttr: [],//显示列表
    pageNumber:'',//分页
    orderByPrice: '',//价格：1降序 2升序
    orderBySalesNumber: '',//销量：1降序 2升序
    orderByShelfTime: '',//新品：1降序 2升序
    categoryId: '',//产品分类 id
    productName: '',//产品名称
    leftPrice: '',//筛选小
    rightPrice: '',//筛选大
  },

  //查询数据
  loadingProd(pageNumber, orderByPrice, orderBySalesNumber, orderByShelfTime, categoryId, productName, leftPrice, rightPrice){
    let _this = this;
    wx.showLoading({
      'title': '正在加载'
    });
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/mallProductListView.do', //接口地址
      data: {
        pageNumber: (pageNumber == null ? _this.data.pageNumber : pageNumber),
        pageSize: 10,
        enterpriseCode: _this.data.enterpriseCode,
        orderByPrice: (orderByPrice == null ? _this.data.orderByPrice : orderByPrice),
        orderBySalesNumber: (orderBySalesNumber == null ? _this.data.orderBySalesNumber : orderBySalesNumber),
        orderByShelfTime: (orderByShelfTime == null ? _this.data.orderByShelfTime : orderByShelfTime),
        categoryId: (categoryId == null ? _this.data.categoryId : categoryId),
        productName: (productName == null ? _this.data.productName : productName),
        leftPrice: (leftPrice == null ? _this.data.leftPrice : leftPrice),
        rightPrice: (rightPrice == null ? _this.data.rightPrice : rightPrice),
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        //console.log(JSON.stringify(res))
        let _data = res.data;
        if (_data.code != -1) {
          let data = _data.data;//商品列表
          let pogeAttr = [];
          let goodsAttr = _this.data.goodsAttr;
          for (let i = 0; i < data.length; i++) {
            let product = {
              'goodsId': data[i].productId,
              'goodsImg': 'https://ssl.lucentury.cn/mall/' + data[i].productPicture,
              'goodsName': data[i].productName,
              'goodsPrice': data[i].productPrice,
              'goodsSales': data[i].soldAmount
            };
            pogeAttr.push(product);
          };
          goodsAttr = goodsAttr.concat(pogeAttr);
          _this.setData({
            goodsAttr: goodsAttr
          })
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title:'没有产品啦~',
            icon:'none'
          })
        }
        _this.setData({
          pageNumber: (pageNumber == null ? _this.data.pageNumber : pageNumber),//分页
          orderByPrice: (orderByPrice == null ? _this.data.orderByPrice : orderByPrice),//价格：1降序 2升序
          orderBySalesNumber: (orderBySalesNumber == null ? _this.data.orderBySalesNumber : orderBySalesNumber),//销量：1降序 2升序
          orderByShelfTime: (orderByShelfTime == null ? _this.data.orderByShelfTime : orderByShelfTime),//新品：1降序 2升序
          categoryId: (categoryId == null ? _this.data.categoryId : categoryId),//产品分类 id
          productName: (productName == null ? _this.data.productName : productName),//产品名称
          leftPrice: (leftPrice == null ? _this.data.leftPrice : leftPrice),//筛选小
          rightPrice: (rightPrice == null ? _this.data.rightPrice : rightPrice),//筛选大
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (obj) {
    var _this = this;
    var value = wx.getStorageSync('enterpriseCode');
    if (value) {
      _this.setData({
        enterpriseCode: value
      });
    }
    _this.loadingProd(1,'','',1,'','','','');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (obj) {
    if (this.data.categoryId != ''){
      let cat = this.data.categoryId;
      this.setData({
        goodsAttr: []
      });
      this.loadingProd(1, '', '', '', cat, '', '', '');
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      categoryId: '',
    });
  },

  //点击切换商品显示样式
  tabType: function (obj) {
    if (this.data.atPresent) {
      this.setData({
        atPresent: false,
        atPresentImg: '../../img/productList2.png',
        merchandiseModel: 1
      })
    } else {
      this.setData({
        atPresent: true,
        atPresentImg: '../../img/productList1.png',
        merchandiseModel: 2
      })
    }
  },

  //点击商品类目切换
  goodsTabColor: function (obj) {
    let index = obj.currentTarget.dataset.index;
    if (index == 1){
      wx.navigateTo({
        url: '../../pages/classify/classify'
      })
    }else if(index == 5){
      let screenFrame = this.data.screenFrame;
      let _this = true;
      if (screenFrame) {
        _this = false;
      } else {
        _this = true;
      }
      this.setData({
        screenFrame: _this,
      });
    }else{
      if (index == 2){
        let orderByShelfTime = this.data.orderByShelfTime;
        this.setData({
          goodsAttr:[]
        });
        if (orderByShelfTime != 1){
          this.loadingProd(1, '', '', 1, '', '', '', '');
        }else{
          this.loadingProd(1, '', '', 2, '', '', '', '');
        }
      } else if (index == 3) {
        let orderBySalesNumber = this.data.orderBySalesNumber;
        this.setData({
          goodsAttr: []
        });
        if (orderBySalesNumber != 1) {
          this.loadingProd(1, '', 1, '', '', '', '', '');
        } else {
          this.loadingProd(1, '', 2, '', '', '', '', '');
        }
      } else if (index == 4) {
        let orderByPrice = this.data.orderByPrice;
        this.setData({
          goodsAttr: []
        });
        if (orderByPrice != 1) {
          this.loadingProd(1, 1, '', '', '', '', '', '');
        } else {
          this.loadingProd(1, 2, '', '', '', '', '', '');
        }
      }
      this.setData({
        goodsTabNum: index,
      })
    }
  },

  //筛选隐藏
  screen_Back: function (obj) {
    let screenFrame = this.data.screenFrame;
    let _this = true;
    if (screenFrame) {
      _this = false;
    } else {
      _this = true;
    }
    this.setData({
      screenFrame: _this
    });
  },

  //筛选重置
  screen_Return: function (obj) {
    this.setData({
      screenMin: '',
      screenMax: ''
    })
  },

  //筛选输入小
  screenMin: function (obj) {
    let val = obj.detail.value;
    this.setData({
      screenMin: val
    });
  },

  //筛选输入大
  screenMax: function (obj) {
    let val = obj.detail.value;
    this.setData({
      screenMax: val
    });
  },

  //图片路径错误替换图片
  errorFunction: function (obj) {
    if (obj.type == 'error') {
      let errorImgIndex = obj.target.dataset.index; //获取错误图片循环的下标
      let imgList = this.data.goodsAttr; 　　　　　　　//将图片列表数据绑定到变量
      imgList[errorImgIndex].goodsImg = '../../img/noPhoto.png'; //错误图片替换为默认图片
      this.setData({
        goodsAttr: imgList
      })
    }
  },

  //商品下拉加载
  goodsLoadMore: function (obj) {
    let pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    });
    this.loadingProd(pageNumber,null,null,null,null,null,null,null);
  },

  //商品搜索
  seoInput:function(obj){
    //console.log(obj.detail.value)
    let val = obj.detail.value;
    this.setData({
      goodsAttr: [],
      pageNumber:''
    });
    this.loadingProd(1, null, null, null, null, val, null, null);
  },

  //点击商品
  goodsUrl: function (obj) {
    let id = obj.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/productDetails/productDetails?id=' + id
    })
  },
})