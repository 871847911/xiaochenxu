// pages/orderSuccess/orderSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    
    var zz = (options.chosetimes.split("-"))[0];
    console.log("=====>",zz);
    var xx = zz.split(":");
    var chosetimes= xx[1]+":"+xx[2];
    if (options.staffName=="不指定技师"){
      console.log("不指定")
      this.setData({
        customerNumber: options.customerNumber,
        userName: options.userName,
        name: options.name,
        phone: options.phone,
        staffName: "不指定技师",
        isAcceptStaffs: options.isAcceptStaffs,
        serverName: options.serverName,
         year: options.year,
        week: options.week,
        chosetimes: chosetimes
      })
    }else{
      console.log("指定", options.staffName)
      
      if (options.isAcceptStaffs == "1") {
        console.log("11111")
        this.setData({
          customerNumber: options.customerNumber,
          userName: options.userName,
          name: options.name,
          phone: options.phone,
          staffName: options.staffName+" (可以接受非指定技师服务)",
          isAcceptStaffs: options.isAcceptStaffs,
          serverName: options.serverName,
          year: options.year,
          week: options.week,
          chosetimes: chosetimes
        })
      }else{
        console.log("00000")
        this.setData({
          customerNumber: options.customerNumber,
          userName: options.userName,
          name: options.name,
          phone: options.phone,
          staffName: options.staffName + " (不接受非指定技师服务)",
          isAcceptStaffs: options.isAcceptStaffs,
          serverName: options.serverName,
          year: options.year,
          week: options.week,
          chosetimes: chosetimes
         
        })
      }
    }

    
  
  },
  //return
  return:function(){
    wx.switchTab({
      url: '../first/first'
    })
  }
})