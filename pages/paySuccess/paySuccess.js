// pages/paySuccess/paySuccess.js
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
    console.log(options.price)
    this.setData({
      price: options.price
    })
  },
  //返回首页
  go:function(){
    wx.switchTab({
      url: '../first/first'
    })
  }
})