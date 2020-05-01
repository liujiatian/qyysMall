// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyClass:'classifyClass1',
    dataIndex1: 'false',
    dataIndex2: 'false',
    classifyAttr_1: [],//['2','王五']
    classifyAttr_2:[],
    classifyAttr_3:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.productCategoryAll(0);
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

  //初始请求列表
  productCategoryAll(obj){
    let _this = this;
    let attr = [];
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/dealer_h5/productCategoryAllH5.do', //接口地址
      data: {
        "enterpriseCode":wx.getStorageSync('enterpriseCode'),
        "categoryPId":obj,
      },
      method: 'GET',
      success: function (res) {
        let data = res.data.data;
        for(let i=0;i<data.length;i++){
          let dataAttr = [];
          dataAttr[0] = data[i].categoryId;
          dataAttr[1] = data[i].categoryName;
          attr.push(dataAttr);
        };
        _this.setData({
          classifyAttr_1: attr,
          classifyAttr_2: [],
          classifyAttr_3: [],
        });
      }
    })
  },

  //请求classifyTab_1
  classifyTab_1:function(obj){
    let _this = this;
    let attr = [];
    let _id = obj.target.dataset.id;
    let dataIndex1 = obj.target.dataset.index;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/dealer_h5/productCategoryAllH5.do', //接口地址
      data: {
        "enterpriseCode": wx.getStorageSync('enterpriseCode'),
        "categoryPId": _id,
      },
      method: 'GET',
      success: function (res) {
        let _data = res.data;
        if (_data.code == -1){
          let pages = getCurrentPages();//当前页面
          let prevPage = pages[pages.length - 2];//上一页面
          prevPage.setData({//直接给上移页面赋值
            categoryId: _id
          });
          wx.navigateBack({//返回
            delta: 1
          })
        }else{
          let data = _data.data;
          for (let i = 0; i < data.length; i++) {
            let dataAttr = [];
            dataAttr[0] = data[i].categoryId;
            dataAttr[1] = data[i].categoryName;
            attr.push(dataAttr);
          };
          _this.setData({
            classifyAttr_2: attr,
            classifyClass: 'classifyClass2',
            dataIndex1: dataIndex1
          });
        }
      }
    })
  },

  //请求classifyTab_2
  classifyTab_2: function (obj) {
    let _this = this;
    let attr = [];
    let _id = obj.target.dataset.id;
    let dataIndex2 = obj.target.dataset.index;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/dealer_h5/productCategoryAllH5.do', //接口地址
      data: {
        "enterpriseCode": wx.getStorageSync('enterpriseCode'),
        "categoryPId": _id,
      },
      method: 'GET',
      success: function (res) {
        let _data = res.data;
        if (_data.code == -1) {
          let pages = getCurrentPages();//当前页面
          let prevPage = pages[pages.length - 2];//上一页面
          prevPage.setData({//直接给上移页面赋值
            categoryId: _id
          });
          wx.navigateBack({//返回
            delta: 1
          })
        } else {
          let data = _data.data;
          for (let i = 0; i < data.length; i++) {
            let dataAttr = [];
            dataAttr[0] = data[i].categoryId;
            dataAttr[1] = data[i].categoryName;
            attr.push(dataAttr);
          };
          _this.setData({
            classifyAttr_3: attr,
            classifyClass: 'classifyClass3',
            dataIndex2: dataIndex2
          });
        }
      }
    })
  },

  //请求classifyTab_3
  classifyTab_3: function (obj) {
    let _id = obj.target.dataset.id;
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      categoryId: _id
    });
    wx.navigateBack({//返回
      delta: 1
    })
  },
})