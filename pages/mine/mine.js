// var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    url:app.serverUrl
  },
  onLoad:function(){},
  logout:function(){
    var userInfo=app.userInfo;
    console.log(userInfo);
    wx.showLoading({
      title: '注销中...',
    }),
    wx.request({
      url: this.data.url+'/logout?userId='+userInfo.id,
      method: 'POST',
      success: function (res) {
        var status = res.data.status;
        console.log(res.data);
   
        if (status == 200) {
          app.userInfo = null;//除了删除redis的token以外，本地的userInfo也要删除
          wx.showToast({
            title: '注销成功'
          }),
          wx.redirectTo({
            url: '../userLogin/login',
          })
       
         }else {
          wx.showToast({
            title: '系统错误，请联系管理员，或检查网络',
            icon: 'none',
            duration:3000
          })
        }
      }
    })
  }

})
