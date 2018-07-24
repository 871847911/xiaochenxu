// pages/personMsg/personMsg.js
var app = getApp();
var formid;
var gender;
var sellerId;
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
    if (app.globalData.gender == 1) {
      gender = "男";
    }
    else if (app.globalData.gender == 2) {
      gender = "女";
    } else {
      gender = "无"
    }
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName,
      gender: gender
    })

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
        if (res.data.phone == null || res.data.phone == '') {
          app.globalData.ifBind = false;
          that.setData({
            phoneNum: '去绑定'
          });
        } else {
          app.globalData.ifBind = true;
          that.setData({
            phoneNum: res.data.phone
          });
        }
      }
    })
  },
  //跳转绑定个人信息
  bindPhone: function () {
    wx.navigateTo({
      url: '../bindingPhoneNumber/bindingPhoneNumber',
    })
  }
})