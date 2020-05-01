// pages/bigGun/bigGun.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgimg: "https://ssl.lucentury.cn/mall/images/darenbg.png", //头像背景图
    usemoney:0,                                                     //可用佣金
    estimationmoney:0,                                              //暂估佣金
    accumulativeWithdrawal:0,                                       //累计提现
    teamorder:[
      {
        index:0,
        imgurl:'https://ssl.lucentury.cn/mall/images/wodedingdan.png',
        nametitle:'我的订单',
        context:'订单数量',
        contextnum:0,
        righttext:'累计金额',
        righttextnum:0,
        righttexttwo:'',
        righttexttwonum:''
      },
      {
        index: 1,
        imgurl: 'https://ssl.lucentury.cn/mall/images/wodetuandui.png',
        nametitle: '我的团队',
        context: '累计人数',
        contextnum: 0,
        righttext: '我的一级',
        righttextnum: 0,
        righttexttwo: '我的二级',
        righttexttwonum: '0'
      }
    ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  orderteamdelite (e){
    const index = e.currentTarget.dataset.index;
    let url="";
    if (index==0){
      url = "../settleOrder/settleOrder"
    }else if(index==1){  
      url = "../myteam/myteam";  
    }
    wx.navigateTo({
      url: url,
    })
  },
  bringupmoney (){//提现页面
    wx.navigateTo({
      url: '../commissionWithdrawal/commissionWithdrawal'
    })
  },
  bringrecorde (){//提现记录
    wx.navigateTo({
      url: '../bringrcorde/bringrcorde'
    })
  },
  bringranking (){//排行榜
    wx.navigateTo({
      url: '../bringranking/bringranking'
    })
  }
})