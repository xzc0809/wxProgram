var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    cover: "cover",
    serverUrl: app.serverUrl,
    videoInfo: null,
    userLikeVideo: false
  },

  showSearch: function() {
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  },
  upload: function() {
    var me = this;

    var userInfo = app.getGlobalUserInfo();
    console.log(userInfo + "userInfo");
    //登录拦截
    if (userInfo == null || userInfo == undefined || userInfo == '') {
      //需要在 传输时对需要做传输的url后带的符号 进行转义
      //并且把对象转化为字符串
      var data = JSON.stringify(me.data.videoInfo);
      var realUrl = '../videoinfo/videoinfo#data@' + data;
      wx.redirectTo({
        url: '../userLogin/login?redirectUrl=' + realUrl,
      })
    } else {
      videoUtil.uploadVideo();
    }

  },
  onLoad: function(params) {
    //将取出的字符串转换为json数据格式
    var me = this;
    var videoInfo = JSON.parse(params.data);
    var userInfo = app.getGlobalUserInfo();
    console.log(videoInfo);
    var cover = "cover";
    if (videoInfo.videoHeight <= videoInfo.videoWidth) {
      cover = ""
    }
    this.setData({
      videoInfo: videoInfo,
      cover: cover
    })
    if (userInfo != null || userInfo != '' || userInfo != undefined) {
      wx.request({
        url: app.serverUrl + '/video/queryUserLike?userId=' + userInfo.id + '&videoId=' + me.data.videoInfo.id,
        method: 'POST',
        success: function(res) {
          if (res.data.status == 200) {
            me.setData({
              userLikeVideo: true
            })
          }
        },

      })
    }
  },
  //喜欢或者取消喜欢
  likeVideoOrNot: function() {
    var userInfo = app.getGlobalUserInfo();
    var me = this;
    var videoInfo = this.data.videoInfo;
    //登录拦截
    if (userInfo == null || userInfo == undefined || userInfo == '') {
      //需要在 传输时对需要做传输的url后带的符号 进行转义
      //并且把对象转化为字符串
      var data = JSON.stringify(me.data.videoInfo);
      var realUrl = '../videoinfo/videoinfo#data@' + data;
      wx.redirectTo({
        url: '../userLogin/login?redirectUrl=' + realUrl,
      })
    } else {
      if (me.data.userLikeVideo) {
        var postUrl = me.data.serverUrl + '/video/delUserLike?userId=' + userInfo.id + '&videoId=' + videoInfo.id + "&videoUserId=" + videoInfo.userId
      } else {
        var postUrl = me.data.serverUrl + '/video/addUserLike?userId=' + userInfo.id + '&videoId=' + videoInfo.id + "&videoUserId=" + videoInfo.userId
      }
      wx.request({
        url: postUrl,
        header: {
          userId: userInfo.id,
          userToken: userInfo.userToken
        },
        method: 'POST',
        success: function(res) {
          console.log(
            "喜欢：" + res.data.status)
          if (res.data.status == 200) {
            me.setData({
              userLikeVideo: !me.data.userLikeVideo
            })
          }
        }
      })
    }
  },
  showIndex: function() {
    wx.redirectTo({
      url: '../index/index',

    })
  },
  showMine: function() {
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  showPublisher: function() {
    var userInfo = app.getGlobalUserInfo();
    var me = this;
    var videoInfo = this.data.videoInfo;
    //登录拦截
    if (userInfo == null || userInfo == undefined || userInfo == '') {
      //需要在 传输时对需要做传输的url后带的符号 进行转义
      //并且把对象转化为字符串
      var data = JSON.stringify(me.data.videoInfo);
      var realUrl = '../mine/mine#data@' + videoInfo.userId;
      wx.redirectTo({
        url: '../userLogin/login?redirectUrl=' + realUrl,
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine?data=' + videoInfo.userId,
      })
    }
  },
  shareMe: function() {
    // console.log(e);
    var userInfo=app.getGlobalUserInfo();
    var me = this;
    wx.showActionSheet({ //显示弹窗选择框  需要success:function函数
      itemList: ["下载到本地", "举报", "分享到朋友圈"],
      success: function(e) {
        console.log(e.tapIndex); //获取点击选择框的下标
        var tapIndex = e.tapIndex;
        if (tapIndex == 0) { //下载到本地

        } else if (tapIndex == 1) { //举报
          
          //登录拦截
          if (userInfo == null || userInfo == undefined || userInfo == '') {
            //需要在 传输时对需要做传输的url后带的符号 进行转义
            //并且把对象转化为字符串
            var data = JSON.stringify(me.data.videoInfo);
            var realUrl = '../videoInfo/videoInfo#data@' + videoInfo;
            wx.redirectTo({
              url: '../userLogin/login?redirectUrl=' + realUrl,
            })
          } else {
            wx.navigateTo({
              url: '../report/report?dealVideoId=' + me.data.videoInfo.id + "&dealUserId=" + me.data.videoInfo.userId
            })
          }
        
        } else if (tapIndex == 2) {
          wx.showToast({
            title: '官方暂未开通哦~亲',
            icon: 'none'
          })
        }
      }
    })

  }
})