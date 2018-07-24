// pages/personalCenter/personalCenter.js
var app = getApp();
var formid;
var gender;
var nickName;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
    gender: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    that.getJifen()
    that.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName,
      gender: app.globalData.gender
    })
    
  },
  /**
   * 生命周期函数--监听下拉
   */
  onPullDownRefresh: function () {
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName,
      gender: app.globalData.gender
    })
    wx.stopPullDownRefresh()
  },
  //获取积分
  getJifen: function () {
    var that = this
    wx.request({
      url: app.globalData.service + "/integral/integralList",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        userId: app.globalData.userId,
        merchantId: app.globalData.sellerId,
        pageSize: 100,
        pageNo: 1,
      },
      success: function (res) {
        if (res.data.list == '') {
          that.setData({
            integral: 0
          });
        } else {
          that.setData({
            integral: res.data.list[0].surplusNumber
          });
        }

      }
    })
  },
  go_person:function(){
    wx.navigateTo({
      url: '../personMsg/personMsg',
    })
  },
  //
  goto_coupon:function(){
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  //
  goto_myReservation:function(){
    wx.navigateTo({
      url: '../myReservation/myReservation',
    })
  }
})