// pages/productReview/productReview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewIndex:0,//tab下标
    pid:'',//产品id
    evaluateAttr:[//评论集合
      {
        portrait:'http://thirdwx.qlogo.cn/mmopen/Kj3VUTYPQibfwL7D3iaNs7qFQFqcQQ9amXbTG1GjkVSm9ciafMbYWWs3ap4hXBDiaT0fBA1wR9FpPiasIOm9Hic59Q6wialicvz1yGz2/132',
        name:'asdadsf',
        time:'2018-09-18',
        starLevel:'https://ssl.lucentury.cn/mall/images/star1.png',
        content:'asdfasdfasdfasdfasdfasdfasdfadsfsdfasdf',
        ImageCollection: [],//图片集合
      },
    ],
    NoComments:false,//暂无评论
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pid = options.pid;
    this.setData({
      pid:pid
    })
    this.loadComments(pid,'');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //点击切换tab
  review:function(obj){
    let index = obj.currentTarget.dataset.index;
    this.setData({
      reviewIndex: index
    });
    let pid = this.data.pid;
    if (index == 0){
      this.loadComments(pid,"");
    } else
    if (index == 1) {
      this.loadComments(pid,3);
    } else
    if (index == 2) {
      this.loadComments(pid, 2);
    } else
    if (index == 3) {
      this.loadComments(pid, 1);
    }
  },

  //渲染数据
  loadComments(pid, praise){
    let _this = this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/leaveCommentsList.do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        "id": pid,
        "praise": praise,
        "enterpriseCode": wx.getStorageSync('enterpriseCode'),
      },
      method: 'POST',
      success:function(res){
        console.log(JSON.stringify(res));
        let code = res.data.code;
        if (code == 1){
          let data = res.data.data;
          let appAttr = [];
          for (let i = 0; i < data.length; i++) {
            let attr = {
              portrait: 'https://ssl.lucentury.cn/mall/' + data[i].memberId.photo,
              name: data[i].memberId.name == null ? "-" : data[i].memberId.name,
              time: _this.toDate(data[i].commentsTime),
              starLevel: 'https://ssl.lucentury.cn/mall/images/star' + data[i].productComments +'.png',
              content: data[i].buyComments,
              ImageCollection: data[i].buyPicture.split(","),
            };
            appAttr.push(attr);
          }
          _this.setData({
            evaluateAttr: appAttr,
            NoComments: false
          });
        }else{
          _this.setData({
            evaluateAttr: [],
            NoComments:true
          });
        }
      }
    });
  },

  //转换时间戳
  toDate(number){
    let date = new Date(number);
    let Y = date.getFullYear() + '/';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return(Y+ M + D)
  },
})