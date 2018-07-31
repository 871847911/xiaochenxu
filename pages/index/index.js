// pages/welcome/welcome.js
const app = getApp();
var that;
var opid;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    //获取个人信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    //获取ext
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          //获取商户信息
          app.globalData.sellerId = res.extConfig.sellerId
          that.getStoreMsg(res.extConfig.sellerId);
          var sellerId = res.extConfig.sellerId
          //商户信息
          wx.request({
            url: app.globalData.service + "/seller/queryById?sellerId=" + res.extConfig.sellerId,
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {


            },
            success: function (res) {
              console.log("商户信息", res.data);
              app.globalData.appid = res.data.appId;
              that.wxLogin(sellerId);
            }
          })
        }
      })
    }


  },
  //获取个人
  getUserInfo: function (e) {
    console.log("个人", e);
    app.globalData.userInfo = e.detail.userInfo;
    app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
    app.globalData.nickName = e.detail.userInfo.nickName;
    app.globalData.gender = e.detail.userInfo.gender;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    wx.switchTab({
      url: '../first/first'
    })

  },
  //微信登录
  wxLogin: function (sellerId) {
    wx.login({
      success: function (res) {
        that.getOpid(res.code, sellerId);
      }
    })
  },
  //获取微信opID
  getOpid: function (code, sellerId) {
    console.log("sellerId", sellerId)
    console.log("code", code)
    wx.request({
      url: app.globalData.service + "/wx/getUserOpenId",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        sellerId: sellerId,
        code: code

      },
      success: function (res) {
        console.log("oppenid",res)
        console.log("opid", res.data.openid);
        app.globalData.openid = res.data.openid;
        opid = app.globalData.openid;
      }
    })
  },
  //通过商家信息获得门店信息
  getStoreMsg(id) {
    wx.request({
      url: app.globalData.service + "/store/queryStoreBySeller?sellerId=" + app.globalData.sellerId,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function (res) {
        console.log("门店名字和id", res.data[0]);
        app.globalData.storeId = res.data[0].id;
        app.globalData.storeName = res.data[0].name;
        that.getAllStore(res.data[0].id);

      }
    })
  },
  //通过门店ID找门店信息
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
        app.globalData.callphone = res.data.phone;
        if (res.data.zoneNum == '' || res.data.zoneNum == null) {
          app.globalData.zphone = res.data.zphone
        } else if (res.data.zphone == '' || res.data.zphone == null) {
          app.globalData.zphone = res.data.zoneNum
        } else {
          app.globalData.zphone = res.data.zoneNum + '-' + res.data.zphone;
        }

        if (res.data.phone == '' || res.data.phone == null) {
          app.globalData.ifBind = false
        } else {
          app.globalData.ifBind = true
        }

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

})