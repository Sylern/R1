import * as signalR from "@aspnet/signalr";
import base from "@/api/base";

function ChatClient() {

    /* 由于chatLib.js是放到Elderly.MessageHub.Api上的，所以直接写相对路径就行
        如果把chatLib.js部署到应用服务器上，则需要写包含服务器地址的绝对路径 */
    this.connection = new signalR.HubConnectionBuilder()
        .withUrl(base.ncClientApi + '/notice')
        .configureLogging(signalR.LogLevel.Information)
        .build();
    this.setOnClose = function (f) {
        this.connection.onclose(f);
    };
    this.start = function () {
        return this.connection.start()
    };
    this.Register = function (query) {
        return this.connection.invoke("Register", query).catch(err => console.error('失败：' + err));
    };
    this.OnClientReceivedNotice = function (traceId, isAccepted) {      // 防止接收重复消息 isAccepted没有错误之类一般传true
        return this.connection.invoke("OnClientReceivedNotice", traceId, isAccepted).catch(err => console.error('失败：' + err));
    };

    this.getNoticeAsync = function (f) {
        this.connection.on("NoticeAsync", f);
    };
}

export { ChatClient }
