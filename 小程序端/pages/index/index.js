const app = getApp()
const devicesId = "654690592" //填写在OneNet上获得的devicesId 形式就是一串数字
const api_key = "nsSWK8nyNDhjIo46ylZ0z3tQZ4I=" //填写在OneNet上的 api-key 
const util = require('../../utils/util.js')

Page({
  data: {
    cmd:0,
    deviceConnected:false,
    num:0,
    no:1,
    title_color:'#a9e6f5'
  },

  onLoad: function () {
    console.log(`your deviceId: ${devicesId}, apiKey: ${api_key}`)
    this.getDeviceInfo()
  },

  //检验设备情况
  getDeviceInfo:function() {
    var that = this
    wx.request({
      url: `https://api.heclouds.com/devices/${devicesId}`,
      header:{
        'api-key':api_key
      },
      method:'GET',
      success:function(res){
        //console.log(res);
        if(res.data.data.online){
          console.log("设备已经连接")
          that.setData({
            deviceConnected:true
          })
        }
        else{
          console.log("设备还未连接")
          that.setData({
            deviceConnected:false
          })
        }
      },
      fail:function(){
        console.log("请求失败") 
        that.setData({
          deviceConnected:false
        })
      }
    })
  },

  //一键铲屎事件
  ShovelShit:
    util.throttle(function(){
      this.setData({
        cmd:3,
        num:this.data.num+1
      })
       this.sendcmd(
        setTimeout(() => {
          this.setData({
            num:0
          })
        },2000)
      )
    })
  ,

  //一键换砂事件
  ChangeSand:
    util.throttle(function(){
      this.setData({
        cmd:3,
        num:this.data.num+1
      })
       this.stopcmd(
        setTimeout(() => {
          this.setData({
            num:0
          })
        },2000)
      )
    })
  ,

  //将输入数据发送至onenet平台
  getDatapoints: function () {
    console.log("已被调用")
    wx.request({
      url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream`,
      header: {
        'content-type': 'application/json',
        'api-key':api_key
      },
      data:{
        "datastreams": [{
          "id": "message",
          "datapoints": [
          {
            "value": this.data.cmd
          }]
        }]
      },
      method:"POST",
    })
  },

  //发送命令
  sendcmd:function(){
    wx.request({
      url: `http://api.heclouds.com/cmds?device_id=${devicesId}&timeout=3600`,
      header:{
        'content-type': ' text/plain',
        'api-key':api_key
      },
      data:String(3),
      method:'POST',
      success:function(res){
        console.log(res)
      }
    })
  },

  stopcmd:function() {
    wx.request({
      url: `http://api.heclouds.com/cmds?device_id=${devicesId}&timeout=3600`,
      header:{
        'content-type': ' text/plain',
        'api-key':api_key
      },
      data:String(1),
      method:'POST',
      success:function(res){
        console.log(res)
      }
    })
  }
})