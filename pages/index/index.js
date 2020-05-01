// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterpriseCode:'',
    imgUrls: [],// 轮播图数据['跳转路径','图片路径']
    indicatorDots:'true',
    indicatorColor:'#f5f5f5',
    indicatorActiveColor:'#fa4f52',
    autoplay:'true',
    navAttr: [],// 快捷导航数据['跳转路径','图片路径']
    productList: []//产品列表数据['跳转路径','图片路径']
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (obj) {
    let _this = this;
    var value = wx.getStorageSync('enterpriseCode');
    if (value) {
      _this.setData({
        enterpriseCode: value
      });
    };

    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findTemplateByCode.do', //接口地址
      data: {
        'enterpriseCode': _this.data.enterpriseCode
      },
      method:'GET',
      success: function (res) {
        let datas = res.data.data;
        let slideshow = datas.alternate;
        let slideshowAttr = slideshow.split(',');//轮播图数组
        let slideshowUrl = datas.alternateUrl;
        let slideshowUrlAttr = slideshowUrl.split(',');//轮播图数组Url

        //轮播图
        let imgUrls = [];
        for (let i = 0; i < slideshowAttr.length-1; i++){
          let attr = [];
          attr[0] = slideshowUrlAttr[i];
          attr[1] = 'https://ssl.lucentury.cn/mall/'+slideshowAttr[i];
          imgUrls.push(attr);
        };

        //快捷入口
        let QuickEntry = [];
        let centerMenu = datas.centerMenu;
        let centerMenuAttr = centerMenu.split(',');//快捷入口图片
        let centerMenuUrl = datas.centerMenuUrl;
        let centerMenuUrlAttr = centerMenuUrl.split(',');//快捷入口图片Url
        for (let i = 0; i < centerMenuAttr.length - 1; i++) {
          let attr = [];
          attr[0] = centerMenuUrlAttr[i];
          attr[1] = 'https://ssl.lucentury.cn/mall/' + centerMenuAttr[i];
          QuickEntry.push(attr);
        };

        //产品列表
        let Products = [];
        for(let i=1;i<15;i++){
          let attr = [];
          attr[0] = datas['contentImageUrl' + i];
          attr[1] = 'https://ssl.lucentury.cn/mall/' + datas['contentImage' + i];
          Products.push(attr);
        } 

        _this.setData({
          imgUrls: imgUrls,
          navAttr: QuickEntry,
          productList: Products
        });
      }
    })
  }
})