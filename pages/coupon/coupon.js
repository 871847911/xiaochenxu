// pages/paySuccess/paySuccess.js
const app = getApp();
var that;
var userId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.request({
      url: app.globalData.service + '/coupon/getCouponListByUser?pageNo=' + '1' + '&userId=' + app.globalData.userId+'&pageSize='+'100',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
       
      },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].effectiveDateStart = that.toDate(res.data.list[i].effectiveDateStart)
          res.data.list[i].effectiveDateStop = that.toDate(res.data.list[i].effectiveDateStop)
        }
        that.setData({
          list: res.data.list,
        });
      }
    })
  },

  toDate:function (number){
    var n= number;
    var date = new Date(n);
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return(Y+M + D)
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
  
  }
})