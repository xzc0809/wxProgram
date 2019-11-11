// var videoUtil = require('../../utils/videoUtil.js')
//封装上传视频函数
 
function uploadVideo() {
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
  

module.exports = {
  uploadVideo: uploadVideo
}
