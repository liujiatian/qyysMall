var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {//头像背景图
    uid:'',
    enterpriseCode:'',
    bgsgezhiimg: "https://ssl.lucentury.cn/mall/images/shezhi.png",
    bgimg: "https://ssl.lucentury.cn/mall/images/background.png",
    minorder: [
      {
        doerlogo: "https://ssl.lucentury.cn/mall/images/indent.png",
        ordertext: "我的订单",
        todelimg: "https://ssl.lucentury.cn/mall/images/rightorange.png",
        storewide: "查看全部已购宝贝" 
      }
    ],
    tabnav: [//代发货等信息
      { 
        index:0,
        navimg:"https://ssl.lucentury.cn/mall/images/fukuan.png",
        navetext:"待付款"
      },
      {
        index:1, 
        navimg: "https://ssl.lucentury.cn/mall/images/fahuo.png",
        navetext: "待发货"
      },
      {
        index: 2,
        navimg: "https://ssl.lucentury.cn/mall/images/shouhuo.png",
        navetext: "待收货"
      },
      {
        index:3,
        navimg: "https://ssl.lucentury.cn/mall/images/pingjia.png",
        navetext: "待评价"
      }
    ],
    minessgto:[//跳转页列表
      {
        index: 0,
        doerlogo: "https://ssl.lucentury.cn/mall/images/info.png",
        ordertext: "我的信息",
        todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
        storewide: ""
      },
      {
        index: 1,
        doerlogo: "https://ssl.lucentury.cn/mall/images/youhuiquan.png",
        ordertext: "我的优惠券",
        todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
        storewide: ""
      },
      {
        index: 2,
        doerlogo: "https://ssl.lucentury.cn/mall/images/site.png",
        ordertext: "收货地址",
        todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
        storewide: ""
      },
      {
        index: 3,
        doerlogo: "https://ssl.lucentury.cn/mall/images/consult.png",
        ordertext: "我的咨询",
        todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
        storewide: ""
      },
      {
        index: 4,
        doerlogo: "https://ssl.lucentury.cn/mall/images/integral.png",
        ordertext: "我的积分",
        todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
        storewide: "当前积分"
      },
      // {
      //   index: 5,
      //   doerlogo: "https://ssl.lucentury.cn/mall/images/share.png",
      //   ordertext: "天天赚享达人",
      //   todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
      //   storewide: ""
      // },
      {
        index: 5,
        doerlogo: "https://ssl.lucentury.cn/mall/images/safety.png",
        ordertext: "安全中心",
        todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
        storewide: ""
      },
      {
        index: 6,
        doerlogo: "../../img/tuan.png",
        ordertext: "我发起的团购",
        todelimg: "https://ssl.lucentury.cn/mall/images/you8a8a8a.png",
        storewide: ""
      }
    ]
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
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/findIntgralByMemberId.do', //接口地址
      data: {
        "encryptUserId": _this.data.uid,
        "isFailure": 1
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data) {
          let minessgto = _this.data.minessgto;
          minessgto[4].storewide = '当前积分' + res.data.integral;
          _this.setData({
            minessgto: minessgto
          });        
        }
      }
    })
  },
  toshezhinavurl() {
    wx.navigateTo({
      url: '../security/security'
    })
  },
  navigatetopersonwuliu (){
    wx.navigateTo({
      url: '../myOrder/myOrder'
    })
  },
  navigatetowuliu (e){
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../myOrder/myOrder?index=' + index
     })
  },
  navigatetopage (e){
    const index = e.currentTarget.dataset.index;
    if (index == 0) {
      wx.navigateTo({
        url: '../perInformation/perInformation'
      })
    }else if (index==1){
      wx.navigateTo({
        url: '../discount/discount'
      })
    } else if (index==2){
        wx.navigateTo({
          url: '../myAddress/myAddress',
        })
    } else if (index == 3) {
      wx.navigateTo({
        url: '../advisory/advisory'
      })
    } else if (index == 4) {
      wx.navigateTo({
        url: '../integral/integral'
      })
    }else if (index == 5) {
      wx.navigateTo({
        url: '../security/security'
      })
    }else if (index==6){
      wx.navigateTo({
        url: '../myGroupbuy/myGroupbuy'     
      });
    }
  }
})