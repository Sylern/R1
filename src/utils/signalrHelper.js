import * as signalR from "@aspnet/signalr";

// eslint-disable-next-line no-extend-native
String.prototype.endsWith = function (str) {
  var reg = new RegExp(str + "$");
  return reg.test(this);
}

function ChatClient(serverRoot) {
  if (!serverRoot.endsWith("/")) {
    serverRoot=serverRoot+'/';
  }

  /* 由于chatLib.js是放到Elderly.MessageHub.Api上的，所以直接写相对路径就行
      如果把chatLib.js部署到应用服务器上，则需要写包含服务器地址的绝对路径 */
  this.connection = new signalR.HubConnectionBuilder()
    .withUrl(serverRoot + "messageHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();
  this.setOnClose = function (f) {
    this.connection.onclose(f);
  };
  this.start = function () {
    try {
      return this.connection.start().catch(()=>{
        setTimeout(() => this.start(), 5000);
      });
    } catch (err) {
      console.log('连接出现问题：' + err);
    }
  };

  this.SetUser = function (user) {
    return this.connection.invoke("SetUser", user).catch(err => console.error('用户加入失败'));
  };

  this.UnSetUser = function () {                    // 注销账号
    return this.connection.invoke("UnSetUser").catch(err => console.error(err));
  };

  this.SetGroup = function (group) { // 加入群组
    return this.connection.invoke("SetGroup", group).catch(/* err => console.error('加入群组') */);
  };

  this.getMessage = function (f) {
    this.connection.on("Notice", f);
  };
}

export { ChatClient }
