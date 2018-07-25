// pages/order/order.js
const app = getApp();
var that;
var count = 0;
var serviceDayNum = 0;
var dayNum = 0;
var chosetimes;
var timesTodDay;
var changeId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    people: [1, 2, 3, 4, 5],
    customerNumber: 1, //选择人数
    name: "",
    phone: "",
    storeName: "",
    jishiName: "不指定技师",
    serverName: "不指定服务",
    isAcceptStaffs: "1", //是否指定
    serviceDate: "请选择服务时间段",
    staffId: '', //预约接口技师id,
    serverId: "",
    serviceTime: "",
    startTime: "",
    serviceDay: [],
    day: [],
    chosedate: 0,
    chosetime: 0,
    cartArr: ["1"],
    ifChange: false,
    year: "请选择服务时间段",
    week: "",
    chosetimes: "",
    hours: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this;
    this.setData({
      storeName: app.globalData.storeName,
      phone: app.globalData.phone,
    })
    if (options.make != null) { //修改字段
      changeId = options.id;
      that.dealTimes();
      wx.getStorage({
        key: 'changerReservation',
        success: function (res) {
          console.log("changerReservation", res);
          var data = res.data;
          // console.log(data.startTime.time.split(" "));
          var riqi = data.startTime.time.split(" ");
          that.setData({
            make: options.make,
            name: data.userName,
            phone: data.phone,
            sellerId: data.sellerId,
            serverId: data.serverId,
            serverName: data.serverName,
            staffId: data.staffId,
            jishiName: data.staffName,
            year: riqi[0],
            week: riqi[3],
            chosetimes: riqi[1],
            isAcceptStaffs: data.isAcceptStaffs
          })
        },
      })


    } else {
      that.setData({
        serverId: options.id,
        serverName: options.serviceName,
        storeName: app.globalData.storeName

      })

      if (options.staffId != null) {
        that.setData({
          staffId: options.staffId,
          jishiName: options.jishiName,
          storeName: app.globalData.storeName
        })
      }
      this.dealTimes();

    }
    this.setDate();
  },
  //选择人数
  chosenum: function (e) {
    console.log(e.currentTarget.dataset.id);
    this.setData({
      customerNumber: e.currentTarget.dataset.id
    })


  },
  //浮尘效果
  setModalStatus: function (e) {

    // console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      var day = that.data.day;

      chosetimes = day[0] + ":00-" + Number(Number(day[0]) + 1) + ":00";
      this.setData({
        showModalStatus: true,
        year: that.data.serviceDay[0].date,
        week: that.data.serviceDay[0].week,
        chosetimes: chosetimes
      });
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false,

        });
      }
    }.bind(this), 200)


  },
  //选择日期周几
  chose_date: function (e) {
    serviceDayNum = e.currentTarget.dataset.id;

    this.setData({
      chosedate: e.currentTarget.dataset.id,
      year: that.data.serviceDay[serviceDayNum].date,
      week: that.data.serviceDay[serviceDayNum].week,
      // startTime: startTime
    })
  },
  //选一天去时间
  chose_time: function (e) {
    dayNum = e.currentTarget.dataset.id;
    var day = that.data.day;
    timesTodDay = day[e.currentTarget.dataset.id];
    chosetimes = day[e.currentTarget.dataset.id] + ":00-" + Number(Number(day[e.currentTarget.dataset.id]) + 1) + ":00";
    console.log("...", chosetimes);
    this.setData({
      chosetime: e.currentTarget.dataset.id,
      chosetimes: chosetimes
    })
  },
  //跳转选择技师页面
  chose_technician: function () {
    that = this
    wx.navigateTo({
      url: '../technician/technician?serverId=' + that.data.serverId,
    })
  },
  //进入选择服务界面
  gotoService: function () {
    that = this
    wx.navigateTo({
      url: '../choseservice/choseservice?staffId=' + that.data.staffId

    })
  },
  //点击预约
  order: function () {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (that.data.name == "") { //姓名为空
      wx.showToast({
        title: '请填写姓名',
        icon: "none"
      })

    } else if (that.data.phone == "") { //
      wx.showToast({
        title: '请填写手机号码',
        icon: "none"
      })
    } else if (!myreg.test(that.data.phone)) {

      wx.showToast({
        title: '请填写正确手机号码',
        icon: "none"
      })
    } else if (that.data.year == "" || that.data.week == "" || that.data.chosetimes == "") {
      wx.showToast({
        title: '请重新选择时间',
        icon: "none"
      })
    } else {
      if (that.data.serverName == null) {
        that.setData({
          serverName: "不指定服务"
        })
      }

      var newTime = that.data.serviceDay[serviceDayNum].date + " " + that.data.day[dayNum] + ":00:00";
      // console.log("newTime", newTime);
      // var str = newTime.toString();
      // str = str.replace("/-/g", "/");
      // //// str =  str.replace("T"," "); 
      newTime = newTime.replace(/-/g, ':').replace(' ', ':');
      newTime = newTime.split(':');
      var newTime1 = new Date(newTime[0], (newTime[1] - 1), newTime[2], newTime[3], newTime[4], newTime[5]);
      // console.log("newTime1" + newTime1);
      // var startTime = new Date(newTime1);
      console.log("startTime:", newTime1)

      wx.request({
        url: app.globalData.service + "/orderAppointment/addOrderAppointment",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

          // "customerId": app.globalData.userId,//用户id
          "customerNumber": that.data.customerNumber,
          "isAcceptStaffs": that.data.isAcceptStaffs, //是否接受非指定
          "phone": that.data.phone,
          "sellerId": app.globalData.sellerId, //商家id
          "serverId": that.data.serverId,
          "serverName": that.data.serverName,
          "staffId": that.data.staffId,
          "staffName": that.data.jishiName,
          "startTime": newTime1,
          "status": 0,
          "storeId": app.globalData.storeId,
          "userName": that.data.name,
          "storeName": app.globalData.storeName,
          "openid": app.globalData.openid

        },
        success: function (res) {
          console.log("========>", chosetimes)

          console.log("预订", res);
          wx.redirectTo({
            url: '../orderSuccess/orderSuccess?customerNumber=' + that.data.customerNumber + "&userName=" + that.data.name + "&phone=" + that.data.phone + "&staffName=" + that.data.jishiName + "&isAcceptStaffs=" + that.data.isAcceptStaffs + "&serverName=" + that.data.serverName + "&year=" + that.data.serviceDay[serviceDayNum].date + "&week=" + that.data.serviceDay[serviceDayNum].week + "&chosetimes=:" + chosetimes,
          })
        }


      })
    }

  },
  //提交表单
  formSubmit: function (e) {
    console.log("form发生了submit事件", e)
  },
  change: function (e) {

    count = count + 1
    if (count % 2 == 1) {
      console.log("change", 0); //不接受非指定技师服务
      that.setData({
        isAcceptStaffs: 0
      })
    } else {
      console.log("change", 1); //可以接受非指定技师服务
      that.setData({
        isAcceptStaffs: 1
      })
    }

  },
  //输入名字
  bipName: function (e) {
    console.log("name:", e.detail.value);
    var name = e.detail.value;
    if (name.length > 10) {
      console.log("名字已达最大长度")
    } else {
      that.setData({
        name: name
      })
    }
  },
  // 输入电话
  bipPhone: function (e) {
    console.log("phone:", e.detail.value);
    var phone = e.detail.value;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;

    if (phone.length > 11) {
      console.log("电话")

    } else {
      that.setData({
        phone: phone
      })
    }
  },
  //处理门店营业时间
  dealTimes: function () {
    var start;
    var close;
    var day = [];
    var openingTime = app.globalData.openingTime;
    var optimes = openingTime.split(":");
    console.log("optimes", optimes);
    if (optimes[1] != "00") {
      start = Number(optimes[0]) + 1;
    } else {
      start = Number(optimes[0])
    }

    var closingTime = app.globalData.closingTime;
    var cltimes = closingTime.split(":");
    close = cltimes[0] + "";
    var myDate = new Date();
    var hours = myDate.getHours();
    console.log("hours", hours);
    for (var i = start; i <= close - 1; i++) {

      if (i != 24) {
        day.push(i);
      }

    }

    that.setData({
      day: day,
      hours: hours
    })
    console.log("-", day);
  },
  getDateStr: function (today, addDayCount) {
    var dd;
    if (today) {
      dd = new Date(today);
    } else {
      dd = new Date();
    }
    dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    };
    return y + "-" + m + "-" + d;
  },
  // 判断周几
  dateLater: function (dates) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate());
    let day = date.getDay();
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    return dateObj;
  },
  //获取当前日期

  //设置弹出层时间
  setDate: function () {
    var that = this

    var dateList = []
    var weekday = []
    for (var i = 0; i < 7; i++) {
      var date = that.getDateStr(null, i)
      var week = that.dateLater(that.getDateStr(null, i)).week
      dateList.push({ date, week })

    }
    dateList[0].week = "今天"
    dateList[1].week = "明天"
    console.log("当前时间", dateList)
    that.setData({
      serviceDay: dateList
    })
  },
  //修改预约 /orderAppointment/updateOrderAppointment
  changeOrder: function () {
    wx.showLoading({
      title: '加载中',
    })
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (that.data.name == "") { //姓名为空
      wx.showToast({
        title: '请填写姓名',
        icon: "none"
      })

    } else if (that.data.phone == "") { //
      wx.showToast({
        title: '请填写手机号码',
        icon: "none"
      })
    } else if (!myreg.test(that.data.phone)) {

      wx.showToast({
        title: '请填写正确手机号码',
        icon: "none"
      })
    } else if (that.data.year == "" || that.data.week == "" || that.data.chosetimes == "") {
      wx.showToast({
        title: '请重新选择时间',
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      if (that.data.serverName == null) {
        that.setData({
          serverName: "不指定服务"
        })
      }
      var newTime = that.data.serviceDay[serviceDayNum].date + " " + that.data.day[dayNum] + ":00:00";
      // console.log("newTime", newTime);
      // var str = newTime.toString();
      // str = str.replace("/-/g", "/");
      // //// str =  str.replace("T"," "); 
      newTime = newTime.replace(/-/g, ':').replace(' ', ':');
      newTime = newTime.split(':');
      var newTime1 = new Date(newTime[0], (newTime[1] - 1), newTime[2], newTime[3], newTime[4], newTime[5]);
      console.log("startTime", newTime1)
      wx.request({
        url: app.globalData.service + "/orderAppointment/updateOrderAppointment",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

          // "customerId": app.globalData.userId,//用户id
          "customerNumber": that.data.customerNumber,
          "isAcceptStaffs": that.data.isAcceptStaffs, //是否接受非指定
          "phone": that.data.phone,
          "sellerId": app.globalData.sellerId, //商家id
          "serverId": that.data.serverId,
          "serverName": that.data.serverName,
          "staffId": that.data.staffId,
          "staffName": that.data.jishiName,
          "startTime": newTime1,
          "status": 0,
          "storeId": app.globalData.storeId,
          "userName": that.data.name,
          "storeName": app.globalData.storeName,
          "openid": app.globalData.openid,
          id: changeId

        },
        success: function (res) {
          console.log("========>", chosetimes)
          wx.hideLoading()
          console.log("修改预订", res);
          wx.redirectTo({
            url: '../orderSuccess/orderSuccess?customerNumber=' + that.data.customerNumber + "&userName=" + that.data.name + "&phone=" + that.data.phone + "&staffName=" + that.data.jishiName + "&isAcceptStaffs=" + that.data.isAcceptStaffs + "&serverName=" + that.data.serverName + "&year=" + that.data.serviceDay[serviceDayNum].date + "&week=" + that.data.serviceDay[serviceDayNum].week + "&chosetimes=:" + chosetimes,
          })
        }


      })
    }
  }
})