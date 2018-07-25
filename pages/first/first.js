//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var that;

Page({
  data: {
    imgUrls: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time: "",
    couponList: [],
    jishi: [],
    service: []
  },

  onLoad: function () {
    that = this;
    that.getloaction();
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    // var time = util.formatTime(new Date());
    var time = new Date();
    console.log("time", new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据

    this.addUser();

    this.addUserLog();

    this.bestTechnician();

    this.bestService();
    this.getslideshow();
    this.ifBindIphone();
    // this.getloaction();
    this.setData({
      time: time,
      storeName: app.globalData.storeName,
      coordinateAdress: app.globalData.coordinateAdress,
      storestatus: app.globalData.storestatus,
      callphone: app.globalData.callphone,
      zphone: app.globalData.zphone,
    });
    //页面标题为路由参数
    wx.request({
      url: app.globalData.service + '/brand/selectBrand',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "id": app.globalData.sellerId
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        console.log("品牌", res)
        if (res.data == '') {

        } else {
          wx.setNavigationBarTitle({
            title: res.data.name
          })
        }

      }
    })

  },
  //获取位置信息
  getloaction: function (e) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log("位置信息", res);
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        wx.request({
          url: app.globalData.service + '/wx/getDistance?storeId=' + app.globalData.storeId + '&long2=' + longitude + '&lat2=' + latitude,
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {

          },
          success: function (res) {
            if (res.data < 1) {
              that.setData({
                distance: ((res.data) * 1000).toFixed(0) + 'm',
              });
            } else {
              that.setData({
                distance: (res.data).toFixed(1) + 'km',
              });
            }

          }
        })
      }
    })
  },
  //点击进入具体位置信息
  golocation: function () {
    wx.openLocation({
      latitude: Number(app.globalData.addressY),
      longitude: Number(app.globalData.addressX)
    })
  },
  //上传后台个人信息位置

  //拿到距离信息

  //点击显示联系方式
  show_iphone: function () {
    that = this
    var phone = that.data.callphone
    var zphone = that.data.zphone
    wx.showActionSheet({
      itemList: [phone, zphone],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: that.data.callphone //仅为示例，并非真实的电话号码
          })
        } else {
          wx.makePhoneCall({
            phoneNumber: that.data.zphone //仅为示例，并非真实的电话号码
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //跳转预约页面
  goto_Order: function () {
    wx.request({
      url: app.globalData.service + '/orderAppointment/queryAppointmentsByOpenid?' + 'openid=' + app.globalData.openid + '&status=' + '0' + '&storeId=' + app.globalData.storeId,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function (res) {
        console.log("预约信息", res.data)
    
        if (res.data == '') {
          wx.navigateTo({
            url: '../order/order',
          })
        }else{
          var id = res.data[0].id
          wx.showModal({
            title: '提示',
            content: '您已经预约了一次服务，是否需要重新预约？',
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: app.globalData.service + '/orderAppointment/updateOrderAppointment',
                  method: "POST",
                  header: {
                    'content-type': 'application/json'
                  },
                  data: {
                    "cancelReason": "重新预约",
                    "id": id,
                    "status": 2
                  },
                  success: function (res) {
                    console.log("取消结果", res);
                    wx.navigateTo({
                      url: '../order/order',
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })

    console.log("dsadsad")

  },

  //访客记录
  addUserLog: function () {
    wx.request({
      url: app.globalData.service + "/userLog/addUserLog",
      method: "PUT",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "nickName": app.globalData.nickName,
        "openid": app.globalData.openid,
        "phone": "",
        "sellerId": app.globalData.sellerId,
        "visitTime": Date.parse(new Date())
      },
      success: function (res) {
        console.log("访客", res);
      }
    })
  },
  // 获取优惠卷列表
  getCouponList: function (e) {
    wx.request({
      url: app.globalData.service + "/coupon/getCouponAndStateByUserId",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "pageNo": 1,
        "pageSize": 2,
        "merchantId": app.globalData.sellerId,
        "userId": e
      },
      success: function (res) {
        console.log("获取优惠券", res)
        var list = res.data.list;
        for (var i = 0; i < list.length; i++) {
          list[i].effectiveDateStart = that.timestampToTime(list[i].effectiveDateStart);
          list[i].effectiveDateStop = that.timestampToTime(list[i].effectiveDateStop);
        }
        that.setData({
          couponList: list
        })
      }
    })
  },
  //跳转店铺详情页面
  goto_storedetails: function () {
    wx.navigateTo({
      url: '../storedetails/storedetails',
    })
  },
  //跳转买单页面
  goto_payfor: function () {
    wx.navigateTo({
      url: '../payfor/payfor',
    })
  },
  //跳转技师详情
  goto_technicianDetails: function (e) {
    console.log("技师", e.currentTarget.dataset.id);
    var jishi = that.data.jishi[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '../technicianDetails/technicianDetails?id=' + jishi.staff.id,
    })
  },
  //跳转服务详情
  goto_serviceDetails: function (e) {
    var service = that.data.service[e.currentTarget.dataset.id];
    wx.setStorage({
      key: 'servicelDetail',
      data: service
    });
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails',
    })
  },
  //时间转化
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';

    return Y + M + D;
  },
  //点击领取
  clilk_get: function (couponId, type) {
    if (app.globalData.ifBind == false) {//如果没有绑定
      wx.navigateTo({
        url: '../bindingPhoneNumber/bindingPhoneNumber',
      })
    } else {//如果绑定了则可以领取优惠卷
      wx.request({
        url: app.globalData.service + "/coupon/addCouponByUser?userId=" + app.globalData.userId + "&couponId=" + couponId + "&type=" + type,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

        },
        success: function (res) {
          console.log("领取优惠券", res)
          wx.showToast({
            title: res.data.retmsg,
            icon: 'none',
            duration: 2000
          })
          if (res.data.retmsg == "优惠券领取成功") {
            that.getCouponList(app.globalData.userId)
          }
        }
      })
    }

  },
  //点击领取动作
  onClilk: function (e) {
    console.log(e)
    var couponId = that.data.couponList[e.currentTarget.dataset.id].id;
    var type = that.data.couponList[e.currentTarget.dataset.id].type;
    console.log("领取", type, couponId, app.globalData.userId);
    that.clilk_get(couponId, type);
  },


  //推荐技师
  bestTechnician: function () {
    wx.request({
      url: app.globalData.service + "/staff/queryStaffServer",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "page": {},
        "staff": {
          "isRecommend": 1,
          isEnable: 1,
          "storeId": app.globalData.storeId
        }

      },
      success: function (res) {
        console.log("推荐技师", res.data);
        var jishi = res.data;
        for (var i = 0; i < jishi.length - 1; i++) {
          for (var j = 0; j < jishi.length - 1 - i; j++) {

            if (jishi[j].staff.recommendSequence > jishi[j + 1].staff.recommendSequence) {
              var temp = jishi[j];
              jishi[j] = jishi[j + 1];
              jishi[j + 1] = temp;
            }
          }
        }
        that.setData({
          jishi: jishi
        })
      }
    })
  },
  //推荐服务
  bestService: function () {
    wx.request({
      url: app.globalData.service + "/server/queryServerPage",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "page": {},
        "server": {
          "isRecommend": 1,
          isEnable: 1,
          "storeId": app.globalData.storeId
        }
      },
      success: function (res) {
        console.log("推荐服务", res.data.rows);
        var serves = res.data.rows
        for (var i = 0; i < serves.length - 1; i++) {
          for (var j = 0; j < serves.length - 1 - i; j++) {
            if (serves[j].recommendSequence > serves[j + 1].recommendSequence) {
              var temp = serves[j];
              serves[j] = serves[j + 1];
              serves[j + 1] = temp;
            }
          }
        }
        that.setData({
          service: res.data.rows
        })
      }
    })
  },
  //增加用户id
  addUser: function () {
    var globalData = app.globalData;
    console.log("gender", globalData.gender);
    wx.request({
      url: app.globalData.service + "/user/addUser",
      method: "PUT",
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: globalData.openid,
        nickName: globalData.nickName,
        sex: globalData.gender,
        sellerId: app.globalData.sellerId
      },
      success: function (res) {
        console.log("增加用户id", res.data);
        that.lookforUserId();
      }
    })
  },
  //通过opid查找用户id
  lookforUserId: function () {
    var globalData = app.globalData;
    wx.request({
      url: app.globalData.service + "/user/queryUserByOpenId",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: globalData.openid,
        sellerId: globalData.sellerId
      },
      success: function (res) {
        console.log("用户id", res);
        app.globalData.userId = res.data.id;
        that.getCouponList(res.data.id)
        wx.request({
          url: app.globalData.service + '/integral/everyLogAdd',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            "merchantId": app.globalData.sellerId,
            "userId": res.data.id
          },
          success: function (res) {
            console.log("日常登录+积分", res)

          }
        })
        if (res.data.phone != "") {
          globalData.phone = res.data.phone;
        }
      }
    })
  },
  //判断是否绑定手机号
  ifBindIphone: function () {
    wx.request({
      url: app.globalData.service + '/user/queryUserByOpenId',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        "sellerId": app.globalData.sellerId,
        "openId": app.globalData.openid,
      },
      success: function (res) {
        console.log(res)
        if (res.data.phone == null) {
          app.globalData.ifBind = false;
        } else {
          app.globalData.ifBind = true;
        }
      }
    })
  },
  //获取店面展示图
  getslideshow: function () {
    //获取店面展示图
    wx.request({
      url: app.globalData.service + "/material/querySlideshowByStore",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "id": app.globalData.storeId
      },
      success: function (res) {
        console.log("门店轮播图", res);
        var newarry = [];
        for (var i = 0; i < res.data.rows.length; i++) {
          newarry.push(res.data.rows[i].url)
        }
        that.setData({
          imgUrls: newarry
        })
      }
    })
  },
  getAllStore: function (id) {
    var that = this
    wx.request({
      url: app.globalData.service + "/store/queryById?storeId=" + id,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function (res) {

        console.log("门店信息", res.data);
        app.globalData.storeName = res.data.name;
        app.globalData.addressX = res.data.addressX;
        app.globalData.addressY = res.data.addressY;
        app.globalData.mapAdress = res.data.coordinateAdress;

        var openingTime = (res.data.openingTime).substr(0, 2)
        var closingTime = (res.data.closingTime).substr(0, 2)

        var oDate = new Date(); //实例一个时间对象；
        var now = oDate.getHours(); //获取系统时，

        if (res.data.status == 0) {
          if (now > Number(closingTime) || now < Number(openingTime)) {
            app.globalData.storestatus = "打烊"
          } else {
            app.globalData.storestatus = "正在营业"
          }
        } else {
          app.globalData.storestatus = "打烊"
        }


        app.globalData.openingTime = res.data.openingTime;
        app.globalData.closingTime = res.data.closingTime;
        that.setData({
          coordinateAdress: res.data.coordinateAdress,
          Adress: res.data.address,
          storeUrl: res.data.picUrl,
          storeName: res.data.name,
        })
        wx.request({
          url: app.globalData.service + "/region/selectRegionById?regionId=" + res.data.regionId,
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {

          },
          success: function (res) {
            console.log("门店省市区", res.data);
            app.globalData.coordinateAdress = res.data.region + that.data.Adress
            that.setData({
              Adress: res.data.region + that.data.Adress
            })
          }
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that = this;
    that.getloaction();
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    // var time = util.formatTime(new Date());
    var time = new Date();
    console.log("time", new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据

    this.addUser();

    this.addUserLog();

    this.bestTechnician();

    this.bestService();
    this.getslideshow();
    this.ifBindIphone();
    // this.getloaction();
    this.setData({
      time: time,
      storeName: app.globalData.storeName,
      coordinateAdress: app.globalData.coordinateAdress,
      storestatus: app.globalData.storestatus,
      callphone: app.globalData.callphone,
      zphone: app.globalData.zphone,
    });
    //页面标题为路由参数
    wx.request({
      url: app.globalData.service + '/brand/selectBrand',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "id": app.globalData.sellerId
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        console.log("品牌", res)
        if (res.data == '') {

        } else {
          wx.setNavigationBarTitle({
            title: res.data.name
          })
        }

      }
    })
    wx.stopPullDownRefresh()
  },

})