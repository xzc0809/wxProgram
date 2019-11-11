const app = getApp()

Page({
  data: {
    screenWidth: 350,
    serverUrl:app.serverUrl,
    pageNo:1,
    pageCount:null,
    videoList:[],
    postUrl:null,
    searchValue:null,
    isSaveRecord:0,
    
  },

  onLoad: function (params) {
    var me=this;
    //获取搜索词
    var searchValue=params.searchValue;//搜索值
    var isSaveRecord=params.isSaveRecord;//是否保存到数据库
    if(searchValue!=undefined){
      me.setData({
        searchValue:searchValue
      })
    }
    if(isSaveRecord!=undefined){
      me.setData({
        isSaveRecord:isSaveRecord
      })
      
    }
    var me = this;
    var serverUrl=me.data.serverUrl;
    var screenWidth = wx.getSystemInfoSync().screenWidth;//获取当前手机屏幕信息的api
    me.setData({
      screenWidth: screenWidth,
    });
    wx.showLoading({
      title: '获取中...',
    });
    me.showVideo(me.data.pageNo,searchValue)
  },

  showVideo:function(pageNo){//显示视频
    var me=this;
    var postUrl = me.data.serverUrl + '/video/showAll?pageNo=' + pageNo+"&isSaveRecord="+me.data.isSaveRecord;

    wx.request({
      url: postUrl,
      method: 'POST',
      data:{
        videoDesc:me.data.searchValue
      },
      dataType: 'json',
      success: function (res) {
        
        var data = res.data;
        console.log(res.data);
        if (data.status == 200) {
          wx.hideLoading();
          if(pageNo===1){//当为第一页时，把累加list的清空
            me.setData({
                videoList:[]
            })
          }
          
          var newVideoList=me.data.videoList.concat(data.data.rows);
          me.setData({
            videoList: newVideoList,
            pageCount: data.data.pageCount,
            pageNo:pageNo
          })
          wx.hideNavigationBarLoading();//隐藏标题刷新图标
          wx.stopPullDownRefresh();//停止下拉刷新
          console.log(me.data.pageCount)

        } else {
          wx.showToast({
            title: '获取失败，请重试',
            icon: 'none'
          })
        }

      },

    })
  },

  onReachBottom:function(){
    
    var me=this;
    var pageNo=me.data.pageNo;

    me.setData({
      isSaveRecord:0
    });
        //判断是否最后一页
    if(pageNo===me.data.pageCount){
      wx.showToast({
        title: '到底了',
        icon: 'none'        
      });
      return;
    }
    pageNo=pageNo+1;
    me.showVideo(pageNo);

  },
  onPullDownRefresh:function(){//下拉刷新
  wx.showNavigationBarLoading();//标题刷新圆圈
    this.showVideo(1);
  },
  showVideoInfo:function(e){
    console.log(e.target.dataset.arrindex+"触发showVideoInfo");//获取下标
    var index=e.target.dataset.arrindex;
    wx.navigateTo({
      //要携带一个对象过去，需要先转换为字符串,在下一个页面取出时需要再转换为json格式
      url: '../videoinfo/videoinfo?data=' + JSON.stringify(this.data.videoList[index]) ,
    })
  }
   
})
