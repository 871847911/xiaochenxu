// pages/paySuccess/paySuccess.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        name: '0',
        value: '没时间'
      },
      {
        name: '1',
        value: '填写了错误信息'
      },
      {
        name: '2',
        value: '店铺位置太远'
      },
      {
        name: '3',
        value: '重新预约'
      },
      {
        name: '4',
        value: '其他'
      },
    ],
    isShow: false,
    submit: false,
    validate: false,
    textarea: '',
    state: '',
    popu: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'orderAppointmentList',
      success: function(res) {
        console.log(res)
        that.setData({
          id: res.data.id,
        })
      }
    });
  },
  radioChange: function(e) {
    var that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == "4") {
      this.setData({
        isShow: true,
      });
    } else {
      this.setData({
        isShow: false,
        state: that.data.items[e.detail.value].value
      });
    }
    this.setData({
      submit: true,
      validate: false,
      redioNum: e.detail.value,

    });
  },
  bindTextAreaBlur: function(e) {
    this.setData({
      textarea: e.detail.value
    });
    if (e.detail.value != "") {
      this.setData({
        validate: false,
      });
    } else {
      this.setData({
        validate: true,
      });
    }
  },
  submit: function(e) {
    console.log(e.detail.formId);
    var that = this
    if (that.data.textarea == "" && that.data.redioNum == "4") {
      that.setData({
        validate: true,
      });
    } else if (that.data.textarea != "" && that.data.redioNum == "4") {
      that.setData({
        validate: false,
      });
      wx.request({
        url: app.globalData.service + '/orderAppointment/updateOrderAppointment',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "cancelReason": that.data.state,
          "id": that.data.id,
          "status": 2
        },
        success: function(res) {
          console.log("取消结果", res);
          that.setData({
            popu: true,
          });
          setTimeout(function() {
            wx.navigateTo({
              url: '../myReservation/myReservation',
            })
          }, 2000)

        }
      })
    } else {
      that.setData({
        validate: false,
      });
      wx.request({
        url: app.globalData.service + '/orderAppointment/updateOrderAppointment',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "cancelReason": that.data.state,
          "id": that.data.id,
          "status": 2
        },
        success: function(res) {
          console.log("取消结果", res);
          that.setData({
            popu: true,
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '../myReservation/myReservation',
            })
          }, 1000)
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})