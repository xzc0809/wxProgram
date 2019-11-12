var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    serverUrl: app.serverUrl,
    faceUrl: "../resource/images/noneface.png",
    url: app.serverUrl,
    fansCounts: 0,
    followCounts: 0,
    receiveLikeCounts: 0,
    nickname: null,
    isMe: true,
    publisherId: null,
    isFollow: false,

    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",
    isSelectedFollow: "",

    myWorkFlag: false,
    myLikesFlag: true,
    myFollowFlag: true,

    currentPage: 1,
    totalPage: 1,

    myVideoList: [],
    likeVideoList: [],
    followVideoList: []

  },
  onLoad: function(params) {
    
    var me = this;
    
    var publisherId = params.data;
    console.log(publisherId);
    var userInfo = app.getGlobalUserInfo();
    me.doSelectWork();
    if (publisherId != null && publisherId != undefined && publisherId != '') { //若发布者信息不为空,则显示发布者的我的页面

      wx.request({
        url: app.serverUrl + '/user/queryUserInfo?userId=' + publisherId + "&fanId=" + userInfo.id, //需要请求关注关系
        header: {
          userId: userInfo.id,
          userToken: userInfo.userToken
        },
        method: 'POST',
        dataType: 'json',
        success: function(res) {
          // debugger;
          console.log("发布者信息：" + res.data.status)
          var data = res.data.data;
          if (res.data.status == 200) {
            var faceUrl = app.serverUrl + data.faceImage;
            console.log("该发布者是否Follow" + data.follow)
            me.setData({
              nickname: data.nickname,
              fansCounts: data.fansCounts,
              followCounts: data.followCounts,
              receiveLikeCounts: data.receiveLikeCounts,
              faceUrl: faceUrl,
              publisherId: publisherId,
              isMe: false,
              isFollow: data.follow
            })
          }
        }
      })

    } else {

      //app.getUserInfo修改为app.getGlobalUserIanfo
      var userInfo = app.getGlobalUserInfo();
      console.log("mine页面我自己" + userInfo.id)
      //app.userInfo修改为app.getGlobalUserInfo
      if (userInfo.faceImage == null) {
        this.setData({
          faceUrl: "../resource/images/noneface.png"
        })

      } else {
        var faceUrl = app.serverUrl + userInfo.faceImage;
        me.setData({
          faceUrl: faceUrl
        })
        console.log(faceUrl)
      }
      wx.request({

        url: app.serverUrl + '/user/queryUserInfo?userId=' + userInfo.id, //查询用户信息
        method: "POST",
        header: {
          userId: userInfo.id,
          userToken: userInfo.userToken,
        },

        success: function(res) {
          var data = res.data;
          console.log("mine页面" + data);
          console.log(data)

          if (data.status == 200) {
            var userToken = userInfo.userToken;
            userInfo = data.data; //更新用户最新信息
            userInfo.userToken = userToken;
            console.log(userInfo)
            var fansCounts = data.data.fansCounts;
            var followCounts = data.data.followCounts;
            var receiveLikeCounts = data.data.followCounts;
            var nickname = data.data.nickname;
            me.setData({
              fansCounts: fansCounts,
              followCounts: followCounts,
              receiveLikeCounts: receiveLikeCounts,
              nickname: nickname
            })

          } else if (data.status == 502) {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 300
            })
            wx.navigateTo({
              url: '../userLogin/login',
            })


          } else {
            wx.showToast({
              title: '系统错误',
              icon: 'none'
            })
          }
        }
      })
    }

  },
  logout: function() {
    var userInfo = app.getGlobalUserInfo();
    console.log(userInfo);
    wx.showLoading({
        title: '注销中...',
      }),
      wx.request({
        url: this.data.url + '/logout?userId=' + userInfo.id,
        method: 'POST',
        success: function(res) {
          var status = res.data.status;
          console.log(res.data);

          if (status == 200) {
            //修改app.userInfo为app.setGlobalUserInfo
            // app.setGlobalUserInfo(null);//除了删除redis的token以外，本地的userInfo也要删除
            //修改注销为删除缓存
            wx.removeStorageSync("userInfo");

            wx.showToast({
                title: '注销成功'
              }),
              wx.redirectTo({
                url: '../userLogin/login',
              })

          } else {
            wx.showToast({
              title: '系统错误，请联系管理员，或检查网络',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
  },
  changeFace: function() {
    var me = this;
    var userInfo = app.getGlobalUserInfo();
    console.log("changeFace" + JSON.stringify(userInfo));
    if (userInfo === null || userInfo === '' || userInfo === undefined) {
      console.log("触发当前无用户上传头像的函数")
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    wx.chooseImage({ //选择图片
      count: 1, //选择图片的数量
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths //获取图片的路径，数组形式
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          //app.userInfo修改为userInfo,userInfo=app.getGlobalUserInfo
          url: app.serverUrl + "/user/uploadFace?userId=" + userInfo.id, //需要上传的url
          filePath: tempFilePaths[0], //图片/文件路径
          name: 'file',
          header: {
            userId: userInfo.id,
            userToken: userInfo.userToken
          },
          success(resp) {

            var data = JSON.parse(resp.data);
            console.log(data.status);
            console.log(data);
            if (data.status == 200) {
              wx.showToast({
                title: '上传成功',
              })
              var faceUrl = app.serverUrl + data.data //修改图片url
              me.setData({
                faceUrl: faceUrl
              })
            } else if (data.status == 500) {
              wx.showToast({
                title: "失败",
              })
            }
          }
        })
      },


    })

  },

  uploadVideo: function() {
    var userInfo = app.getGlobalUserInfo();
    if (userInfo == null || userInfo == '' || userInfo == undefined) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
      return;
    }
    videoUtil.uploadVideo();
  },
  //关注与取消关注  
  followMe: function(e) {
    var me = this;
    var publisherId = me.data.publisherId;
    var userInfo = app.getGlobalUserInfo();
    var follow = e.currentTarget.dataset.follow;
    console.log(follow); //1 触发关注
    if (follow == 1) {
      var url = app.serverUrl + '/user/addUserFansById?userId=' + publisherId + "&fansId=" + userInfo.id
      //实时的显示粉丝数，
      var fansCounts = me.data.fansCounts + 1;
    } else if (follow == 0) {
      var url = app.serverUrl + '/user/delUserFansById?userId=' + publisherId + "&fansId=" + userInfo.id
      //实时的显示粉丝数，
      var fansCounts = me.data.fansCounts - 1;
    }
    wx.request({
      url: url,
      header: {
        userId: userInfo.id,
        userToken: userInfo.userToken
      },
      method: 'POST',
      success: function(res) {

        var isFollow = me.data.isFollow;
        if (res.data.status == 200) {
          me.setData({
            isFollow: !isFollow,
            fansCounts: fansCounts
          })
        }
      }
    })
  },

  //选择作品
  doSelectWork: function() {
    var me = this;
    me.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",
      isSelectedFollow: "",
      //区域隐藏
      myWorkFlag: false,
      myLikesFlag: true,
      myFollowFlag: true,
      currentPage:1,
    })
    if (!me.data.isMe) {
      var userId = me.data.publisherId;
    } else {
      var userId = app.getGlobalUserInfo().id;
    }
    wx.request({
      url: app.serverUrl + '/video/queryUserPublishVideos?userId=' + app.getGlobalUserInfo().id + "&pageNo=1",
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        var data = res.data;
        console.log(data);
        if (res.data.status == 200) {
          me.setData({
            myVideoList: data.data.rows,
            currentPage: 1,
            totalPage: data.data.pageCount
          })
        }
      }
    })
  },
  //选择收藏
  doSelectLike: function() {
    var me = this;
    me.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",
      isSelectedFollow: "",
      //区域隐藏
      myWorkFlag: true,
      myLikesFlag: false,
      myFollowFlag: true
    })
    if (!me.data.isMe) {
      var userId = me.data.publisherId;
    } else {
      var userId = app.getGlobalUserInfo().id;
    }
    wx.request({
      //调试：这里需要修改 app.get.... 改为userId
      url: app.serverUrl + '/video/queryUserLikeVideos?userId=' + app.getGlobalUserInfo().id + "&pageNo=1",
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        var data = res.data;
        console.log(data);
        if (res.data.status == 200) {
          me.setData({
            likeVideoList: data.data.rows,
            totalPage: data.data.pageCount,
            currentPage: 1,
            totalPage: data.data.pageCount
          })
        }
      }
    })
  },
  //选择关注
  doSelectFollow: function() {
    var me = this;
    me.setData({
      isSelectedWork: "",
      isSelectedLike: "",
      isSelectedFollow: "video-info-selected",
      //区域隐藏
      myWorkFlag: true,
      myLikesFlag: true,
      myFollowFlag: false

    });
    if (!me.data.isMe) {
      var userId = me.data.publisherId;
    } else {
      var userId = app.getGlobalUserInfo().id;
    }
    wx.request({
      //调试：这里需要修改 app.get.... 改为userId
      url: app.serverUrl + '/video/queryUserFollowVideos?userId=' + app.getGlobalUserInfo().id + "&pageNo=1",
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        var data = res.data;
        console.log(data);
        if (res.data.status == 200) {
          me.setData({
            followVideoList: data.data.rows,
            totalPage: data.data.pageCount,
            currentPage: 1,
            totalPage:data.data.pageCount
          })
        }
      }
    })

  },
  showVideo: function(e) {
    var me = this;
    var myWorkFlag = this.data.myWorkFlag;
    var myLikesFlag = this.data.myLikesFlag;
    var myFollowFlag = this.data.myFollowFlag;

    if (!myWorkFlag) {
      var videoInfo = this.data.myVideoList;
    } else if (!myLikesFlag) {
      var videoInfo = me.data.likeVideoList;
    } else if (!myFollowFlag) {
      var videoInfo = me.data.followVideoList;
    }
    //获取下标
    var index = e.currentTarget.dataset.arrindex;
    var videoInfoString = JSON.stringify(videoInfo[index]);
    console.log(videoInfoString)
    wx.navigateTo({

      url: '../videoinfo/videoinfo?data=' + videoInfoString,

    })
  },
  onReachBottom: function() {
    var me = this;
    var myWorkFlag = this.data.myWorkFlag;
    var myLikesFlag = this.data.myLikesFlag;
    var myFollowFlag = this.data.myFollowFlag;

    if(!this.data.isMe){
      var userId=this.data.publisherId;
    }else{
      var userId=app.getGlobalUserInfo().id;
    }


    var currentPage = this.data.currentPage;
    var totalPage = this.data.totalPage;
    if (!myWorkFlag) {
      var videoInfo = this.data.myVideoList;
      var url = app.serverUrl + '/video/queryUserPublishVideos?userId=' + userId + "&pageNo="
    } else if (!myLikesFlag) {
      var videoInfo = me.data.likeVideoList;
      url: app.serverUrl + '/video/queryUserLikeVideos?userId=' + userId + "&pageNo="
    } else if (!myFollowFlag) {
      var videoInfo = null;
      url: app.serverUrl + '/video/queryUserFollowVideos?userId=' + userId + "&pageNo="
    }
    if (currentPage == totalPage) { //判断是否为到最后一页
      wx.showToast({
        title: '到底了',
        icon: 'none'
      })
      return;
    }
    var currentPage=currentPage+1;
    me.setData({
      currentPage:currentPage
    })
    wx.request({
      url: url+currentPage,
      data: '',
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        var newvideoInfo=videoInfo.concat(res.data.data.rows);
        console.log(res.data.data.rows);
        if (!myWorkFlag) {
          me.setData({
            myVideoList:newvideoInfo
          })
         
        } else if (!myLikesFlag) {
          me.setData({
            likeVideoList: newvideoInfo
          })
          
        } else if (!myFollowFlag) {
          me.setData({
            followVideoList:newvideoInfo
          })
        }
      
      }
    })

  },

})