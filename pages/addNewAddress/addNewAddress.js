// pages/addNewAddress/addNewAddress.js
//获取应用实例
var areaInfo = [];//所有省市区县数据
var t = 0;
var show = false;
var moveY = 200;
Page({
  data: {
    id:'',//收货地址id
    uid: '',//用户id
    enterpriseCode: '',//企业id
    personname: '',  //联系人姓名
    socialAccount: '',//联系人电话
    marktext:'',//地址详情
    address_tetx: '请填写收货地址',//收货地址
    provinceCode:'',//省编码
    cityCode: '',//市编码
    districtCode: '',//区编码
    show: show,
    provinces:[],//省
    citys: [],//市
    countys: [],//区
    value: [],//选中值，刚开始的时候与初始值相等，选中省份的时候改变
  },
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
    let id = options.id;
    if (id) {//编辑
      _this.loadpersonmessage(id);
      _this.setData({
        id: id,
      });
    }else{//新增
      //加载地址
      _this.lodeaddress();
    }
  },
  // ------------------- 分割线 --------------------
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //获取id 地址下的个人信息
  loadpersonmessage(id){
    var _this=this;
    wx.request({
      url: 'https://ssl.lucentury.cn/mall/h5/memberAddressById.do', //接口地址
      data:{
        id:id
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code==1) {
          var data=res.data.data;
          let personname, socialAccount, address_tetx, marktext, provinceCode, cityCode, districtCode;
          personname = data.contactName;
          socialAccount = data.contactPhone;
          address_tetx = data.province + ',' + data.city + ',' + data.district;
          marktext = data.name;
          provinceCode = data.provinceCode;
          cityCode = data.cityCode;
          districtCode = data.districtCode;
          _this.setData({
            personname: personname,
            socialAccount: socialAccount,
            address_tetx: address_tetx,
            marktext: marktext,
            provinceCode: provinceCode,
            cityCode: cityCode,
            districtCode: districtCode,
          });
           //加载地址
          _this.lodeaddress();
        }
      }
    })
  },
  //获取地址数据
  lodeaddress(){
      var _this = this;
      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/getCityData.do', //接口地址
        method: 'GET',
        success: function (res) {
          if(res.data){
            areaInfo = res.data;
            let id = _this.data.id;
            let provinces, citys, countys, value;
            if (id) {//编辑
              let provinceCode,cityCode, districtCode;
              provinceCode = _this.data.provinceCode;
              cityCode = _this.data.cityCode;
              districtCode = _this.data.districtCode;

              provinces = getarrcity(86);
              citys = getarrcity(provinceCode);
              countys = getarrcity(cityCode);
              value = [];
              for (let i = 0; i < provinces.length;i++){
                if (provinces[i].code ==provinceCode){
                  value[0]=i;
                }
              }
              for (let i = 0; i < citys.length; i++) {
                if (citys[i].code ==cityCode) {
                  value[1] = i;
                }
              }
              for (let i = 0; i < countys.length; i++) {
                if (countys[i].code ==districtCode) {
                  value[2] = i;
                }
              }            
            } else {//新增
              //默认数据的第一个，北京市，，，，，
              provinces = getarrcity(86);
              citys = getarrcity(110000);
              countys = getarrcity(110100);
              value=[0,0,0];
            }
          //同事设置无效，必须分开设置
            _this.setData({
              provinces: provinces,
              citys: citys,
              countys: countys,
            });
            _this.setData({
              value: value,
            });
          }
        }
      })
  },
  //点击保存，新增
  formSubmit(e){
    var _this=this;
    let value = _this.data.value;
    let provinces = _this.data.provinces;
    let citys = _this.data.citys;
    let countys = _this.data.countys;
    let id=_this.data.id;
    if(id){//修改
      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/updateMemberAddress.do', //接口地址
        data: {
          'id':id,
          "name": e.detail.value.marktext,
          "province": provinces[value[0]].name,
          "provinceCode": provinces[value[0]].code,
          "city": citys[value[1]].name,
          "cityCode": citys[value[1]].code,
          "district": countys[value[2]].name,
          "districtCode": countys[value[2]].code,
          "contactName": e.detail.value.personname,
          "contactPhone": e.detail.value.socialAccount,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == "1") {
            wx.showToast({
              title: '修改地址成功',
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                    success: function () {
                      var pages = getCurrentPages();
                      var currPage = pages[pages.length - 1];   //当前页面
                      currPage.selectdata();//调用返回后的页面，刷新渲染
                    }
                  })
                }, 500);
              }
            });
          }
        }
      })

    }else{//新增

      wx.request({
        url: 'https://ssl.lucentury.cn/mall/h5/insertMemberAddress.do', //接口地址
        data: {
          "name": e.detail.value.marktext,
          "province": provinces[value[0]].name,
          "provinceCode": provinces[value[0]].code,
          "city": citys[value[1]].name,
          "cityCode": citys[value[1]].code,
          "district": countys[value[2]].name,
          "districtCode": countys[value[2]].code,
          "encryptMemberId": _this.data.uid,
          "contactName": e.detail.value.personname,
          "contactPhone": e.detail.value.socialAccount,
          "enterpriseCode": _this.data.enterpriseCode,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == "1") {
            wx.showToast({
              title: '新增地址成功',
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                    success: function () {
                      var pages = getCurrentPages();
                      var currPage = pages[pages.length - 1];   //当前页面
                      currPage.selectdata();//调用返回后的页面，刷新渲染
                    }
                  })
                }, 500);
              }
            });
          }
        }
      })
    }
  },
  //滑动事件
  bindChange: function (e) {
    var _this=this;  
    var val = e.detail.value
    let value = _this.data.value;
    let provinces = _this.data.provinces;
    let citys = _this.data.citys;
    let countys = _this.data.countys;
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (value[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      citys = getarrcity(provinces[val[0]].code);//获取地级市数据
      countys = getarrcity(citys[val[1]].code);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (value[1] != val[1]) {
        val[2] = 0;
        countys = getarrcity(citys[val[1]].code);
      }
    }
    //更新数据
     _this.setData({
       value: val,
       citys: citys,
       countys: countys
     })

  },
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    animationEvents(this, moveY, show);
  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    var _this=this;
    let id = e.currentTarget.dataset.id;
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
    if (id =='sure'){
      let value = _this.data.value;
      let provinces = _this.data.provinces;
      let citys = _this.data.citys;
      let countys = _this.data.countys;
      let address_tetx = provinces[value[0]].name + "," + citys[value[1]].name + "," + countys[value[2]].name;
      _this.setData({
        address_tetx: address_tetx
      });
    }
  },
})

//动画事件
function animationEvents(that, moveY, show) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()
  that.setData({
    animation: that.animation.export(),
    show: show
  })
}

// ---------------- 分割线 ---------------- 
//获取数组,对应的城市或市区
function getarrcity(code){ 
  var data=[];
  for (var i in areaInfo){
    if (i==code){
      for (var k in areaInfo[i]) {
        var objdata = {};
        objdata.code=k;
        objdata.name = areaInfo[i][k];
        data.push(objdata);
      }
      return data;
    }
  }
}
