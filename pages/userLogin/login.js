const app = getApp()

Page({
  data: {
    redirectUrl:'../mine/mine'
  },

  onLoad: function (params) {
    var me = this;
    var redirectUrl = params.redirectUrl;
    // debugger;
    if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
      redirectUrl = redirectUrl.replace(/#/g, "?");//字符串的替换
      redirectUrl = redirectUrl.replace(/@/g, "=");
      //获取到真正的url
      console.log("登录后转到videoInfo的url"+redirectUrl)
      me.setData({
        redirectUrl:redirectUrl
      })  
    }
  },

  // 登录  
  doLogin: function (e) {
    var me = this;
    var url=app.serverUrl;
    var formObject=e.detail.value;
    var username=formObject.username;
    var password=formObject.password;
    console.log("登录"+username);
    wx.showLoading({
      title: '请等待...',
    })
    if(username.length==0||password.length==0){
      wx.showToast({
        title: '用户名或密码不能为空',
        icon:'none',
        duration:3000
      })
    }else{
   
      wx.request({
        url: url+'/login',
        data:{
          username:username,
          password:password
        },
        method:'POST',
        success:function(res){
         
          var status=res.data.status;
          
          if(status==200){
         
            wx.showToast({
              title: '登录成功',
            });
            //app.userInfo修改为app.setGlobalUserInfo
            app.setGlobalUserInfo(res.data.data);
            console.log(app.getGlobalUserInfo);
            // console.log(app.userInfo);
            // console.log(app.userInfo.faceImage);
            wx.redirectTo({
              url: me.data.redirectUrl,
          
            })
          
          }else if(status==500){
           
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }else if(status==201){
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }else{
          
            wx.showToast({
             
              title: '系统错误，请联系管理员，或检查网络',
              icon:'none'
            })
          }
        }
      })
    }
    console.log(username);
  },

  goRegistPage:function() {
    wx.navigateTo({
      url: '../userRegist/regist',
    })
  }
})