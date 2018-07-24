// pages/technician/technician.js
const app = getApp();
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    person:["","",""],
    technician:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   that = this;
   that.getTechnicianList(options.serverId);
  },
  
  //获取技师列表
  getTechnicianList:function(e){
    console.log(e)
    if (e == '' || e === 'undefined' || e === undefined){
      wx.request({
        url: app.globalData.service + '/staff/queryStaffPage',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "page": {

          },
          "staff": {

            "storeId": app.globalData.storeId
          }

        },
        success: function (res) {
          console.log("技师列表", res.data.rows);
          that.setData({
            technician: res.data.rows
          })
        }
      })
    }else{
      wx.request({
        url: app.globalData.service + "/staff/queryByServerId?serverId=" + e,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {

        },
        success: function (res) {
          console.log("service", res.data.rows);
          that.setData({
            technician: res.data.rows
          })
        }
      })
    }
    
  },
  //跳转技师详情页
  gotoDetails:function(e){
    var num = e.currentTarget.dataset.id;
    var id = that.data.technician[num].id;
    console.log("id",id);
    wx.navigateTo({
      url: '../technicianDetails/technicianDetails?id=' + id,
    })
  },
  //不指定技师
  return:function(){
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    // var id = e.currentTarget.dataset.id;
    // console.log("gggg", that.data.technician[id])
    page.setData({
      jishiName: "不指定技师",
      staffId:""
    })
    wx.navigateBack({
      
    })
  },
  //确定选择技师
  suerChose:function(e){
    var pages= getCurrentPages();
    var page = pages[pages.length-2];
    var id = e.currentTarget.dataset.id;
    // console.log("gggg", that.data.technician[id])
    page.setData({
      jishiName: that.data.technician[id].nickName,
      staffId: that.data.technician[id].id
    })
    wx.navigateBack({
      delta:1
    })
  }
})