// var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    url:app.serverUrl,
    fansCounts:0,
    followCounts:0,
    receiveLikeCounts:0,
    nickname:null

  },
  onLoad:function(){
    var me=this;
    if(app.userInfo.faceImage==null){
      this.setData({
        faceUrl: "../resource/images/noneface.png"
      })
      
    }else{
      var faceUrl=app.serverUrl + app.userInfo.faceImage;
      me.setData({
        faceUrl:faceUrl
      })
      console.log(faceUrl)
    }
    wx.request({
      url: app.serverUrl +'/user/queryUserInfo?userId='+app.userInfo.id, //查询用户信息
      method:"POST",
      success:function(res){
        var data=res.data;
        console.log(data.status);
        console.log(data.data.nickname);

        var userToken=app.userInfo.userToken;
        app.userInfo=data.data;//更新用户最新信息
        app.userInfo.userToken=userToken;
        console.log(app.userInfo)
        var fansCounts = data.data.fansCounts;
        var followCounts = data.data.followCounts;
        var receiveLikeCounts = data.data.followCounts;
        var nickname=data.data.nickname;
        me.setData({
          fansCounts: fansCounts,
          followCounts: followCounts,
          receiveLikeCounts: receiveLikeCounts,
          nickname:nickname
        })
      }      
    })
   
    
  },
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
  },
  changeFace:function(){
    var me=this;
    wx.chooseImage({ //选择图片
      count: 1, //选择图片的数量
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths//获取图片的路径，数组形式
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: app.serverUrl+"/user/uploadFace?userId="+app.userInfo.id, //需要上传的url
          filePath: tempFilePaths[0],//图片/文件路径
          name: 'file',
          success(resp) {
            
            var data=JSON.parse(resp.data);
            console.log(data.status);
            console.log(data);
            if(data.status==200){
              wx.showToast({
                title: '上传成功',
              })
              var faceUrl = app.serverUrl+data.data//修改图片url
              me.setData({
                faceUrl:faceUrl
              })
            }else if(data.status==500){
              wx.showToast({
                title: "失败",
              })
            }            
          }
        })
      },
      

    })

  },

  uploadVideo: function () {
    var me=this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 15,
      camera: 'back',
      compressed:'true',
      
      success(res) {
        console.log(res.tempFilePath);
        var duration=res.duration;//时长
        var height=res.height;//长
        var width=res.width;//宽
        var size=res.size;//size
        var temVideoUrl=res.tempFilePath;//视频地址
        var temCoverUrl = res.thumbTempFilePath;//封面的地址
        wx.showLoading({
          title: '上传中...',
        })
        if(duration>15){
          wx.showToast({
            title: '视频不能超过15秒',
            icon:"none"
          })
        }else if(duration<2){
          wx.showToast({
            title: '视频不能小于2秒',
            icon: "none"
          })
        }else{

          //TODD 跳转选择界面
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration
             + '&height=' + height 
             + '&width=' + width 
             + '&size=' + size 
             + '&temVideoUrl=' + temVideoUrl 
             + '&temCoverUrl=' + temCoverUrl,
          })
        }
        console.log(res)
        
      }
    })
  }
  
})
