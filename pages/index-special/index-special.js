// pages/index-special/index-special.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgheight:'',                                                  //图片按宽度的比例对于的高度
    activelistarr:[
      {
        yugouimg: 'http://gzbingtai.qiyiyunshang.com/mall/h5/images/det3.png',//活动图片 
        yugoutitle: '惊喜预购，限时抢购', //图片下的标题
        datatype:'4',//活动类型
      },
      {
        yugouimg: 'http://gzbingtai.qiyiyunshang.com/mall/h5/images/tuangou.png',//活动图片 
        yugoutitle: '团购活动', //图片下的标题
        datatype: '6',//活动类型
      },
      {
        yugouimg: 'http://gzbingtai.qiyiyunshang.com/mall/h5/images/xianshibaoyou.png',//活动图片 
        yugoutitle: '惊喜团，限时包邮', //图片下的标题
        datatype: '5',//活动类型
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    let that = this;
    query.select('.yugouimg').boundingClientRect(function (rect) {
      let imgheight=rect.width*0.56+"px";
      that.setData({
        imgheight: imgheight
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  todelurl (e){//跳转注销活动的页面
    let datatype = e.currentTarget.dataset.type;
    if(datatype==6){
      wx.navigateTo({
        url: '../activityproductlist/activityproductlist?type='+datatype,
      })
    } else if(datatype == 4){
      wx.navigateTo({
        url: '../promotiondetetails/promotiondetetails?type=' + datatype
      })
    } else if (datatype == 5){
      wx.navigateTo({
        url: '../promotiondetetails/promotiondetetails?type=' + datatype
      })
    } 
  }

})