// pages/paySuccess/paySuccess.js
var WxParse = require('../../wxParse/wxParse.js');
var that = this;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",
    name: "",
    price: "",
    serverUrl: "",
    detail: "",
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    console.log("options", options);
    wx.getStorage({
      key: 'servicelDetail',
      success: function (res) {
        console.log("servicelDetail", res.data);
        that.setData({
          name: res.data.name,
          price: res.data.price,
          serverUrl: res.data.serverUrl,
          id: res.data.id
        })
        var article = res.data.detail
        WxParse.wxParse('article', 'html', article, that, 16);
      },
    })

   
    
   
  },
  gotoOrder: function () {
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
            url: '../order/order?id=' + that.data.id + "&serviceName=" + that.data.name,
          })
        } else {
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
                      url: '../order/order?id=' + that.data.id + "&serviceName=" + that.data.name,
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
    
  }
})