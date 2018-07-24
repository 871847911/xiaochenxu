// pages/technicianDetails/technicianDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skill:["","","","","","",""]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //跳转更多服务
  gohisService:function(){
    wx.navigateTo({
      url: '../hisService/hisService',
    })
  }
})