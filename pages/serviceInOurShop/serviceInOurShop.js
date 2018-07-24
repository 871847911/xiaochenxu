// pages/paySuccess/paySuccess.js
const app = getApp();
var that;
var storeId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    pagesLeft: [],
    pagesRight: [],
    scroll: true,
    second_height: 0,
    key: null,
    longe: false,
  },
  kindToggle: function(e) {
    if (this.data.open == true) {
      this.setData({
        open: false,
      });
    } else {
      this.setData({
        open: true,
      });
    }
  },
  closepup: function() {
    this.setData({
      open: false,
    });
  },
  queryServerTypePage: function(e) {
    wx.request({
      url: app.globalData.service + '/server/queryServerTypePage',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {  
          "storeId": app.globalData.storeId
      },
      success: function(res) {
        console.log("服务类型列表", res.data.rows);

        if (res.data.rows.length > 6) {
          that.setData({
            pages: res.data.rows,
            longe: true,
          })
        } else {
          that.setData({
            pages: res.data.rows,
            longe: false,
          })
        }
      }
    })
  },
  queryServer: function (e) {
    wx.request({
      url: app.globalData.service + '/server/queryServerPage',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "page": {

        },
        "server": {
          "storeId": app.globalData.storeId
        }
      },
      success: function (res) {
        console.log(res)
        that.setData({
          detailsList: res.data.rows,
        })
      }
    })
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
      storestatus: app.globalData.storestatus,
    });
    that.queryServerTypePage();
    that.queryServer();
    that.getloaction()
  },
  //下拉点击
  changColor: function(e) {
    that = this
    if (that.data.key == e.target.dataset.index) {
      this.setData({
        key: null,
        open: false,
        scrollLeft: 0,
        scrollTop:0
      })
      wx.request({
        url: app.globalData.service + '/server/queryServerPage',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "page": {

          },
          "server": {
            "storeId": app.globalData.storeId
          }
        },
        success: function (res) {
          console.log(res)
          that.setData({
            detailsList: res.data.rows,
          })
        }
      })

    } else {
      var newPage = that.todo(that.data.pages, e.target.dataset.index)
      this.setData({
        key: e.target.dataset.index,
        open: false,
        pages: newPage,
        key: 0
      })
      wx.request({
        url: app.globalData.service + '/server/queryServerPage',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "page": {

          },
          "server": {
            "serverTypeId": e.currentTarget.dataset.name,
            "storeId": app.globalData.storeId
          }
        },
        success: function (res) {
          console.log(res)
          that.setData({
            detailsList: res.data.rows,
            scrollLeft: 0,
            scrollTop: 0
          })
        }
      })
    }
  },
  // 右侧导航
  changColorRight: function(e) {
    that = this
    console.log(that.data.pages[e.target.dataset.index].id)
    console.log(e.currentTarget.dataset.name)
    if (that.data.key == e.target.dataset.index) {
      
      this.setData({
        key: null,
        open: false,
        scrollLeft: 0,
        scrollTop: 0
      })
      wx.request({
        url: app.globalData.service + '/server/queryServerPage',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "page": {

          },
          "server": {
            "storeId": app.globalData.storeId
          }
        },
        success: function (res) {
          console.log(res)
          that.setData({
            detailsList: res.data.rows,
          })
        }
      })
    } else {
      var newPage = that.todo(that.data.pages, e.target.dataset.index)
      this.setData({
        scrollLeft: 0,
        scrollTop: 0,
        key: e.target.dataset.index,
        open: false,
        pages: newPage,
        key: 0
      })
      wx.request({
        url: app.globalData.service + '/server/queryServerPage',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          "page": {

          },
          "server": {
            "serverTypeId":e.currentTarget.dataset.name,
            "storeId": app.globalData.storeId
          }
        },
        success: function (res) {
          console.log(res)
          that.setData({
            detailsList: res.data.rows,
          })
        }
      })
    }
  },
  //跳转服务详情
  goDetails: function(e) {
    var service = that.data.detailsList[e.currentTarget.dataset.index];
    wx.setStorage({
      key: 'servicelDetail',
      data: that.data.detailsList[e.currentTarget.dataset.index]
    });
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails',
    })
    
  },
  todo: function(arr, id) {
    var index = 1,
      newArr = [],
      length = arr.length;
    for (var i = 0; i < length; i++) {
      if (i == id) {
        newArr[0] = arr[i];
      } else {
        newArr[index++] = arr[i];
      }
    }
    return newArr;
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
          url: app.globalData.service + '/wx/getDistance?storeId=' + app.globalData.storeId  + '&long2=' + longitude + '&lat2=' + latitude,
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
  //滚动监听

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
    that = this;
    that.setData({
      storeName: app.globalData.storeName,
      addressX: app.globalData.addressX,
      addressY: app.globalData.addressY,
      coordinateAdress: app.globalData.coordinateAdress,
      storestatus: app.globalData.storestatus,
    });
    that.queryServerTypePage();
    that.queryServer();
    that.getloaction()
    wx.stopPullDownRefresh()
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