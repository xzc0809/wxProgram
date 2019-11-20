var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    cover: "cover",
    serverUrl: app.serverUrl,
    videoInfo: null,
    userLikeVideo: false,
    placeholder: "说点什么吧。。。",
    commentFocus: false,
    contentValue:"",
    commentPage:0,
    commentTotalPage:1,
    commentsList:[],
    replyFatherCommentId:null,
    replyToUserId:null,
    fileUrl:app.fileUrl
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
    var userInfo = app.getGlobalUserInfo();
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
            var realUrl = '../videoInfo/videoInfo#data@' + data;
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

  },
  leaveComment: function() {
    this.setData({
      commentFocus: true
    })
  },
  saveComment: function(e) {
    var userInfo = app.getGlobalUserInfo();
    var me = this;
    var videoInfo = this.data.videoInfo;

    console.log(e);
    var fatherCommentId = e.currentTarget.dataset.replyfathercommentid;//被回复的评论id
    var toUserId = e.currentTarget.dataset.replytouserid;//被回复的用户id
   
    //登录拦截
    if (userInfo == null || userInfo == undefined || userInfo == '') {
      //需要在 传输时对需要做传输的url后带的符号 进行转义
      //并且把对象转化为字符串
      var data = JSON.stringify(me.data.videoInfo);
      var realUrl = '../videoinfo/videoinfo#data@' + data;
      wx.redirectTo({
        url: '../userLogin/login?redirectUrl=' + realUrl,
      })
      return;
    }
    var content=e.detail.value;//获取评论内容
    wx.showLoading({
      title: '发送中...',
    })
    wx.request({
      url: app.serverUrl + '/video/saveComment',
      method: 'POST',
      header: {
        userId: userInfo.id,
        userToken: userInfo.userToken
      },
      data:{
        fromUserId:userInfo.id,
        videoId:videoInfo.id,
        comment:content,
        fatherCommentId:fatherCommentId,
        toUserId:toUserId
      },
      success:function(res){
        if(res.data.status==200){
          wx.showToast({
            title: '评论成功',
          }),
          me.setData({
            contentValue:""
          });
          me.getCommentList(1);
        }else{
          wx.showToast({
            title: '保存失败！稍后再试',
            icon:'none'
          })
        }
      }
    })
    console.log(e.detail.value);
    // var page=me.data.commentPage;
   me.getCommentList(1);
  },
  getCommentList:function(pageNo){
    var videoId=this.data.videoInfo.id;
    var me=this;

    wx.request({
      url: app.serverUrl +'/video/getCommentVOList?pageNo='+pageNo+'&videoId='+videoId+'&pageSize=5',
      method: 'POST',                                       
      success: function(res) {
        var oldList=me.data.commentsList;
        if(res.data.status==200){
          if(pageNo==1){//页码为1时清空之前的列表数据
            me.setData({
              commentsList:[],
            }),
            oldList=me.data.commentsList;
          }    
          
          var newList=oldList.concat(res.data.data.rows);
          
          console.log(res.data.data);
          if(res.data.data.pageCount==0){ //如果没有内容，设置pageCount ,currentPage同时为0
            var pageCount=0;
            var currentPage=0;  
          }else{
            var pageCount=res.data.data.pageCount;
            var currentPage=pageNo;
          }
          me.setData({
            commentsList:newList,
            commentTotalPage: pageCount,
            commentPage: currentPage
          })
          console.log(res.data.data.rows);
        }
      },
    
    })
  },
  onReachBottom:function(){
    var me=this;
    var currentPage=me.data.commentPage;
    var totalPage=me.data.commentTotalPage;
    console.log(me.data.commentPage);
    if(currentPage==totalPage){
      wx.showToast({
        title: '到底了',
        icon:'none'
      });
      return;
    }else{
    currentPage=currentPage+1;  //触底时获取第一页内容
    me.getCommentList(currentPage);
    }
  },
  replyFocus:function(e){//点击回复聚焦
      console.log();
    var fathercommentid = e.currentTarget.dataset.fathercommentid;
    var tonickname= e.currentTarget.dataset.tonickname;
    var touserid= e.currentTarget.dataset.touserid;
    this.setData({
      placeholder:"回复："+tonickname,
      commentFocus:true,
      replyToUserId:touserid,//被回复的人
      replyFatherCommentId:fathercommentid //被回复的消息id
    })
  }
})