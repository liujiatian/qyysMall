// pages/verifyPhone/verifyPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    enterpriseCode: '',
    cursor:'',         //输入框输入字符的长度
    phonenumber:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取id 和企业code
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
  userBox (e){//监听手机号输入字符的长短
    this.setData({
      cursor: e.detail.cursor,
      phonenumber: e.detail.value
    });
  },
  getcode (){ //点击获取验证码
    var _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/RegisterCode.do', //接口地址
      data: {
        "phone": _this.data.phonenumber,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data == -1) {
          wx.showModal(
            {
              title: '提示',
              content: '手机号错误，请填写正确的手机号',
            });        
        } else if (res.data == -2) {
          wx.showModal(
          {
            title:'提示',
            content:'发送失败，请稍后操作',
          });
        }

      }
    })
  },
  //点击修改
  updatphone (e){
    var _this = this;
    let cellPhone =e.detail.value.userphone;
    let phone_validate = e.detail.value.verifycode;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/updatePassword.do', //接口地址
      data: {
        "cellPhone": cellPhone,
        "phone_validate": phone_validate,
        "encryptId": _this.data.uid,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if(res.data.code=='1'){
          wx.showToast({
            title: '修改成功！'
          });
          wx.redirectTo({
            url: '../security/security'
          })
        } else if (res.data.code == '-1'){
          wx.showToast({
            title: '修改失败'
          });
        } else if (res.data.code == '-2') {
          wx.showToast({
            title: '验证码填写错误！'
          });
        }
      }
    })
  }

})