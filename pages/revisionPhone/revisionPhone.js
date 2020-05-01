// pages/revisionPhone/revisionPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    enterpriseCode: '',
    socialAccount: ""//社交账号
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
    _this.setData({
      socialAccount: options.socialAccount
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  formSubmit: function (e) {//修改姓名
    var _this = this;
    let socialAccount = e.detail.value.socialAccount;
    if (socialAccount) {
      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/updateMemberById.do', //接口地址    
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          'id': _this.data.uid,
          'socialAccount': socialAccount,
        },
        success: function (res) {
          var code = res.data.code;
          if (code == 1) {
            _this.updatesore();
            wx.showToast({
              title: '保存成功',
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                    success: function () {
                      var pages = getCurrentPages();
                      var currPage = pages[pages.length - 1];   //当前页面
                      currPage.loadmessge();//调用返回后的页面，刷新渲染
                    }
                  })
                }, 500);
              }
            });

          }
        }
      });
    }
  },
  //更新积分
  updatesore() {
    var _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findIntegralRecordAll.do',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "encryptUserId": _this.data.uid,
        "integralType": 3
      },
      success: function (res) {
        var code = res.data.code;
        if (code == -1) {
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/insertIntegralRecord.do',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              "memberId": _this.data.uid,
              "type": 3,
              "money": 0.0,
              "enterpriseCode": _this.data.enterpriseCode,
            },
            success: function (res) {
            }
          })
        }
      }
    })
  }
})