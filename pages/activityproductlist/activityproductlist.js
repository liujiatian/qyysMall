// pages/activityproductlist/activityproductlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    enterpriseCode:'',
    dataArr:[],//列表数据
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
  },
  onReady: function () {
    var _this = this;
    _this.laodDataList();
  },
  laodDataList(){
    var _this=this;
    let enterpriseCode = _this.data.enterpriseCode;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/selectActivityProductH5.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        enterpriseCode: _this.data.enterpriseCode
      },
      method: 'POST',
      success(res) {
       if(res.data.code==1){
         _this.setData({
           dataArr:res.data.data
         });
       }
      }
    })
  }
})