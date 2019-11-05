const app = getApp()

Page({

  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
 
    this.audioCtx = wx.createAudioContext('myAudio');
  
  },
 
  data: {
    bgmList:null,
    serverUrl:app.serverUrl,
    isPlay: true,
    videoParams:{}
    
  },

  
  audioPlay: function () {
    this.audioCtx.play(),
    this.setData({
      isPlay:false
    })
    console.log("开始播放")
  },
  audioPause: function () {
    this.audioCtx.pause(),
      this.setData({
        isPlay: true
      })
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },
  audioPlayPause:function(){
    console.log(this.audioCtx)

  },
  
  onLoad: function (params) {
    var me=this;
    console.log("请求获取bgm列表");
    this.setData({
      videoParams:params
    })
    wx.showLoading({
      title: '加载bgm中',
    })
    wx.request({
      url: app.serverUrl+'/bgm/getBgmList',
      method:'POST',
      success:function(res){
        var data=res.data;

        me.setData({
          bgmList:data.data
          }) 
        wx.showToast({
          title: '获取bgm成功',
        });
        console.log(me.data.bgmList[0]);
       
      },
      fail:function(){
        wx.showToast({
          title: '获取失败，返回重试',
          icon:none
        })
      }
    })
  },//
  //上传文件
  upload: function (e) {
    var data=e.detail.value;
    debugger
  }

 


})

