// pages/security/security.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
    uid: '',
    enterpriseCode: '',
    cellPhone:'' 
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    _this.loaddata();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  loaddata(){
    var _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findMemberById.do', //接口地址
      data: {
        id: _this.data.uid
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 1) {
          _this.setData({
            cellPhone: res.data.data.cellPhone
          });
        }
      }
    })
  },
  verifyPhone (){ //跳转手机验证的页面
    wx.navigateTo({
      url: '../verifyPhone/verifyPhone'
    })
  },
  aboutstore (){  //跳转关于商城的页面
    wx.navigateTo({
      url: '../aboutstore/aboutstore'
    })
  }
})