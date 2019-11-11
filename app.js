//app.js
App({
  serverUrl: "http://127.0.0.1:8085",
  // serverUrl:"http://192.168.137.1:8085",
  // serverUrl: "https://d1e97379.ngrok.io",
  userInfo: null,
  // userfileUrl:'H:\gitReponsitory\douyin\douyin_userFiles\191103F961KC7GHH\face',//已经映射到tomcat下
  globalData: {
    serverUrl: "http://c4982807.ngrok.io:8085",
    userInfo: null,
    userfileUrl: "s"
  },
  setGlobalUserInfo:function(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo:function(){
    return wx.getStorageSync("userInfo");
  }
})