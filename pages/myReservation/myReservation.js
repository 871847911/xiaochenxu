var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var storeId;
const app = getApp();
var that;
Page({
  data: {
    tabs: ["全部", "待服务", "已完成", "已取消"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function() {
    that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    wx.request({
      url: app.globalData.service + '/orderAppointment/queryAppointmentsByOpenid?' + 'openid=' + app.globalData.openid + '&status=' + '' + '&storeId=' + app.globalData.storeId,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function(res) {
        console.log("我的预约",res.data)
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].startTime!= '') {
            res.data[i].startTime.time = that.toDate(res.data[i].startTime.time) + ' ' + res.data[i].startTime.hours + ':00' + '-' + (res.data[i].startTime.hours + 1) + ':00' + '  ' + that.dateLater(that.toDate(res.data[i].startTime.time)).week
          }

        }
        that.setData({
          list: res.data,
        });
      }
    })
  },
  toDate: function(number) {
    var n = number;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  tabClick: function(e) {
    var that = this
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    var index = e.currentTarget.id
    if (index == 1) {
      wx.request({
        url: app.globalData.service + '/orderAppointment/queryAppointmentsByOpenid?' + 'openid=' + app.globalData.openid + '&status=' + '0' + '&storeId=' + app.globalData.storeId,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

        },
        success: function(res) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].startTime!= '') {
              res.data[i].startTime.time = that.toDate(res.data[i].startTime.time) + ' ' + res.data[i].startTime.hours + ':00' + '-' + (res.data[i].startTime.hours + 1) + ':00' + '  ' + that.dateLater(that.toDate(res.data[i].startTime.time)).week
            }

          }
          that.setData({
            list: res.data,
          });
        }
      })
    } else if (index == 2) {
      wx.request({
        url: app.globalData.service + '/orderAppointment/queryAppointmentsByOpenid?' + 'openid=' + app.globalData.openid + '&status=' + '1' + '&storeId=' + app.globalData.storeId,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

        },
        success: function(res) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].startTime!= '') {
              res.data[i].startTime.time = that.toDate(res.data[i].startTime.time) + ' ' + res.data[i].startTime.hours + ':00' + '-' + (res.data[i].startTime.hours + 1) + ':00' + '  ' + that.dateLater(that.toDate(res.data[i].startTime.time)).week
            }

          }
          that.setData({
            list: res.data,
          });
        }
      })
    } else if (index == 3) {
      wx.request({
        url: app.globalData.service + '/orderAppointment/queryAppointmentsByOpenid?' + 'openid=' + app.globalData.openid + '&status=' + '2,3' + '&storeId=' + app.globalData.storeId,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

        },
        success: function(res) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].startTime!= '') {
              res.data[i].startTime.time = that.toDate(res.data[i].startTime.time) + ' ' + res.data[i].startTime.hours + ':00' + '-' + (res.data[i].startTime.hours + 1) + ':00' + '  ' + that.dateLater(that.toDate(res.data[i].startTime.time)).week
            }

          }
          that.setData({
            list: res.data,
          });
        }
      })
    } else {
      wx.request({
        url: app.globalData.service + '/orderAppointment/queryAppointmentsByOpenid?' + 'openid=' + app.globalData.openid + '&status=' + '' + '&storeId=' + app.globalData.storeId,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

        },
        success: function(res) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].startTime!= '') {
              res.data[i].startTime.time = that.toDate(res.data[i].startTime.time) + ' ' + res.data[i].startTime.hours + ':00' + '-' + (res.data[i].startTime.hours + 1) + ':00' + '  ' + that.dateLater(that.toDate(res.data[i].startTime.time)).week
            }
          }
          that.setData({
            list: res.data,
          });
        }
      })
    }


  },
  // 判断周几
  dateLater: function(dates) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate());
    let day = date.getDay();
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    return dateObj;
  },

  clickHref: function(e) {
    var that = this
    wx.setStorage({
      key: 'orderAppointmentDetail',
      data: that.data.list[e.currentTarget.dataset.index]
    });
    wx.navigateTo({
      url: '../myReservationList/myReservationList?make=' + '1',
    })
  },

  clickCancel: function(e) {
    var that = this
    wx.setStorage({
      key: 'orderAppointmentList',
      data: that.data.list[e.currentTarget.dataset.index]
    });
    wx.navigateTo({
      url: '../cancel/cancel',
    })
  },
  changreser: function(e) {
    console.log("changreser", that.data.list[e.currentTarget.dataset.index].id);

    wx.setStorage({
      key: 'changerReservation',
      data: that.data.list[e.currentTarget.dataset.index]
    });
    wx.navigateTo({
      url: '../order/order?make=1&id=' + that.data.list[e.currentTarget.dataset.index].id,
    })
  }
});