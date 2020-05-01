// pages/evaluateOrder/evaluateOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    saleId:'',  
    code:'',
    uid: '',
    enterpriseCode:'',
    deleteimg:"https://ssl.lucentury.cn/mall/images/deleteimg.png", //删除图片的按钮
    uploadimg: "https://ssl.lucentury.cn/mall/images/uploadingimg.png",//上传图片的按钮
    uplimglist: [],                                                         //存放上传的图片的src
    xingimg:[                                                              //星星图片
      "https://ssl.lucentury.cn/mall/images/star1.png",
      "https://ssl.lucentury.cn/mall/images/star2.png",
      "https://ssl.lucentury.cn/mall/images/star3.png",
      "https://ssl.lucentury.cn/mall/images/star4.png",
      "https://ssl.lucentury.cn/mall/images/star5.png"
    ],
    clickxingarr:['1','2','3','4','5'],                                   //5个小星星
    describeimg:'https://ssl.lucentury.cn/mall/images/star0.png',    //描述选中的星星
    logistics: 'https://ssl.lucentury.cn/mall/images/star0.png',     //物流选中的星星
    manner: 'https://ssl.lucentury.cn/mall/images/star0.png',        //态度选中的星星
    ckdescribe:'0', //描述，物流等服务的打分
    cklogistics:'0',
    ckmanner:'0',
    buyComments:'',//评价的文本
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
      id: options.id,
      saleId: options.saleId,
      code: options.code,
    });
  },
  uploadimages (){//上传评价图片
    var that=this;
    wx.chooseImage({
      count:9,
      sourceType:['album'],
      success: function (res) {
        let uplimglist = that.data.uplimglist;
        var tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length;i++){
          if (uplimglist.length<9){
            uplimglist.push(tempFilePaths[i]);
          }else{
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '您最多只能上传9张图片！',
              success: function (res) {
              }
            })
          }
        }
        that.setData({
          uplimglist: uplimglist
        });
      }
    })
  },
  previewimage (e){//预览上传时候的图片
    let imgurl=e.currentTarget.dataset.iamgeurl;
    let urls = this.data.uplimglist;
    wx.previewImage({
      current: imgurl, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  deleimgup (e){ //删除图片
    var _this=this;
    const index=e.currentTarget.dataset.index;
    let uplimglist = _this.data.uplimglist;
    uplimglist.splice(index,1);
    _this.setData({
      uplimglist: uplimglist
    });
  },
  ckdescribe(e) {//点击描述相符 打分
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let xingimg = _this.data.xingimg;
    let describeimg = xingimg[index];
    _this.setData({
      describeimg: describeimg,
      ckdescribe:index+1,
    });
  },
  cklogistics(e) {//点击物流服务 打分
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let xingimg = _this.data.xingimg;
    let logistics = xingimg[index];
    _this.setData({
      logistics: logistics,
      cklogistics:index+1,
    });
  },
  ckmanner(e) {//点击态度服务 打分
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let xingimg = _this.data.xingimg;
    let manner = xingimg[index];
    _this.setData({
      manner: manner,
      ckmanner:index+1,
    });
  },
  userBox(e){//填写评价信息
    var _this=this;
    var buyComments = e.detail.value;
    _this.setData({
      buyComments: buyComments,
    });
  },
  //提交评价订单
  evaluateOrder(){
    var _this=this;
    console.log(_this.data.cklogistics);
    if (_this.data.ckdescribe == 0) {
      wx.showToast({
        title: '请给描述评分'
      });
      return;
    }
    if (_this.data.cklogistics == 0) {
      wx.showToast({
        title: '请给物流评分'
      });
      return;
    }
    if (_this.data.ckmanner==0){
      wx.showToast({
        title: '请给态度评分'
      });
      return;
    }
    var buyPicture='';
    let uplimglist = _this.data.uplimglist;
    for (let i = 0; i < uplimglist.length;i++){
      buyPicture += uplimglist[i]+',';
    }
    var data={
      "enterpriseCode":_this.data.enterpriseCode,
      "productId.id":_this.data.id,
      "memberId.id":_this.data.uid,
      "isReply":'2',
      "sellReply":'',
      "code":_this.data.code,
      "productComments": _this.data.ckdescribe,
      "logisticsService": _this.data.cklogistics,
      "serviceAttitude": _this.data.ckmanner,
      "buyComments": _this.data.buyComments,
      "buyPicture": buyPicture,
    };
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/updateAppraiseTime.do', //接口地址
      data: {
        "saleId": _this.data.saleId
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 1) {
           wx.request({
             url: 'https://ssl.lucentury.cn/mall/h5/insertLeaveComments.do', //接口地址
             data: data,
             method: 'POST',
             header: {
               "Content-Type": "application/x-www-form-urlencoded"
             },
             success: function (res) {
               if (res.data.code == 1) {          
                 wx.showToast({
                   title: '订单评价成功'
                 });
                    wx.redirectTo({
                    url: '../myOrder/myOrder?index=' + 3
                  })
               }
             }
           });
        }
      }
    });
  }
  
})