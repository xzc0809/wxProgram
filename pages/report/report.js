const app = getApp()

Page({
  data: {
    reasonType: "请选择原因",
    reportReasonArray: app.reportReasonArray,
    dealVideoId: "",
    dealUserId: ""
  },

  onLoad: function(params) {
    var me =this;
    var dealVideoId=params.dealVideoId;
    var dealUserId=params.dealUserId;
    this.setData({
      dealVideoId: dealVideoId,
      dealUserId: dealUserId
    })
    

  },

  changeMe: function(e) {
    var index=e.detail.value;
    var reportReason=app.reportReasonArray[index];
    this.setData({
      reasonType:reportReason
    })
  },

  submitReport: function(e) {

    if (app.reportReasonArray[e.detail.value.reasonIndex]==null){
      wx.showToast({
        title: '没有选择理由',
        icon:'none'
      });
      return;
    }

    var me=this;
      console.log(e.detail.value)
    var reportReason = app.reportReasonArray[e.detail.value.reasonIndex];
    var reasonContent=e.detail.value.reportContent;
    wx.request({
      url: app.serverUrl +'/user/reportUser',
      method:'POST',
      data:{
        content: reasonContent,
        dealUserId: me.data.dealUserId,
        dealVideoId: me.data.dealVideoId,
        title: reportReason,
        userid: app.getGlobalUserInfo().id
      },
      header:{
        userId:app.getGlobalUserInfo().id,
        userToken:app.getGlobalUserInfo().userToken
      },
      success:function(res){
        console.log(res.data.status);
        if(res.data.status==200){
          wx.showToast({
            title: '举报成功',
            duration:3000
          }),
          wx.navigateBack({//返回上一页
            delta: 1,
            
          })
        }else if(res.data.status==502){
          wx.showToast({
            title: '请先登录',
            icon:'none'
          }),
          wx.navigateTo({
            url: '../userRegist/regist',
          })
        }
      }
    })
  }




})