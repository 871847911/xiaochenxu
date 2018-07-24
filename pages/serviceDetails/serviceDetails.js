// pages/paySuccess/paySuccess.js
var WxParse = require('../../wxParse/wxParse.js');
var that = this;
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
    wx.navigateTo({
      url: '../order/order?id=' + that.data.id + "&serviceName=" + that.data.name,
    })
  }
})