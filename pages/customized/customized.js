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
    wx.request({
      url: app.globalData.service + '/orderAppointment/queryAppointmentsByOpenid?' + 'openid=' + app.globalData.openid + '&status=' + '0' + '&storeId=' + app.globalData.storeId,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function (res) {
        console.log("预约信息", res.data)

        if (res.data == '') {
          wx.navigateTo({
            url: '../order/order',
          })
        } else {
          var id = res.data[0].id
          wx.showModal({
            title: '提示',
            content: '您已经预约了一次服务，是否需要重新预约？',
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: app.globalData.service + '/orderAppointment/updateOrderAppointment',
                  method: "POST",
                  header: {
                    'content-type': 'application/json'
                  },
                  data: {
                    "cancelReason": "重新预约",
                    "id": id,
                    "status": 2
                  },
                  success: function (res) {
                    console.log("取消结果", res);
                    wx.navigateTo({
                      url: '../order/order',
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
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