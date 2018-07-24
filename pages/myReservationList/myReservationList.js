// pages/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:"待服务"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'orderAppointmentDetail',
      success: function (res) {
        console.log(res)
        if (res.data.status == 0){
          that.setData({
            cancel: true,
            state:'待服务'
          })
        } else if(res.data.status == 1){
          that.setData({
            cancel: false,
            state: '已完成'
          })
        } else if (res.data.status == 2 || res.data.status == 3) {
          that.setData({
            cancel: false,
            state: '已取消'
          })
        }
        if (res.data.isAcceptStaffs==0){
          that.setData({
            staffName: res.data.staffName
          })
        } else if (res.data.isAcceptStaffs == 1){
          that.setData({
            staffName: res.data.staffName + '（接受非指定技师服务）'
          })
        }
        if (res.data.cancelReason==''){
          that.setData({
            wyhCancel: false
          })
        }else{
          that.setData({
            wyhCancel: true,
          })
        }
        that.setData({
          dataList: res.data,
          customerNumber: res.data.customerNumber,
          userName: res.data.userName,
          staffName: res.data.staffName,
          serverName: res.data.serverName,
          cancelReason: res.data.cancelReason,
          startTime: res.data.startTime.time,
        })
      }
    });
  },
  clickCancel: function (e) {
    var that = this
    wx.setStorage({
      key: 'orderAppointmentList',
      data: that.data.dataList
    });
    wx.navigateTo({
      url: '../cancel/cancel',
    })
  },
  changreser: function (e) {
    var that = this
    wx.setStorage({
      key: 'changerReservation',
      data: that.data.dataList
    });
    console.log('修改预约返回参数', that.data.dataList)
    wx.navigateTo({
      url: '../order/order?make=1',
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