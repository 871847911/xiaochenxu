// pages/paySuccess/paySuccess.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
var storeId;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  btnClick: function () {
    wx.navigateTo({
      url: '../order/order',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this


    wx.request({
      url: app.globalData.service + '/brand/selectBrand',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "id": app.globalData.sellerId
      },
      success: function (res) {
        if (res.data == '') {

        } else {
          wx.setNavigationBarTitle({
            title: res.data.name
          })
          var article = res.data.content
          WxParse.wxParse('article', 'html', article, that, 16);
        }
        
        


      }
    })


  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    var that = this


    wx.request({
      url: app.globalData.service + '/brand/selectBrand',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "id": app.globalData.sellerId
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        console.log("品牌", res)
        if (res.data == '') {

        } else {
          wx.setNavigationBarTitle({
            title: res.data.name
          })
          var article = res.data.content
          WxParse.wxParse('article', 'html', article, that, 16);
        }
      }
    })
   
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