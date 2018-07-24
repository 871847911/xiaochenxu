// pages/hisService/hisService.js
var app = getApp();
var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skill:["","","","",""],
    aaa:["",""]
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getTechnicianDetails(options.id);
  },
  //通过id查询技师详情
  getTechnicianDetails(id) {
    wx.request({
      url: app.globalData.service + "/staff/queryStaffById?staffId=" + id,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function (res) {
        console.log("技师详情", res);
        that.setData({
          skill: res.data.list,
          
        })
      }
    })
  }
})