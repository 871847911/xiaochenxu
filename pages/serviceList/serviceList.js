// pages/serviceList/serviceList.js
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
  
  },
  //点击进入具体位置信息
  getlocation: function () {
    wx.openLocation({

      latitude: 29.9154712894,
      longitude: 121.5408360958

    })
  },

})