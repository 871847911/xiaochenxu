// pages/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
    userName: '',
    userImages: '',
    userGender: '',
    phoneNum:'未绑定',
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res.data);
        var gex = "男"
        if (res.data.gender==1){
          gex = "男"
        }else{
          gex = "女"
        }
        that.setData({
          userName: res.data.nickName,
          userImages: res.data.avatarUrl,
          userGender: gex,
        });
      }
    });
    wx.request({
      url: "http://meiye-dev.vdongchina.com/user/queryUserByOpenId?openId=" + openId,
      method: "POST",
      header: {
        "Accept": "*/*"
      },
      data: {
        

      },
      success: function (res) {
        if (res.data.phone ==null){
          that.setData({
            phoneNum:'未绑定'
          });
        }else{
          that.setData({
            phoneNum: res.data.phone
          });
        }
      }
    })
  },
  bindPhone: function(){
    if (this.data.phoneNum == "未绑定"){
      wx.navigateTo({
        url: '../bindingPhoneNumber/bindingPhoneNumber',
      })
    }
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