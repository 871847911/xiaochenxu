// pages/paySuccess/paySuccess.js
const app = getApp();
var that;
var userId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("输入金额", options.price)
    var price = options.price
    that = this
    that.setData({
      price: options.price,
    });
    wx.request({
      url: app.globalData.service + '/coupon/getCouponListByUser?pageNo=' + '1' + '&userId=' + app.globalData.userId + '&pageSize=' + '100' + '&merchantId=' + app.globalData.sellerId + '&price=' + options.price,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function(res) {
        console.log("优惠券", res);
        var keyong = 0
        var bukeyong = 0
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].effectiveDateStart = that.toDate(res.data.list[i].effectiveDateStart)
          res.data.list[i].effectiveDateStop = that.toDate(res.data.list[i].effectiveDateStop)
          if (res.data.list[i].isUser == false) {
            bukeyong = bukeyong + 1
          }else{
            keyong = keyong +1
          }
        }
        that.setData({
          list: res.data.list,
          bukeyong: bukeyong,
          keyong: keyong
        });
      }
    })
  },

  toDate: function(number) {
    var n = number;
    var date = new Date(n);
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },

  clickCoupon: function(e) {
    that = this
    that.setData({
      key: e.currentTarget.dataset.index,
    });
    var priceid = that.data.list[e.currentTarget.dataset.index].type
    var priceRules = that.data.list[e.currentTarget.dataset.index].quota
    var price = that.data.price
    var id = that.data.list[e.currentTarget.dataset.index].id
    var rid = that.data.list[e.currentTarget.dataset.index].rid
    wx.navigateTo({
      url: '../payfor/payfor?priceid=' + priceid + '&priceRules=' + priceRules + '&price=' + price + '&id=' + id + '&rid=' + rid,
    })
  },
  /**
   * 不选优惠券
   */
  dontchose: function() {
    var that = this
    var price = that.data.price
    var priceRules = ''
    var priceid = ''
    wx.navigateTo({
      url: '../payfor/payfor?priceid=' + priceid + '&priceRules=' + priceRules + '&price=' + price,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})