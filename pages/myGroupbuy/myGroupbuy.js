// pages/myGroupbuy/myGroupbuy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'BwLtwISfvI7mV6UFFGIW6Q==',
    enterpriseCode:'CSGL12345665432',
    loadata:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   uid: wx.getStorageSync('uid'),
    //   enterpriseCode: wx.getStorageSync('enterpriseCode'),
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this=this;
    _this.loaddate();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onShareAppMessage:function(){
    return {
      title: '参与拼团，购买好品',
      path: 'pages/index/index',
      imageUrl:'http://gzbingtai.qiyiyunshang.com/mall/h5/images/tuangou.png',
      success(e){
        wx.showShareMenu({
          withShareTicket:true
        })
      },fail(e){

      },
      complete(){

      }
    } 
  },
  loaddate(){
    var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/selectClienRealtionByGroupBookingId.do', //接口地址
      data: {
        "cliens": _this.data.uid,
        "isInitiator": 2,
        "enterpriseCode":_this.data.enterpriseCode
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
       if(res.data.code==1){
         var data=res.data.data;
         for(var i=0;i<data.length;i++){
           var endtime = new Date(data[i].activity.endTime.substring(0, 10));// 活动结束时间
           var currenttime = new Date();// 当前系统时间
           var numtime = endtime.getTime() + 24 * 3600 * 1000 - currenttime.getTime(); // 是否过期
           data[i].numcont = data[i].activity.groupCount - data[i].count;
           data[i].proportion = (data[i].count/ data[i].activity.groupCount)*100+"%";
           data[i].numtime = numtime;
           
         }
         data.push(data[0]);
         data.push(data[0]);
         _this.setData({
           loadata:data,
         });
       }
      }
    })
  },
  payorder(e){//点击付款
  var _this=this;
  console.log(e);
    let pid, spaceid, spacename, purchareCount, relationId, productPrice, groupBookingId;
    pid = e.currentTarget.dataset.pid;// 产品id
    spaceid = e.currentTarget.dataset.spaceid;// 规格id
    spacename = e.currentTarget.dataset.spacename;// 规格名称
    purchareCount = e.currentTarget.dataset.purcharecount;// 数量
    relationId = e.currentTarget.dataset.relationid; // 关系id
    productPrice = e.currentTarget.dataset.productprice; // 商品价格
    groupBookingId = e.currentTarget.dataset.groupbookingid; // 拼团id
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/insertShopcar.do', //接口地址
      data: {
        "memberId.id": _this.data.uid,
        "productId.id": pid,
        "productNumber": purchareCount,
        "spec": spacename,
        "specId": spaceid,
        "enterpriseCode": _this.data.enterpriseCode,
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 1) {
          var carIds = res.data.data;
          wx.navigateTo({
            url: "../OrderToDetermine/OrderToDetermine?post=0&price=" + productPrice + "&carId=" + carIds + "&pid=" + pid + "&groupBookingId=" + groupBookingId + "&relationId=" + relationId + "&type=3",
          })
          // location.href = "determinegroupbuy.html?post=0&uid=" + $.getUrlParam("id") + "&price=" + productPrice + "&carId=" + carIds + ",&pid=" + pid
          //   + "&enterpriseCode=" + $.getUrlParam("enterpriseCode") + "&groupBookingId=" + groupBookingId + "&relationId=" + relationId + "&type=3";
        }
      }
    });

  },
  //图片路径错误替换图片
  errorFunction: function (obj) {
    var _this=this;
    if (obj.type == 'error') {
      let index = obj.target.dataset.index; //获取错误图片循环的下标
      let loadata = _this.data.loadata; 　　　　　　　//将图片列表数据绑定到变量
      loadata[i].activityProduct.activityProductImage = 'images/xiaochengxv/no_product.png'; 
      //错误图片替换为默认图片
      _this.setData({
        loadata: loadata
      })
    }
  },
})