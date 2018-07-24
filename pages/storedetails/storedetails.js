// pages/storedetails/storedetails.js
const app = getApp();
var storeId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    test: ["", "", "", "", "", ""],
    isMore: true,
    skill: ["", "", "", "", "", "", ""]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getServiceType();
    that.getAllStore();
    that.setData({
      phone: app.globalData.callphone,
      zphone: app.globalData.zphone,
    })
    console.log(app.globalData.callphone)
    console.log(app.globalData.zphone)
  },
  lookimg: function (e) {
    var that =this
    console.log(e.currentTarget.dataset.id);
    var id = e.currentTarget.dataset.id
    var urls = this.data.imgUrls;
    wx.previewImage({
      current: urls[id], // 当前显示图片的http链接
      urls: that.data.urls // 需要预览的图片http链接列表
    })
  },
  //获取店面
  getAllStore: function () {
    var that = this
    var id = app.globalData.storeId
    wx.request({
      url: app.globalData.service + "/store/queryById?storeId=" + id,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {

      },
      success: function (res) {
        console.log("门店信息", res.data);
        that.setData({
          storeName: res.data.name,
          storeUrl: res.data.picUrl,
          Adress: res.data.address,
          regionId: res.data.regionId
        })
        //获取店面省市区
        wx.request({
          url: app.globalData.service + "/region/selectRegionById?regionId=" + res.data.regionId,
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {

          },
          success: function (res) {
            console.log("门店省市区", res.data);
            that.setData({
              Adress: res.data.region + that.data.Adress
            })
          }
        })

      }
    })
    //获取店面展示图
    wx.request({
      url: app.globalData.service + "/material/queryShoppicByStore",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
          "id": app.globalData.storeId
      },
      success: function (res) {
        console.log("门店图", res);
        var newarry = [];
        for (var i = 0; i < res.data.rows.length; i++) {
          newarry.push(res.data.rows[i].url)
        }
        that.setData({
          urls: newarry
        })
      }
    })
    //获取店面服务类型
    wx.request({
      url: app.globalData.service + '/server/queryServerTypePage',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "storeId": app.globalData.storeId
      },
      success: function (res) {
        console.log("服务类型列表", res.data.rows);
        // var newarry = [];
        // for (var i = 0; i < res.data.rows.length; i++) {
        //   var c = { name: res.data.rows[i].name}
        //   newarry.push(c)
        // }
        that.setData({
          skill: res.data.rows
        })
      }
    })
  },
  //获取服务类型
  getServiceType: function () {
    var that = this;

    if (this.data.test.length > 5) {
      that.setData({
        isMore: false
      })
    }
  },
  //点击显示联系方式
  show_iphone: function () {
    var that = this
    var phone = that.data.phone
    var zphone = that.data.zphone
    wx.showActionSheet({
      itemList: [phone, zphone],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
          })
        } else {
          wx.makePhoneCall({
            phoneNumber: that.data.zphone //仅为示例，并非真实的电话号码
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  goMyserves:function(){
    wx.switchTab({
      url: '../serviceInOurShop/serviceInOurShop',
    })
  }
})