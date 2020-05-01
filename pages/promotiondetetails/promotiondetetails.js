// pages/promotiondetetails/promotiondetetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Prod:1,  //加载数据的页数
    datatype:'',//传的参数
    enterpriseCode:'',
    uid:'',
    dataheight:'',//容器高度
    attr:[],
    nodatanum:0,//0代表没数据
    nodataimg:'https://ssl.lucentury.cn/mall/images/zwcx.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let datatype = options.type;
    // if (datatype == 1){
    //   wx.setNavigationBarTitle({
    //     title: '购送大酬宾，赠品送不停',
    //   });
    // } else if (datatype == 2) {
    //   wx.setNavigationBarTitle({
    //     title: '母婴击穿活动',
    //   });
    // } else if (datatype == 3) {
    //   wx.setNavigationBarTitle({
    //     title: '狂人逆袭，闪耀出街',
    //   });
    // };
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
    _this.setData({ 
      datatype: datatype,
      Prod:1,
    });
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     var _this=this;
    _this.loadingProd(1);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  loadingProd(Prods) {//加载数据
    var _this=this;
    var Prods = Prods;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findPromotionDetailAll.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'pageNumber': Prods,
        'pageSize': 10,
        'promotionTypeId': _this.data.datatype,
        'enterpriseCode': _this.data.enterpriseCode,
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 1) {
          let pro = res.data.data;        
          _this.loadData(pro);
          let Prod = _this.data.Prod;
          Prod = parseInt(Prod)+1;
          _this.setData({
            Prod: Prod,
          });
        } else {//暂无活动

        }
      }
    })
  },
  //渲染
  loadData(pro){
    var _this=this;
    let attrs = [];
    for (let i = 0; i < pro.length; i++) {
      let attrdata = {
        url: '../../pages/promotionGoods/promotionGoods?pid=' + pro[i].productId+ '&promotionId=' + pro[i].promotionId,
        nav: '优惠商品',
        image: 'https://ssl.lucentury.cn/mall/' + pro[i].productPicture + '?pid=' + pro[i].id + '&promotionId=' + pro[i].promotionId,
        name: pro[i].productName,
        market: pro[i].soldAmount,
        Price: pro[i].secondsPrice,
        PriceOf: pro[i].marketPrice,
      };
      attrs.push(attrdata);
    };
    let attr=_this.data.attr;
    attrs=attr.concat(attrs);//合并数组
    let nodatanum=0;
    if (attrs.length>0){
      nodatanum=1;
    }
    _this.setData({
      attr: attrs,
      nodatanum: nodatanum
    })
   // _this.loadingheight();
  },
  //上拉触底加载更多
  loadmoredata(){
    var _this=this;
    let Prod = _this.data.Prod;
    _this.loadingProd(Prod);
  },
  loadingheight(){
    var _this = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.datacont').boundingClientRect(function (rect) {
      let dataheight = rect.height + "px";
      _this.setData({
        dataheight: dataheight
      })
    }).exec();
  },
  //图片路径错误替换图片
  errorFunction: function (obj) {
    if (obj.type == 'error') {
      let index = obj.target.dataset.index;//获取错误图片的下标
      let attr = this.data.attr; 　　　　　　　//将图片列表数据绑定到变量
      attr[index].image = 'https://ssl.lucentury.cn/mall/images/xiaochengxv/no_product.png'; //错误图片替换为默认图片
      this.setData({
        attr: attr
      })
    }
  },
})