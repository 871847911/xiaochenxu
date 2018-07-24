// pages/choseservice/choseservice.js
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: ["", "", "", ""],
    aa: ["", "", ""]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.getServiceList(options.staffId);
  },
  //选择服务框
  radioChange: function(e) {
    that = this
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    var id = e.detail.value;
    page.setData({
      serverName: that.data.service[id].name,
      serverId: that.data.service[id].id,
      serviceTime: that.data.service[id].time
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //获取服务列表
  getServiceList: function(e) {
    console.log("服务列表", e)
    if (e == '' || e === undefined) {
      wx.request({
        url: app.globalData.service + "/server/queryServerPage",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "page": {},
          "server": {
            "storeId": app.globalData.storeId
          }
        },
        success: function(res) {
          that.setData({
            service: res.data.rows
          })
        }
      })
    } else {
      wx.request({
        url: app.globalData.service + "/server/queryByStaff?staffid=" + e,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

        },
        success: function(res) {
          console.log("服务列表",res)
          that.setData({
            service: res.data.rows
          })
        }
      })
    }
  },
  //return
  return: function() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    // var id = e.currentTarget.dataset.id;
    // console.log("gggg", that.data.technician[id])
    page.setData({
      serverName: "不指定服务",
      serverId: ""
    })
    wx.navigateBack({

    })
  },

})