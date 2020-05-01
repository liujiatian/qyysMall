// pages/index-perInformation/index-perInformation.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    enterpriseCode:'',
    toaddimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
    personname:'',//姓名
    sexarray: ['男', '女'],
    sextext: '请选择性别',//用户性别 1，男，2女
    seletime: '请选择时间',
    socialAccount:'',  //社交账号
    defaulttime:'2000-08-08'//默认出生年月2000-01-01
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
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
    this.loadmessge();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadmessge();
  },
  //渲染页面
  loadmessge(){
    var _this = this;
    let uid = _this.data.uid;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findMemberById.do', //接口地址
      data: {
        id: uid
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 1) {
          let data = res.data.data;
          let personname, sextext, seletime, socialAccount, defaulttime;
          data.name == null ? (personname = '请编辑姓名') : (personname = data.name);
          data.sex != null ? (data.sex == 1 ? sextext = '男':sextext = '女'): sextext = '请选择性别';
          data.birthday == null ? (seletime = '请选择时间') : (seletime = util.formatDate(data.birthday));
          data.birthday == null ? (defaulttime = '2000-08-08') : (defaulttime = util.formatDate(data.birthday));
          data.socialAccount == null ? (socialAccount = '') : (socialAccount = data.socialAccount);
          _this.setData({
            personname: personname,
            sextext: sextext,
            seletime: seletime,
            socialAccount: socialAccount,
            defaulttime: defaulttime,
          });
        }
      }
    })
  },
  bindPickerChange(e) {//修改性别
    var _this=this;
    const index = e.detail.value;
    let sextext = _this.data.sexarray[index];
    _this.setData({
      sextext: sextext
    });
    //改变性别
    _this.modifyInformation(parseInt(index)+1,'sex');
  },
  bindDateChange(e) {//修改生日
  var _this=this;
    const timebirstday = e.detail.value;
    this.setData({
      seletime: timebirstday
    });
    //修改出生年月日
    _this.modifyInformation(timebirstday, 'birthday');
  },
  revisionphone() {//编辑社交账号
    let socialAccount = this.data.socialAccount;
    wx.navigateTo({
      url: '../revisionPhone/revisionPhone?socialAccount=' + socialAccount,
    })
  },
  revisionname (){//编辑姓名
    let personname = this.data.personname;
    wx.navigateTo({
      url: '../revisionname/revisionname?personname=' + personname,
    })
  },
  modifyInformation(obj){//修改信息
    var _this = this;
    let name = arguments[1];
    let value = arguments[0];
    let data = {};
    if (name=='sex'){
      data = {
        id: _this.data.uid,
        sex: value,
      }
    } else if (name =='birthday'){
      data = {
        id: _this.data.uid,
        birthday: value,
      }
    };
    if (value) {
      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/updateMemberById.do', //接口地址    
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data:data,
        success: function (res) {
          var code = res.data.code;
          if (code == 1) {
            _this.updatesore();
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