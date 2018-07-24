// pages/technicianDetails/technicianDetails.js
var app = getApp();
var that;
var id;
var storeId;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    jishi: [],
    skill: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      storeName: app.globalData.storeName,
      addressX: app.globalData.addressX,
      addressY: app.globalData.addressY,
      coordinateAdress: app.globalData.coordinateAdress,
    });
    console.log("id", options.id);
    this.getTechnicianDetails(options.id); //通过id查询技师详情
    id = options.id;
    that.getloaction()
  },
  //跳转更多服务
  gohisService: function() {
    wx.navigateTo({
      url: '../hisService/hisService?id=' + id,
    })
  },
  //点击进入具体位置信息
  openMap: function () {
    wx.openLocation({
      latitude: Number(app.globalData.addressY),
      longitude: Number(app.globalData.addressX),
      name: app.globalData.mapAdress
    })
  },
  addorder:function(){
    var id = this.data.listd.id;
    var jishiName = this.data.listd.nickName;
    console.log(id)
    wx.navigateTo({
      url: '../order/order?staffId=' + id + "&jishiName=" + jishiName,
    })
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
      success: function(res) {
        
          var listType = res.data.list;
          var listType1 = [];
          for (var j = 0; j < listType.length; j++) {
            console.log("jishi ==>", listType[j])
            if (listType[j].isEnable == 1) {
              listType1.push(listType[j])
            }
          }

          console.log("技师详情", listType1);
        that.setData({
          listd:res.data.staff,
          jishi: res.data.staff,
          skill: listType1
        })
      }
    })
  },
  getloaction: function(e) {
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log("位置信息", res);
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        wx.request({
          url: app.globalData.service + '/wx/getDistance?storeId=' + app.globalData.storeId + '&long2=' + longitude + '&lat2=' + latitude,
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {

          },
          success: function(res) {
            if (res.data < 1) {
              that.setData({
                distance: ((res.data) * 1000).toFixed(0) + 'm',
              });
            } else {
              that.setData({
                distance: (res.data).toFixed(1) + 'km',
              });
            }
          }
        })



      }
    })
  },
})