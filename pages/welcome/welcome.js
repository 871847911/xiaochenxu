const app = getApp();
var that;
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
    this.wxLogin();
    //获取个人信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  //获取个人
  getUserInfo: function (e) {
    console.log("个人", e);
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.switchTab({
      url: '../index/index'
    })
  },
  //微信登录
  wxLogin: function () {
    wx.login({
      success: function (res) {
        console.log("code", res.code);
        that.getOpid(res.code);
      }
    })
  },
  //获取微信opID
  getOpid: function (code) {
    console.log(app.globalData.appid)
    wx.request({
      url: app.globalData.service + "/wx/getUserOpenId",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        appid: app.globalData.appid,
        code: code
      },
      success: function (res) {
        console.log("appid", res);
      }
    })
  }
})