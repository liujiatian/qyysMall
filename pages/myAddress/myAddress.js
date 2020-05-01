// pages/myAddress/myAddress.js
Page({

  data: {
    uid: '',
    enterpriseCode: '',
    dataArr: [],//收货地址数据
    status:0,//管理和完成两个状态分别是0，1
    valueId:'',//设置默认时候的地址id
    orderSureId:'1',//确定收货地址的状态 0, 1是我的地址进的
    postage:'',//订单页面的参数，返回的时候要传回去
    carId:'',
    isNowBuy:'',
    
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
      orderSureId: options.orderSureId,
      postage: options.postage,
      carId: options.carId,
      isNowBuy: options.isNowBuy,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    _this.selectdata();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    _this.selectdata();
  },
  selectdata(){
    var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/memberAddress.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "encryptMemberId": _this.data.uid,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 1) {
          _this.setData({
            dataArr: res.data.data
          });
        }
      }
    })
  },
  //管理与完成
  administration(){
    var _this=this;
    let status = _this.data.status;
    //设置默认地址
    if (status==1){
      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/updateDefaultAddress.do', //接口地址
        data: {
          "id": _this.data.valueId,
          "enterpriseCode": _this.data.enterpriseCode,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 1) {
            
          }
        }
      });
    }
    status=(status==0?1:0);
    _this.setData({
      status: status,
    });
  },
  //设置默认地址 获取默认地址的id
  radioChange(e){
    var _this=this;
    let value=e.detail.value;
    _this.setData({
      valueId:value
    });
  },
  //设置默认的时候改变红色的默认字体的位子
  seleradio(e){
    var _this=this;
    let index = e.currentTarget.dataset.index;
    let dataArr = _this.data.dataArr;
    for (let i = 0; i < dataArr.length;i++){
      dataArr[i].isDefault=true;
      if(i==index){
        dataArr[i].isDefault = false;
      }
    }
    _this.setData({
      dataArr: dataArr,
    });
  },
  //编辑地址
  editAddress(e) {
    var _this = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addNewAddress/addNewAddress?id='+id,
    })
  },
  //跳转新增页面
  addNewaddress(){
    wx.navigateTo({
      url: '../addNewAddress/addNewAddress',
    })
  },
  //删除收货地址
  deleteAddress(e){
    var _this=this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否删除该收货地址？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://ssl.lucentury.cn/mall/h5/deleteMemberAddress.do', //接口地址
            data: {
              "id": id
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功',
                  success: function () {
                    _this.selectdata();
                  }
                });
              }
            }
          });
        }
      }
    });
  },
  //确认订单获取地址
  sureOrderAddress(e){
    var _this=this;
    var orderSureId = _this.data.orderSureId;
    if (orderSureId==0){//确认订单里面的获取收货地址
      var dataaddress = e.currentTarget.dataset;
      dataaddress.postage = _this.data.postage;
      dataaddress.carId = _this.data.carId;
      dataaddress.isNowBuy = _this.data.isNowBuy;
      wx.redirectTo({
        url: "../OrderToDetermine/OrderToDetermine?dataaddress=" + JSON.stringify(dataaddress),
      })
    }
  }
})