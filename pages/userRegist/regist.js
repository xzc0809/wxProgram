const app = getApp()

Page({
  

  doRegist:function(e){
    var formObject=e.detail.value;
    var username=formObject.username;
    var password=formObject.password;

    if(username.length==0||password.length==0){
      wx.showToast({//展示提示框
        title: '用户名或密码不能为空',
        icon:'none',
        duration:3000  //提示的延迟时间

      })
      
    }else{
      var url = app.serverUrl;//从app.js中获取全局参数
        console.log(url);
      wx.showLoading({
        title: '提交中...',
      }),
      wx.request({
       
        url: url+'/regist',
        data:{
          username:username,
          password:password
        },
        method:"POST",
        success:function(res){
          console.log(res.data);
          var status=res.data.status;
        
          if(status==200){
            // app.userInfo修改为app.setGlobalUserInfo
            app.setGlobalUserInfo(res.data.data),
            wx.showToast({
              title: res.data.msg,
              duration:3000
            })
          }else if(status==500){
             
              wx.showToast({
                title: res.data.msg,
                icon:'none',
                duration:3000
              })

          }

        }

      })
    }
  },
  goLoginPage:function(){
    wx.redirectTo({
      url: '../userLogin/login',
    })
  }

})