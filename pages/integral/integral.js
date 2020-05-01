// pages/index-integral/index-integral.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nocontentimg: "https://ssl.lucentury.cn/mall/images/zanwujifen.png",
    imanodata:'',
    uid:'',
    enterpriseCode:'',
    currentPoints:'',
    recordlist: [
    ],
    numval:0,
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
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findMemberById.do', //接口地址
      data: {
        id: _this.data.uid
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
         if (res.data.code == 1) {
           let currentPoints;
           if (res.data.data.currentPoints==null){
             currentPoints=0;
           }else{
             currentPoints = res.data.data.currentPoints;
           }      
           _this.setData({
             currentPoints: currentPoints
           });
           _this.findIntegral(_this.data.uid);
         }
      }
    })
  },
  //
  findIntegral(memberId) {
    var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findIntegralRecordAll.do', //接口地址
      data: {
        "encryptUserId": memberId,
        "isFailure": 1
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if(res.data.code==1){
          var data = res.data.data;
          var integral=0;
          for (var i = 0; i <data.length;i++){
            integral += data[i].integral;
            data[i].createTime = util.formatTime(data[i].createTime);
          }
          let numval=0;
          if (data.length==0){
            numval = 1;
          }
          _this.setData({
            recordlist: data,
            currentPoints: integral,
            numval: numval
          });
        }       
      }
    });
  } 
})