//util.js

//数组去重
function removeRepeat(a) {
  var a1 = ((new Date).getTime())
  var b = [], n = a.length, i, j;
  for (i = 0; i < n; i++) {
    for (j = i + 1; j < n; j++) {
      if (a[i] === a[j]) { j = false; break; }
    }
    if (j) b.push(a[i]);
  }
  return b.sort(function (a, b) { return a - b });
}

//删除数组某个值
function removeAttr(a, b) {
  var index;
  for(let i=0;i<a.length;i++){
    if (a[i]==b){
      index = i;
      break;
    }
  }
  a.splice(index,1);
  return a;
}
//获取标准格式的年月日  例如：2018-09-09
function formatDate(now) {
  var v = new Date(now);
  var year = v.getFullYear();
  var month = (v.getMonth() + 1 < 10 ? '0' + (v.getMonth() + 1) : v.getMonth() + 1);
  var date = v.getDate() < 10 ? '0' + v.getDate() : v.getDate();
  return year + "-" + month + "-" + date;
}
//获取标准格式的年月日 时分秒 例如：2018-09-09 18:19
function formatTime(now) {
  var v = new Date(now);
  var year = v.getFullYear();
  var month = (v.getMonth() + 1 < 10 ? '0' + (v.getMonth() + 1) : v.getMonth() + 1);
  var date = v.getDate() < 10 ? '0' + v.getDate() : v.getDate();
  var hour = v.getHours() < 10 ? '0' + v.getHours() : v.getHours();
  var minute = v.getMinutes() < 10 ? '0' + v.getMinutes() : v.getMinutes();
  var second = v.getSeconds() < 10 ? '0' + v.getSeconds() : v.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
//弹窗     util.showModal('提示', '不能删除');
function showModal(titleTxt, contentTxt, showCancelVal, successCb) {
  wx.showModal({
    title: titleTxt,
    content: contentTxt,
    showCancel: showCancelVal,
    cancelText: "取消",
    confirmText: "确定",
    confirmColor: "#4797ca",
    success: function (res) {
      //isFunction(successCb) && successCb(res);
    }
  })
}

// 获取当前时间 例如：2018-09-09 18:19
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var minutes = date.getMinutes();
  var hours = date.getHours();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + hours + seperator2 + minutes;
  return currentdate;
}

//登录
function wxLogin(func) {
  // console.log(this)
  //调用登录接口
  //1.小程序调用wx.login得到code.
  var _this = this;
  wx.login({
    success: function (res) {
      var code = res['code'];
      //   console.log(code)
      //2.小程序调用wx.getUserInfo得到rawData, signatrue, encryptData.
      wx.getUserInfo({
        success: function (info) {
          // console.log(info);
          var rawData = info['rawData'];
          var signature = info['signature'];
          var encryptData = info['encryptData'];
          var encryptedData = info['encryptedData']; //注意是encryptedData不是encryptData...坑啊
          var iv = info['iv'];

          //3.小程序调用server获取token接口, 传入code, rawData, signature, encryptData.
          wx.request({
            url: 'https://im.17link.cc/PsyFace/login',
            data: {
              "code": code,
              "rawData": rawData,
              "signature": signature,
              "encryptData": encryptData,
              'iv': iv,
              'encryptedData': encryptedData
            },
            success: function (res) {
              // console.log(res)
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              } else {
                var session = res.data.session;
                var msg = {};
                msg.nick_name = res.data.nick_name;
                msg.avatar_url = res.data.avatar_url;
                wx.setStorage({    //session3rd存入微信缓存
                  key: "3rd_session",
                  data: session,
                  success: function () {
                    console.log('session3rd存入缓存')
                  }
                })
                wx.setStorage({    //session3rd存入微信缓存
                  key: "msg",
                  data: msg,
                  success: function () {
                    // console.log('个人信息存入缓存')
                  }
                })
              }
              typeof func == "function" && func(res.data);
            }
          });
        }
      });
    }
  });
} 
//解决小数相加丢失现象 调用方法 例如：util.addprinum(0.34, 0.312, 1)就是0.34+0.312+1
function addprinum() {
  var args = arguments,//获取所有的参数
    lens = args.length,//获取参数的长度
    d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
    sum = 0;//定义sum来接收所有数据的和
  //循环所有的参数
  for (let key in args) {//遍历所有的参数
    //把数字转为字符串
    let str = "" + args[key];
    if (str.indexOf(".") != -1) {//判断数字是否为小数
      //获取小数位的长度
      let temp = str.split(".")[1].length;
      //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
      d = d < temp ? temp : d;
    }
  }
  //计算需要乘的数值
  let m = Math.pow(10, d);
  //遍历所有参数并相加
  for (let key in args) {
    sum += args[key] * m;
  }
  //返回结果
  return sum / m;
}

//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.trim is not a function;
module.exports = {
  removeRepeat: removeRepeat,//数组去重
  removeAttr: removeAttr,//删除数组某个值
  formatDate: formatDate,//获取标准格式的年月日 
  formatTime: formatTime,//获取标准格式的年月日 时分秒
  showModal: showModal,//弹窗
  getNowFormatDate: getNowFormatDate,// 获取当前时间
  wxLogin: wxLogin,//登录
  addprinum: addprinum,//解决小数相加数据丢失现象
}