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
    videoParams:{},
    fileUrl:app.fileUrl
    
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
   
    var me = this;
    var data = e.detail.value;
    var bgmId = data.bgmId;//id
    var desc = data.desc;//描述
    var duration = me.data.videoParams.duration;//时长
    var height = me.data.videoParams.height;//长
    var width = me.data.videoParams.width;//宽
    var size = me.data.videoParams.size;//size
    var temVideoUrl = me.data.videoParams.temVideoUrl;//视频地址
    var temCoverUrl = me.data.videoParams.temCoverUrl;//封面的地址

    wx.showLoading({
      title: '上传中..请等待',
    })
    console.log(app.serverUrl + '/video/upload'),
      //url这里进行了修改
      // url: app.serverUrl + '/video/upload',
    wx.uploadFile({
      url: app.uploadUrl+'/upload',
      filePath: temVideoUrl,
      name: 'file',
      header: {
        'content-type': 'application/json',
        userId:app.getGlobalUserInfo().id,
        userToken:app.getGlobalUserInfo().userToken
      },
      formData: {
        // app.userInfo修改为 app.getGlobalUserInfo
          userId: app.getGlobalUserInfo().id,
          width: width,
          height: height,
          size: size,
          bgmId: bgmId,
          videoSeconds: duration,
          desc: desc
        },
      success: function(res) {
        
        var data = JSON.parse(res.data);
        console.log(data.status);
        console.log(data);
        if (data.status == 200) {
          wx.showToast({
            title: '上传成功',
          });
          wx.navigateBack({
            delta:1
          })

        } else if (data.status == 500) {
          wx.showToast({
            title: "失败",
          })
        }
      }
      
    })
   
  }

 


})

