const app = getApp()

Page({
  data: {

    videoUrl: app.serverUrl +'/191103F961KC7GHH/video/62a80208-fe6e-4f91-a503-2a3433316de2.mp4',
    
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }]
      
  },

  bindplay:function() {
    console.log("播放");
  },
  bindpause: function () {
    console.log("暂停");
  },
  onPullDownRefresh:function(){
    this.onLoad();
  }
  

})