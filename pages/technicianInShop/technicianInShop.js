// pages/paySuccess/paySuccess.js
const app = getApp();
var storeId;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gohisService: function (e) {

    var id = this.data.twoList[e.currentTarget.dataset.index].staff.id
    wx.navigateTo({
      url: '../technicianDetails/technicianDetails?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
      storeName: app.globalData.storeName,
      addressX: app.globalData.addressX,
      addressY: app.globalData.addressY,
      coordinateAdress: app.globalData.coordinateAdress,
      storestatus: app.globalData.storestatus,
    });

    that.getloaction()
    wx.request({
      url: app.globalData.service + '/staff/queryStaffServer',
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
        
        for (var i = 0; i < res.data.length; i++) {
          var listType = res.data[i].list;
          var listType1 = [];
          for (var j = 0; j < listType.length; j++) {
            console.log("jishi ==>", listType[j])
            if (listType[j].isEnable == 1) {
              listType1.push(listType[j])
            }
          }
          res.data[i].list = listType1
        }
        console.log("技师信息", res.data)
        that.setData({
          twoList: res.data,
        });
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that = this
    that.setData({
      storeName: app.globalData.storeName,
      addressX: app.globalData.addressX,
      addressY: app.globalData.addressY,
      coordinateAdress: app.globalData.coordinateAdress,
      storestatus: app.globalData.storestatus,
    });

    that.getloaction()
    wx.request({
      url: app.globalData.service + '/staff/queryStaffServer',
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
        for (var i = 0; i < res.data.length; i++) {
          var listType = res.data[i].list;
          var listType1 = [];
          for (var j = 0; j < listType.length; j++) {
            console.log("jishi ==>", listType[j])
            if (listType[j].isEnable == 1) {
              listType1.push(listType[j])
            }
          }
          res.data[i].list = listType1
        }
        that.setData({
          twoList: res.data,
        });
      }
    })
    wx.stopPullDownRefresh()
  },
  addOrder: function (e) {
    console.log("技师信息", this.data.twoList[e.target.dataset.index])
    var id = this.data.twoList[e.target.dataset.index].staff.id;
    var jishiName = this.data.twoList[e.target.dataset.index].staff.nickName;
    wx.navigateTo({
      url: '../order/order?staffId=' + id + "&jishiName=" + jishiName,
    })
  },
  getloaction: function (e) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
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
          success: function (res) {
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
  //点击进入具体位置信息
  openMap: function () {
    wx.openLocation({
      latitude: Number(app.globalData.addressY),
      longitude: Number(app.globalData.addressX),
      name: app.globalData.mapAdress
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