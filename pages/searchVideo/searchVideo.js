// pages/searchVideo/searchVideo.js
const app=getApp();
var WxSearch = require('../wxSearchView/wxSearchView.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotList:[]
  },
  onLoad:function(){
 
  var that = this;
  var me=this;
  wx.request({
    url: app.serverUrl +'/video/getHotSearch',
    method: 'POST',
    success: function(res) {
      me.setData({
        hotList: res.data.data
      
    }),
       WxSearch.init(   // 2 搜索栏初始化
        that,  // 本页面一个引用
        that.data.hotList,
        that.data.hotList,
          // ['大哥大', '非凡哥', "刘非凡", "闯天涯", '干一杯', '傻女内'], // 热点搜索推荐，[]表示不使用
          // ['大哥大', '非凡哥', "刘非凡", "闯天涯", '干一杯', '傻女内'],// 搜索匹配，[]表示不使用
        that.mySearchFunction, // 提供一个搜索回调函数
        that.myGobackFunction //提供一个返回回调函数
        );

    } 
  })

},

  // 3 转发函数，固定部分，直接拷贝即可
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    // 示例：跳转
    wx.redirectTo({
      url: '../index/index?searchValue=' + value+'&isSaveRecord=1'
    })
  },

  // 5 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 示例：返回,直接返回，不携带参数
    wx.redirectTo({
      url: '../index/index'
    })
  }
})