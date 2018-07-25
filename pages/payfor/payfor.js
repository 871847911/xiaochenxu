// pages/payfor/payfor.js
const app = getApp();
var that;
var openid;
var storeId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: '',
    lastPrice:'0:00',
    rellprice:'0:00',
    priceid: '优惠券',
    priceRules: '选择优惠券',
    switchChange: false,
    kouintegral:"0:00",
    kou:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.service + "/seller/queryById?sellerId=" + app.globalData.sellerId,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {


      },
      success: function (res) {
        console.log("商户信息", res);
        that.setData({
          isenableIntegral: res.data.isenableIntegral,
        });
      }
    })
    var zhekou = 0
    if (options.priceRules === undefined || options.priceid === undefined || options.priceRules == '' || options.priceid == '') {
      if (options.price == '' || options.price === undefined){
        that.setData({
          price: '',
          rellprice: '0.00',
          lastPrice:0.00
        });
      }else{
        that.setData({
          price: options.price,
          rellprice: options.price,
        });
      }
    } else {
      that.setData({
        rid: options.rid,
        priceRules: options.priceRules,
        price: options.price,
        id: options.id
      });
      var rellprice = options.price
      if (options.priceid == "voucher") {
        rellprice = (options.price - options.priceRules).toFixed(2)
      } else if (options.priceid == "discount") {
        rellprice = (options.price * (options.priceRules / 10)).toFixed(2)
        zhekou = (options.price - rellprice).toFixed(2)
      }
      if (rellprice <= 0) {
        console.log(rellprice)
        that.setData({
          zhekou: zhekou,
          lastPrice: 0.00,
          rellprice: "0.00",
          priceid: options.priceid,
        });
      } else {
        that.setData({
          zhekou: zhekou,
          lastPrice: rellprice,
          rellprice: rellprice,
          priceid: options.priceid,
        });
      }

    }
    that.getJifenrule()
    that.getloaction()
    that.getJifen()
    that.setData({
      storeName: app.globalData.storeName,
      addressX: app.globalData.addressX,
      addressY: app.globalData.addressY,
      coordinateAdress: app.globalData.coordinateAdress,
      storestatus: app.globalData.storestatus,
    });
  },


  //跳转店铺详情页面
  goto_storedetails: function () {
    wx.navigateTo({
      url: '../storedetails/storedetails',
    })
  },
  //跳转优惠券
  goto_coupon: function () {
    console.log(this.data.price)
    if (this.data.price == '' || this.data.price === undefined) {
     
    }else{
      wx.navigateTo({
        url: '../selectCoupons/selectCoupons?price=' + this.data.price,
      })
    }
  },
  //跳转支付成功页面
  goto_success: function () {
    var that = this
    if (that.data.price == '') {
      wx.showToast({
        title: '请输入金额',
        icon: "none"
      })
    } else if (that.data.price < 1) {
      wx.showToast({
        title: '请正确输入金额',
        icon: "none"
      })
    } else {
      if (that.data.rellprice == 0) {
        console.log(that.data.kou)
        var kowprice = that.data.kou
        if (kowprice == '') {
          kowprice = 0
        }
        var priceRules = that.data.priceRules
        if (priceRules == "选择优惠券") {
          priceRules = 0
        }
        wx.request({
          url: app.globalData.service + "/orderPayment/addOrderPayment",
          method: "POST",
          header: {
            "Accept": "*/*",
          },
          data: {
            costPrice: 0,
            openid: app.globalData.openid,
            payTime: new Date(),
            redPacketDecrease: priceRules,
            scoreDecrease: kowprice,
            sellerId: app.globalData.sellerId,
            storeId: app.globalData.storeId,
            storeName: app.globalData.storeName,
            totalPrice: that.data.price
          },
          success: function (res) {
            if(true){
              if (that.data.switchChange == true) {
                //扣除积分
                wx.request({
                  url: app.globalData.service + "/integral/counterPriceReduce",
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    userId: app.globalData.userId,
                    merchantId: app.globalData.sellerId,
                    integral: that.data.kouintegral,
                  },
                  success: function (res) {
                    console.log("扣除积分", res);
                  }
                })
              }
              if (that.data.id == '' || that.data.id === undefined) {

              } else {
                //使用优惠券
                wx.request({
                  url: app.globalData.service + "/coupon/useCouponByUser",
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    userId: app.globalData.userId,
                    couponId: that.data.id,
                    type: that.data.priceid,
                    rid: that.data.rid
                  },
                  success: function (res) {
                    console.log("使用优惠券", res);
                  }
                })
              }
              wx.redirectTo({
                url: '../paySuccess/paySuccess?price=' + that.data.rellprice,
              })
            }
          }
        })
        
      } else {
        var rellprice = Number(parseInt(that.data.rellprice*100))
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.service + "/wx/createOrder",
          method: "POST",
          header: {
            "Accept": "*/*",
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            "openid": app.globalData.openid,
            "sellerId": app.globalData.sellerId,
            "money": rellprice,
            "serverName": '消费',
          },
          success: function (res) {
            console.log("下单", res);
            var prepay_id = res.data.prepay_id
            wx.request({
              url: app.globalData.service + "/wx/sign",
              method: "POST",
              header: {
                "Accept": "*/*",
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                "repay_id": prepay_id,
                "sellerId": app.globalData.sellerId,
              },
              success: function (res) {
                wx.hideLoading()
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    var kowprice = that.data.kou
                    if (kowprice== ''){
                      kowprice = 0
                    }
                    var rellprice2 = (Number(that.data.rellprice)).toFixed(2)
                    var priceRules = that.data.priceRules
                    if (priceRules=="选择优惠券"){
                      priceRules = 0
                    }
                    console.log("实际支付金额", rellprice2)
                    console.log("优惠券减免", priceRules)
                    console.log("积分减免", kowprice)
                    console.log("原金额", that.data.price)
                    wx.request({
                      url: app.globalData.service + "/integral/paymentReturnAdd?merchantId=" + app.globalData.sellerId + "&userId=" + app.globalData.userId + "&price=" + rellprice2,
                      method: "POST",
                      header: {
                        'content-type': 'application/json'
                      },
                      data: {


                      },
                      success: function (res) {
                        console.log("积分返还", res);
                      }
                    })
                    wx.request({
                      url: app.globalData.service + "/orderPayment/addOrderPayment",
                      method: "POST",
                      header: {
                        "Accept": "*/*",
                      },
                      data: {
                        costPrice: rellprice2,
                        openid: app.globalData.openid,
                        payTime: new Date(),
                        redPacketDecrease: priceRules,
                        scoreDecrease: kowprice,
                        sellerId: app.globalData.sellerId,
                        storeId: app.globalData.storeId,
                        storeName: app.globalData.storeName,
                        totalPrice: that.data.price
                      },
                      success: function (res) {
                        console.log("上传订单", res);
                      }
                    })


                    if (that.data.switchChange==true){
                      //扣除积分
                      wx.request({
                        url: app.globalData.service + "/integral/counterPriceReduce",
                        method: "POST",
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                          userId: app.globalData.userId,
                          merchantId: app.globalData.sellerId,
                          integral: that.data.kouintegral,
                        },
                        success: function (res) {
                          console.log("扣除积分", res);
                        }
                      })
                    }
                    if(that.data.id==''||that.data.id===undefined){

                    }else{
                      //使用优惠券
                      wx.request({
                        url: app.globalData.service + "/coupon/useCouponByUser",
                        method: "POST",
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                          userId: app.globalData.userId,
                          couponId: that.data.id,
                          type: that.data.priceRules,
                          rid: that.data.rid
                        },
                        success: function (res) {
                          console.log("使用优惠券", res);
                        }
                      })
                    }
                    wx.switchTab({
                      url: '../first/first',
                    })
                  },
                  'fail': function (res) {
                    wx.showToast({
                      title: '支付失败',
                      icon: "none"
                    });
                  }
                });
              }
            })
          }
        })
      }


    }
  },
  //获取积分
  getJifen: function () {
    var that = this
    wx.request({
      url: app.globalData.service + "/integral/integralList",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        userId: app.globalData.userId,
        merchantId: app.globalData.sellerId,
        pageSize: 100,
        pageNo: 1,
      },
      success: function (res) {
        console.log("获取积分", res);
        if (res.data.list==''){
          that.setData({
            integral: 0
          });
        }else{
          that.setData({
            integral: res.data.list[0].surplusNumber
          });
        }
        
      }
    })
  },
  //获取积分规则
  getJifenrule: function () {
    var that = this
    wx.request({
      url: app.globalData.service + "/integral/integralSetting",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        merchantId: app.globalData.sellerId,
      },
      success: function (res) {
        console.log("获取积分规则", res.data.integralPaymentReturn);
        that.setData({
          integralCounterPrice: res.data.integralCounterPrice,
          integralPaymentReturn: res.data.integralPaymentReturn,
        });

      }
    })
  },
  //计算积分抵用金额
  integralMoney: function (e) {
    var that = this
    var kouintegral
    console.log('输入金额', e)
    console.log('最高抵用百分比', that.data.integralCounterPrice.percentage / 100)
    var maxMoney = that.data.integralCounterPrice.quota * that.data.integral
    var maxdiyong = parseInt(e * (that.data.integralCounterPrice.percentage / 100))
    console.log('总积分可抵用金额', maxMoney)
    console.log('输入金额最大可抵用金额', e * (that.data.integralCounterPrice.percentage / 100))
    var kou
    if (maxMoney < maxdiyong) {
      kou = that.data.integralCounterPrice.quota * that.data.integral
      kouintegral = that.data.integral
    } else {
      kou = parseInt(e * (that.data.integralCounterPrice.percentage / 100))
      kouintegral = parseInt(e * (that.data.integralCounterPrice.percentage / 100))
    }
    that.setData({
      kouintegral: kouintegral,
      kou: kou
    });
    console.log("积分扣除的金额", kou)
    return kou
  },

  switchChange: function (e) {
    var that = this
    if (e.detail.value == true) {
      that.setData({
        switchChange: true
      })
      if (that.data.price == '' || that.data.price===undefined){
        var money = (Number(that.data.rellprice) - that.integralMoney(0)).toFixed(2)
        if (money < 0) {
          money = 0.00
        }
        that.setData({
          rellprice: money,
        });
        console.log(money)
        console.log(that.data.rellprice)
      }else{
        var money = (Number(that.data.rellprice) - that.integralMoney(that.data.price)).toFixed(2)
        if (money < 0) {
          money = 0.00
        }
        that.setData({
          rellprice: money,
        });
      }
      

    } else {
      var lastPrice = Number(that.data.lastPrice).toFixed(2)
      that.setData({
        kou:'',
        switchChange: false,
        rellprice: lastPrice
      })
    }
  },
  getloaction: function (e) {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
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
  biNum: function (e) {
    var that = this
    that.integralMoney(e.detail.value)
    var inputnam = e.detail.value
    var regStrs = [
      ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
      ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
      ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
      ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
    ];
    for (var i = 0; i < regStrs.length; i++) {
      var reg = new RegExp(regStrs[i][0]);
      inputnam = inputnam.replace(reg, regStrs[i][1]);
    }
    that.setData({
      priceid: '优惠券',
      priceRules: '选择优惠券',
      price: inputnam,
      lastPrice: inputnam,
    });
    if (that.data.switchChange == true) {
      var money = (that.data.price - that.integralMoney(e.detail.value)).toFixed(2)
      if (money < 0) {
        money = 0.00
      }
      that.setData({
        rellprice: money,
      });
    } else {
      inputnam = inputnam
      if (inputnam==''){
        that.setData({
          rellprice: 0.00,
        });
      }else{
        var money = Number(inputnam).toFixed(2)
        that.setData({
          rellprice: money,
        });
      }
      
    }
    return inputnam
  },
  //点击进入具体位置信息
  openMap: function () {
    wx.openLocation({
      latitude: Number(app.globalData.addressY),
      longitude: Number(app.globalData.addressX),
      name: app.globalData.mapAdress
    })
  }
})