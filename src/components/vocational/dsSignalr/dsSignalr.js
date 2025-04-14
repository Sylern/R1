import { ChatClient } from '@/utils/signalrHelperNcDecerp';
import { stockApi } from '@/api/index';
import { kitchenPrintMain } from '@/utils/kitchenPrint.js';
import { onlineOrderPrint, concatSalesTicket, repaymentPrint } from '@/utils/onlineOrderPrint.js';
import { mapMutations, mapState } from 'vuex';
import { printLabel } from '@/utils/prin';

export default {
    name: 'dsSignalr',
    props: {},
    data() {
        return {
            msgBox: null,
            reConnectionTimer: false,               // 断线重连发起时间
            receivedIds: [],                        // 推送去重
            msgList: [],                            // 消息列表
            audioIsEnd: true,                       // 语音播报已结束
            audioList: [],                          // 语音队列
            isClient: false,                        // 是否为客户端
            isHost: false,                          // 是否为主机
            macAddress: '',                         // mac地址
            errConnent: 0,
            print_moreInfo: {
                sv_us_shortname: '',
                sv_ul_name: '',
                sv_us_name: '',
                sv_uit_cache_name: '',
                sv_us_address: '',                  // 店铺地址
                sv_us_phone: '',                    // 店铺电话
                sv_table_name: '',                  // 台号->牌号
                sv_remark: ''
            }
        }
    },
    computed: {
        ...mapState(['masterSignalrStatus', 'JurisdictionObj', 'cashierJurisdiction', 'userInfo'])
    },
    watch: {
        '$route.path': {                                // 消息推送连接/断开
            immediate: true,
            handler(newVal, oldVal) {
                // window.Cef = this.invokeMac().Cef;
                this.isClient = typeof Cef === 'undefined' ? false : true;
                if (this.$app.isNull(this.$app.getLocalStorage('token'))) {
                    // 断开signalr
                    !this.$app.isNull(this.msgBox) && this.msgBox.setOnClose && this.msgBox.setOnClose();
                    this.msgBox = null;
                } else {      // 获取主机 连接signalr
                    if (this.$app.isNull(this.msgBox)) {
                        this.isClient ? this.geteprintconfig() : this.signalr();         // 设置主机信息再连接 或者 直接连接
                    }
                }
            }
        },
        'masterSignalrStatus': {                        // 重新连接消息推送
            handler(newVal, oldVal) {
                if (!this.$app.isNull(this.$app.getLocalStorage('token'))) {
                    // this.msgBox.setOnClose();
                    // this.isClient ? this.geteprintconfig() : this.signalr();
                    // this.update({ key: 'refreshSignalr', data: false })
                    this.isHost = newVal;
                    this.$app.isNull(this.msgBox) ? this.signalr() : this.reRegister();
                }
            }
        }
    },
    created() {
        // 获取mac地址
        // this.handleTestPrintSound();                 // 测试打印 测试微信支付到账声音
        this.getMacAddress();
    },
    mounted() {
        setTimeout(() => {
            window.top.dsTicketPrint = concatSalesTicket;
            window.top.repaymentPrint = repaymentPrint;
        }, 1000);
        // 音频播报结束
        this.$nextTick(() => {
            this.$refs.myAudio && this.$refs.myAudio.addEventListener('ended', this.playEndedHandler, false);
        })
    },
    methods: {
        ...mapMutations(['update']),
        invokeMac() {
            return {
                Cef: {
                    GetMac: function () {
                        return '2C-56-DC-4C-8D-20'
                    }
                }
            }
        },
        async getMacAddress() {
            if (this.isClient && typeof Cef.GetMac !== 'undefined') {
                this.macAddress = typeof Cef.getVersion === 'function' ? await Cef.GetMac() : Cef.GetMac();
            }
        },
        handleTestPrintSound() {                        // 测试打印 测试微信支付到账声音
            // setTimeout(() => {
            //     // // 测试打印
            //     // let printData = [];
            //     // onlineOrderPrint(printData, 'online')
            //     // 测试微信支付到账声音
            //     let res = {
            //         "traceId": "76fe988d-ecff-45e9-b3ce-9255b106acce",
            //         "topicName": "decerp_message_sound_play",
            //         "invokeWay": 0,
            //         "argsObj": [
            //             {
            //                 "Key": "System.String",
            //                 "Value": {
            //                     "notice_type": null,
            //                     "order_info": "{\"Amount\":\"0.01\",\"Payment\":\"微信支付\",\"OrderId\":\"79349246120918248024\"}",
            //                     "guid": "46b0f3e4-8d2e-4b9c-8690-0365a8fcd44a"
            //                 }
            //             }
            //         ]
            //     }
            //     let systemStr = res.argsObj.length > 0 ? res.argsObj.find(e => e.Key === 'System.String') : '';
            //     this.moneySoundPlay(systemStr, res);
            // }, 2000);
        },
        handleMouseenter(row) {                     // 提示框鼠标进入事件
            clearTimeout(row.timer);
        },
        handleMouseleave(row) {                     // 提示框鼠标离开事件
            row.timer = setTimeout(() => {
                this.msgList.splice(this.msgList.findIndex(e => e.traceId === row.traceId), 1)
            }, 60000)
        },
        handleClose(row) {                          // 关闭提示
            this.msgList.splice(this.msgList.findIndex(e => e.traceId === row.traceId), 1)
        },
        handleAdd() {                               // 模拟数据增加一个测试提示框
            let n = Math.random();
            this.msgList.push({
                traceId: n,
                time: this.$app.currentTime(new Date(), 'HH:mm:ss'),
                timer: setTimeout(() => {
                    this.msgList.splice(this.msgList.findIndex(e => e.traceId === n), 1)
                }, 60000)
            });
        },
        handleToOnline(item, index) {               // 跳转到线上订单 并从msgList删掉该消息
            this.msgList.splice(index, 1);
            if (item.type === 'link') {
                this.$router.push(item.url);
                return
            }
            if (item.type === 'show') {
                this.$root.$emit(item.handle);
                return
            }
        },

        handleMsgBox(msgData, orderType) {          // 订单播报
            // 消息弹框
            let messageData = {
                onlineOrder: {
                    tag: '线上',
                    type: 'link',
                    url: '/messageManagemen/onlineOrder?type=all',
                    title: '您有一笔新的订单',
                },
                reservation: {
                    tag: '预约',
                    type: 'link',
                    url: '/reservation/kanban',
                    title: '您有一笔新的预约订单，请及时处理',
                },
                reservationTaked: {
                    tag: '预约',
                    type: 'link',
                    url: '/reservation/kanban',
                    title: '您有一笔新的预约订单，系统为您接单了',
                },
                reservationCancel: {
                    tag: '预约',
                    type: 'link',
                    url: '/reservation/kanban',
                    title: '您有一笔线上预约订单客户已取消，请及时查看',
                },
                feedback: {
                    tag: '反馈消息',
                    type: 'show',
                    handle: 'feedbackMessage',
                    title: '您有一条反馈消息',
                },
                productexchange_notify: {
                    tag: '商品积分兑换消息',
                    type: 'show',
                    handle: 'productexchange_notify',
                    title: '您有一条商品积分兑换消息',
                },
                tableMsg: {
                    tag: '提醒',
                    type: 'show',
                    handle: 'productexchange_notify',
                    title: '您有新的房台即将自动预结，请关注',
                }
            }
            this.msgList.push({
                traceId: msgData.traceId,
                tag: messageData[orderType].tag,
                type: messageData[orderType].type,
                url: messageData[orderType].url,
                handle: messageData[orderType].handle,
                title: messageData[orderType].title,
                time: this.$app.currentTime(new Date(), 'HH:mm:ss'),
                timer: setTimeout(() => {
                    this.msgList.splice(this.msgList.findIndex(e => e.traceId !== msgData.traceId))
                }, 3000)
            });
        },
        reservationSound(soundCode) {               // 预约声音播放
            if (this.$app.isNull(this.$refs.myAudio)) return;
            this.$refs.myAudio.src = `https://ros.decerp.cc/res/audio/${soundCode}.ogg`;
            this.$nextTick(() => {
                this.$refs.myAudio.play();
            })
        },
        orderSound(systemStr, msgJson) {            // 线上订单提醒
            // 区分外卖单、扫码点单
            let audioType = this.$app.isNull(systemStr) ? 0 : systemStr.notice_type;
            let audioName = audioType == 1 ? 'smdcwnjd' : audioType == 2 ? 'nyybxdwmddddcl' : 'onlineOrderMessage_new';
            this.palyAudio(`https://ros.decerp.cc/res/audio/${audioName}.ogg`, systemStr.id, msgJson);
        },
        moneySoundPlay(systemStr, msgJson) {        // 到账金额提醒
            // 到账金额播报
            let orderInfo = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.order_info);
            // !this.$app.isNull(orderInfo) && !this.$app.isNull(orderInfo.Amount) && this.speckText(orderInfo.Amount, msgJson, orderInfo.OrderId);
            if (!this.$app.isNull(orderInfo) && !this.$app.isNull(orderInfo.Amount)) {
                return this.speckText(orderInfo.Amount, msgJson, orderInfo.OrderId);
            }
            this.orderSound(systemStr, msgJson)
        },
        async reConnection() {
            let query = {
                UserId: this.userInfo.user_id + '',
                AppType: this.isClient ? 'PcWeb' : 'Web',
                IsMaster: this.isHost,
                ClientId: this.macAddress,
                CustomType: this.userInfo.sp_salesclerkid + ''
                // IsMaster: true,
                // ClientId: '00-E0-70-5D-32-13'
            }
            try {
                await this.msgBox.start();
                if (this.msgBox.connection.connection.connectionState === 1) {
                    this.msgBox.Register(query);
                }
            } catch (error) {
                setTimeout(() => { this.reConnection() }, 2000)
            }
        },
        reRegister() {
            let query = {
                UserId: this.userInfo.user_id + '',
                AppType: this.isClient ? 'PcWeb' : 'Web',
                IsMaster: this.isHost,
                ClientId: this.macAddress,
                CustomType: this.userInfo.sp_salesclerkid + ''
                // IsMaster: true,
                // ClientId: '00-E0-70-5D-32-13'
            }
            this.msgBox.Register(query);
        },
        async signalr() {                                   // 连接signalr
            let query = {
                UserId: this.userInfo.user_id + '',
                AppType: this.isClient ? 'PcWeb' : 'Web',
                IsMaster: this.isHost,
                ClientId: this.macAddress,
                CustomType: this.userInfo.sp_salesclerkid + ''

                // IsMaster: true,
                // ClientId: '00-E0-70-5D-32-13'
            }
            if (this.msgBox !== null) {
                this.msgBox.Register(query);
                return;
            }

            this.msgBox = new ChatClient();

            await this.msgBox.start().then(_ => {           // 连接推送服务器
                this.msgBox.Register(query);
                this.msgBox.getNoticeAsync && this.msgBox.getNoticeAsync(res => {             // 接收到的推送消息
                    // alert(JSON.stringify(res));
                    if (this.$app.isNull(res)) return
                    // 接收到消息后要拿消息的traceId去调方法 防止收到重复消息
                    if (!this.$app.isNull(res.traceId)) {
                        if (this.receivedIds.includes(res.traceId)) return;
                        this.receivedIds.push(res.traceId);
                        this.msgBox.OnClientReceivedNotice(res.traceId, true);
                    }
                    console.log('getNotice', res);

                    let systemStr = '';
                    let orderId = '';

                    let item = res.argsObj.find(e => e.Key === 'System.String');
                    if (item) {
                        systemStr = JSON.parse(item.Value);
                        orderId = systemStr.id;
                    }
                    switch (res.topicName) {
                        // 先付后吃 直接付款下单   餐饮 对应业务  后厨+宾客+结算小票  主机
                        case 'CheckMaster':
                            this.$message.success('当前是主机');
                            break;
                        case 'ReservationPlaceOrder':
                            // 预约申请自动接单通知
                            this.handleMsgBox(res, 'reservationTaked');
                            this.reservationSound('reservationTaked_v1');
                            (this.$route.path === '/cashier/home' || this.$route.path.indexOf('reservation') > -1)
                                && this.update({ key: 'refreshReservation', data: new Date() }), this.addMsgPrintRecord(orderId, res);
                            break;
                        case 'ReservationApply':
                            // 预约申请通知
                            this.handleMsgBox(res, 'reservation');
                            this.reservationSound('reservation_v1');
                            this.$route.path.indexOf('reservation') > -1 && this.update({ key: 'refreshReservation', data: new Date() }), this.addMsgPrintRecord(orderId, res);
                            break;
                        case 'ReservationAccept':
                            // 预约确认通知
                            break;
                        case 'ReservationCancel':
                            // 预约取消通知
                            this.handleMsgBox(res, 'reservationCancel');
                            this.reservationSound('reservationCancel_v1');
                            break;
                        case 'common_by_shop_server':                           // 小票打印
                            this.getGuestPrint(orderId, res);                   // 获取线上订单
                            break;
                        case 'productexchange_notify':                          // 积分兑换商品提示
                            this.handleMsgBox(res, 'productexchange_notify');
                            this.orderSound(systemStr, res);                    // 声音播报
                            break;
                        case 'PreknotRemind':
                            // 预结提醒
                            const sv_remind_type = systemStr.sv_remind_type;
                            this.$route.path === '/cashier/home' && this.update({ key: 'refreshRoom', data: true })
                            if (sv_remind_type.indexOf('1') > -1) this.handleMsgBox(res, 'tableMsg');
                            if (sv_remind_type.indexOf('2') > -1) this.$root.$emit('tablePrenotRemind');
                            // 您有新的房台即将自动预结，请关注。
                            if (this.audioIsEnd && sv_remind_type.indexOf('3') > -1) this.palyAudio('https://ros.decerp.cc/res/audio/qucan/ftzdyjtx.ogg');
                            break;

                        // 刷房台 对应业务 刷新房台 下单就推送
                        case 'common_by_shop_refresh_desk_server':
                            const refreshPath = ['/cashier/home', '/functionSetting/tableSetting', '/cashier/cashierRoom'];
                            if (refreshPath.includes(this.$route.path)) {
                                this.update({ key: 'refreshRoom', data: true });
                                this.addMsgPrintRecord(orderId, res);
                            }
                            break;

                        //#region 餐饮推送打宾客单
                        // 作为主机（非小程序）接收 打宾客单 - 宾客单
                        case 'guadan_notify_guest':
                            this.getMasterDishPrint(orderId, res, true);
                            break;
                        // 作为主机（非小程序）接收 打宾客单 - 加菜单
                        case 'add_dish_notify_guest':
                            this.getAddMasterDishPrint(orderId, res, true);
                            break;
                        // 作为主机（非小程序）接收 打宾客单 - 退菜单
                        case 'return_notify_guest':
                            this.getReturnPrintNew(orderId, res, true);
                            break;
                        // 作为主机（非小程序）接收 打宾客单 - 并台单
                        case 'mergetable_notify_guest':
                            this.getMergeTablePrint(orderId, res, true);
                            break;
                        // 作为主机（非小程序）接收 打宾客单 - 换台单
                        case 'changetable_notify_guest':
                            this.getChangeTablePrint(orderId, res, true);
                            break;
                        //#endregion

                        //#region 餐饮推送打后厨单
                        // 作为主机（非小程序） 后厨-下单
                        case 'common_by_shop_server_eat_before_pay_order_new':
                            this.getMasterDishPrint(orderId, res, 1);
                            break;
                        // 作为主机（非小程序） 后厨-加菜单
                        case 'common_by_shop_add_dish_notify_order_new':
                            this.getAddMasterDishPrint(orderId, res);
                            break;
                        // 作为主机（非小程序） 后厨-退菜单
                        case 'common_by_shop_return_notify_order':
                            this.getReturnPrintNew(orderId, res);
                            break;
                        // 作为主机（非小程序） 后厨-起菜单
                        case 'common_by_shop_starting_notify_order':
                            this.getStartingPrint(orderId, res);
                            break;
                        // 作为主机（非小程序） 后厨-催菜单
                        case 'common_by_shop_urgedishes_notify_order':
                            this.getUrgedishesPrint(orderId, res);
                            break;
                        // 作为主机（非小程序） 后厨-并台单
                        case 'common_by_shop_mergetable_notify_order':
                            this.getMergeTablePrint(orderId, res);
                            break;
                        // 作为主机（非小程序） 后厨-换台单
                        case 'common_by_shop_changetable_notify_order':
                            this.getChangeTablePrint(orderId, res);
                            break;
                        //#endregion

                        // 小程序宾客单 对应业务  后厨+宾客小票打印 主机
                        case 'common_by_shop_server_eat_before_pay':
                            this.getGuestPrint(orderId, res);
                            break;

                        // 小程序加菜 对应业务 打印后厨加菜+宾客单+声音播报 主机
                        case 'common_by_shop_add_dish_notify':
                            this.handleMsgBox(res, 'onlineOrder');              // 消息弹框
                            this.orderSound(systemStr, res);                    // 声音播报
                            this.getAddDishPrint(orderId, res);                 // 获取加菜单
                            break;

                        // 收银台订单播报 餐饮 对应业务  弹框+声音播报 主机
                        case 'common_by_shop_server_cashier':
                            this.handleMsgBox(res, 'onlineOrder');              // 消息弹框
                            this.orderSound(systemStr, res);                    // 声音播报
                            break;

                        // 收银台订单播报 非餐饮 对应业务 到账金额播报主机
                        case 'decerp_message_sound_play':
                            this.handleMsgBox(res, 'onlineOrder');              // 消息弹框
                            this.moneySoundPlay(systemStr, res);                // 声音播报
                            this.getGuestPrint(orderId, res, 'sound_play');     // 获取线上订单
                            break;

                        // 外卖打印
                        case 'common_takeout_order_message':
                            this.getTakeOutPrintByUserId(orderId, res);         // 获取外卖单
                            break;

                        // 外卖通知
                        case 'common_takeout_order_cashier':
                            this.orderSound(systemStr, res);                    // 声音播报
                            break;
                        case 'FeedBackDistributorSendMsg':
                            // 代理商发，客户收通知
                            this.update({
                                key: 'feedbackCount',
                                data: systemStr.count
                            })
                            // if (this.$route.path === '/cashier/' || this.$route.path === '/cashier/situation') {
                            //     this.$root.$emit('feedbackMessage');
                            // } else {
                            //     this.handleMsgBox(res, 'feedback');
                            // }
                            this.handleMsgBox(res, 'feedback');
                            break;
                        case 'FaceSwipingSend':
                            // 人脸失败推送
                            try {
                                let dataObj = JSON.parse(systemStr.data);
                                this.$root.$emit('handleHeadScan', dataObj);
                            } catch (error) {
                                this.$message.error('推送数据格式错误')
                            }
                            break;
                        case 'decerp_message_sound_callsign':
                            // 取餐叫号
                            try {
                                this.speckOrderNumber(systemStr.order_info, systemStr.times);
                            } catch (error) {
                                this.$message.error('推送数据格式错误')
                            }
                            break;
                        case 'PaymentStatus_Notify':
                            // 购买短信、流量包扫码后推送
                            this.$root.$emit('showPayScan');
                            break;
                        case 'ElectricSwitch':
                            // 电控开关推送
                            this.updateElectricSwitch(systemStr);
                            break;

                        default: break;
                    }
                });
            }).catch(error => {
                console.log(error);
            });

            await this.msgBox && this.msgBox.setOnClose(res => {                 // 断线重连
                // this.msgBox = null;
                this.geteprintconfigForReConnection();
            });
        },
        async speckText(str, msgJson, orderId) {            // 到账语音播放
            if (!this.cashierJurisdiction.OnlineOrderVoiceEnable) return
            this.$nextTick(() => {
                // 把金额转成中文
                let money = this.$app.moneyToCn(str);
                // 字符串转数组用于循环播放音频
                money = money.split('');
                // 金额的音频文件名称对象 {'零':'0.ogg','壹':'1.ogg'......}
                let textList = '';

                let first = this.userInfo.distributor_id == 1 ? '德客到账' : '代理商到账';
                // 把'德客提醒您到账' 语音push到音频列表
                this.audioList.push(textList[first]);
                // 循环数组把金额语音push到音频列表
                for (var i = 0; i < money.length; i++) {
                    let url = '';
                    url = textList[money[i]]
                    this.audioList.push(url)
                }
                // 播报第一个音频
                this.palyAudio(this.audioList.shift(), orderId, msgJson);
                // 关闭音频循环播放
                this.$refs.myAudio.loop = false;
                // 音频播报结束再播下一个
                this.$refs.myAudio.addEventListener('ended', this.playEndedHandler, false);
            })
        },
        speckOrderNumber(orderNumberString, times) {        // 叫号语音播放
            if (this.$app.isNull(orderNumberString)) return
            this.audioList = [];
            this.$nextTick(() => {
                const orderNumberOgg = {
                    A: 'https://ros.decerp.cc/res/audio/qucan/A.ogg',
                    B: 'https://ros.decerp.cc/res/audio/qucan/B.ogg',
                    C: 'https://ros.decerp.cc/res/audio/qucan/C.ogg',
                    D: 'https://ros.decerp.cc/res/audio/qucan/D.ogg',
                    E: 'https://ros.decerp.cc/res/audio/qucan/E.ogg',
                    0: 'https://ros.decerp.cc/res/audio/qucan/0.ogg',
                    1: 'https://ros.decerp.cc/res/audio/qucan/1.ogg',
                    2: 'https://ros.decerp.cc/res/audio/qucan/2.ogg',
                    3: 'https://ros.decerp.cc/res/audio/qucan/3.ogg',
                    4: 'https://ros.decerp.cc/res/audio/qucan/4.ogg',
                    5: 'https://ros.decerp.cc/res/audio/qucan/5.ogg',
                    6: 'https://ros.decerp.cc/res/audio/qucan/6.ogg',
                    7: 'https://ros.decerp.cc/res/audio/qucan/7.ogg',
                    8: 'https://ros.decerp.cc/res/audio/qucan/8.ogg',
                    9: 'https://ros.decerp.cc/res/audio/qucan/9.ogg',
                }

                // 把'请' 语音push到音频列表
                const tempAudioList = [];
                tempAudioList.push('https://ros.decerp.cc/res/audio/qucan/please.ogg');

                // 循环取餐号把语音push到音频列表
                for (let i = 0; i < orderNumberString.length; i++) {
                    if (orderNumberOgg[orderNumberString.slice(i, i + 1)]) {
                        tempAudioList.push(orderNumberOgg[orderNumberString.slice(i, i + 1)])
                    }
                }
                // 把'顾客到前台取餐' 语音push到音频列表
                tempAudioList.push('https://ros.decerp.cc/res/audio/qucan/gkdqtqc.ogg');

                for (let index = 0; index < times; index++) {
                    this.audioList = this.audioList.concat(tempAudioList)
                }

                // 播报第一个音频
                this.palyAudio(this.audioList.shift());
                if (this.$refs.myAudio) {
                    // 关闭音频循环播放
                    this.$refs.myAudio.loop = false;
                    // 音频播报结束再播下一个
                    this.$refs.myAudio.addEventListener('ended', this.playEndedHandler, false);
                }
            })
        },
        playEndedHandler() {                                // audio对象音频播放结束回调函数
            this.audioIsEnd = true;
            this.palyAudio(this.audioList.shift());
            // 只有一个元素时解除监听事件
            !this.audioList.length && this.$refs.myAudio.removeEventListener('ended', this.playEndedHandler, false);
        },
        palyAudio(audioUrl, orderId, msgJson) {             // 播放音频
            if (this.$app.isNull(this.$refs.myAudio) || this.$app.isNull(audioUrl)) return
            this.$refs.myAudio.src = audioUrl;
            this.$nextTick(() => {
                this.$refs.myAudio.play().then(_ => {
                    this.audioIsEnd = false;
                    orderId && msgJson && this.addMsgPrintRecord(orderId, msgJson);
                }).catch(e => {
                    orderId && msgJson && this.addMsgPrintRecord(orderId, msgJson, 501);
                })
            })
        },
        getMasterDishPrint(orderId, msgJson, front = false) {           // 作为主机，获取下单 并打印
            // 不是客户端/主机不请求接口 防止打印丢单
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let query = {
                id: orderId,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getMasterPrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.print_moreInfo = {
                        sv_us_shortname: res.user_info.sv_us_shortname,
                        sv_ul_name: res.user_info.sv_ul_name,
                        sv_us_name: res.user_info.sv_us_name,
                        sv_uit_cache_name: res.user_info.sv_uit_cache_name,
                        sv_us_address: res.user_info.sv_us_address,
                        sv_us_phone: res.user_info.sv_us_phone,
                        sv_remark: res.catering_table.sv_remark,
                        sv_table_name: res.catering_table.sv_table_name
                    }
                    this.addMsgPrintRecord(orderId, msgJson);
                    if (front) {
                        this.handelFrontPrint(res.without_product.productResults, 1, res.catering_table);
                    } else {
                        this.getKitchenPrinter(res.without_product.productResults, 'online', res.catering_table);
                    }
                }
            })
        },
        getAddMasterDishPrint(orderId, msgJson, front = false) {        // 作为主机，获取加菜单 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let addfood_id = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).addfood_id;
            let query = {
                id: orderId,
                addfood_id: addfood_id,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201,
                orderPlatform: 1,
            }
            stockApi.getAddMasterDishPrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.print_moreInfo = {
                        sv_us_shortname: res.user_info.sv_us_shortname,
                        sv_ul_name: res.user_info.sv_ul_name,
                        sv_us_name: res.user_info.sv_us_name,
                        sv_uit_cache_name: res.user_info.sv_uit_cache_name,
                        sv_us_address: res.user_info.sv_us_address,
                        sv_us_phone: res.user_info.sv_us_phone,
                        sv_remark: res.catering_table.sv_remark,
                        sv_table_name: res.catering_table.sv_table_name
                    }
                    this.addMsgPrintRecord(orderId, msgJson);
                    if (front) {
                        this.handelFrontPrint(res.without_product.productResults, 2, res.catering_table);
                    } else {
                        this.getKitchenPrinter(res.without_product.productResults, 'add', res.catering_table);
                    }
                }
            })
        },
        getReturnPrintNew(orderId, msgJson, front = false) {            // 作为主机，获取退菜单 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let returnfood_id = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).returnfood_id;
            let query = {
                id: orderId,
                returnfood_id: returnfood_id,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getReturnPrintNew(query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.print_moreInfo = {
                        sv_us_shortname: res.user_info.sv_us_shortname,
                        sv_ul_name: res.user_info.sv_ul_name,
                        sv_us_name: res.user_info.sv_us_name,
                        sv_uit_cache_name: res.user_info.sv_uit_cache_name,
                        sv_us_address: res.user_info.sv_us_address,
                        sv_us_phone: res.user_info.sv_us_phone,
                        sv_remark: res.catering_table.sv_remark,
                        sv_table_name: res.catering_table.sv_table_name
                    }
                    if (front) {
                        this.handelFrontPrint(res.without_product.productResults, 3, res.catering_table);
                    } else {
                        this.getKitchenPrinter(res.without_product.productResults, 'return', res.catering_table);
                    }
                }
            })
        },
        getStartingPrint(orderId, msgJson) {                            // 作为主机，获取起菜单 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let food_id = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).food_id;
            let query = {
                id: orderId,
                food_id: food_id,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getStartingPrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.print_moreInfo = {
                        sv_us_shortname: res.user_info.sv_us_shortname,
                        sv_ul_name: res.user_info.sv_ul_name,
                        sv_us_name: res.user_info.sv_us_name,
                        sv_uit_cache_name: res.user_info.sv_uit_cache_name,
                        sv_us_address: res.user_info.sv_us_address,
                        sv_us_phone: res.user_info.sv_us_phone,
                        sv_remark: res.catering_table.sv_remark,
                        sv_table_name: res.catering_table.sv_table_name
                    }
                    this.getKitchenPrinter(res.without_product.productResults, 'unWait', res.catering_table);
                }
            })
        },
        getUrgedishesPrint(orderId, msgJson) {                          // 作为主机，获取催菜单 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let food_id = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).food_id;
            let query = {
                id: orderId,
                food_id: food_id,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getUrgedishesPrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.print_moreInfo = {
                        sv_us_shortname: res.user_info.sv_us_shortname,
                        sv_ul_name: res.user_info.sv_ul_name,
                        sv_us_name: res.user_info.sv_us_name,
                        sv_uit_cache_name: res.user_info.sv_uit_cache_name,
                        sv_us_address: res.user_info.sv_us_address,
                        sv_us_phone: res.user_info.sv_us_phone,
                        sv_remark: res.catering_table.sv_remark,
                        sv_table_name: res.catering_table.sv_table_name
                    }
                    this.getKitchenPrinter(res.without_product.productResults, 'call', res.catering_table);
                }
            })
        },
        getMergeTablePrint(orderId, msgJson, front = false) {           // 作为主机，获取并台 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let table_id_old = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).table_id_old;
            let table_id = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).table_id;
            let query = {
                id: orderId,
                table_id_old: table_id_old,
                table_id: table_id,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getMergeTablePrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.print_moreInfo = {
                        sv_us_shortname: res.user_info.sv_us_shortname,
                        sv_ul_name: res.user_info.sv_ul_name,
                        sv_us_name: res.user_info.sv_us_name,
                        sv_uit_cache_name: res.user_info.sv_uit_cache_name,
                        sv_us_address: res.user_info.sv_us_address,
                        sv_us_phone: res.user_info.sv_us_phone,
                        sv_remark: res.catering_table.sv_remark,
                        sv_table_name: res.catering_table.sv_table_name
                    }
                    if (front) {
                        this.handelFrontPrint(res.without_product.productResults, 4, res.catering_table);
                    } else {
                        this.getKitchenPrinter(res.without_product.productResults, 'and', res.catering_table);
                    }
                }
            })
        },
        getChangeTablePrint(orderId, msgJson, front = false) {          // 作为主机，获取换台 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let table_id_old = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).table_id_old;
            let table_id = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).table_id;
            let query = {
                id: orderId,
                table_id_old: table_id_old,
                table_id: table_id,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getChangeTablePrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.print_moreInfo = {
                        sv_us_shortname: res.user_info.sv_us_shortname,
                        sv_ul_name: res.user_info.sv_ul_name,
                        sv_us_name: res.user_info.sv_us_name,
                        sv_uit_cache_name: res.user_info.sv_uit_cache_name,
                        sv_us_address: res.user_info.sv_us_address,
                        sv_us_phone: res.user_info.sv_us_phone,
                        sv_remark: res.catering_table.sv_remark,
                        sv_table_name: res.catering_table.sv_table_name
                    }
                    if (front) {
                        this.handelFrontPrint(res.without_product.productResults, 5, res.catering_table);
                    } else {
                        this.getKitchenPrinter(res.without_product.productResults, 'change', res.catering_table);
                    }
                }
            })
        },
        getGuestPrint(orderId, msgJson, type = null) {                  // 小程序获取宾客单 并打印
            // 不是客户端/主机不请求接口 防止打印丢单
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let query = {
                id: orderId,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getGuestPrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    onlineOrderPrint([res], this.$app.isNull(type) ? 'online' : 'waiting');
                    this.addMsgPrintRecord(orderId, msgJson);
                }
            })
        },
        getTakeOutPrintByUserId(orderId, msgJson) {                     // 小程序获取外卖单 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let query = {
                id: orderId,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201
            }
            stockApi.getTakeOutPrintByUserId(query).then(res => {
                if (!this.$app.isNull(res)) {
                    onlineOrderPrint([res], 'online')
                    this.addMsgPrintRecord(orderId, msgJson);
                }
            })
        },
        getAddDishPrint(orderId, msgJson, type) {                       // 小程序获取加菜单 并打印
            if (!this.isClient || this.$app.isNull(orderId)) return;
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let addfood_id = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).addfood_id;
            let query = {
                id: orderId,
                addfood_id: addfood_id,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201,
                orderPlatform: 1,
            }
            stockApi.getAddDishPrint(query).then(res => {
                if (!this.$app.isNull(res)) {
                    onlineOrderPrint([res], type ? type : 'add')
                    this.addMsgPrintRecord(orderId, msgJson);
                }
            })
        },
        geteprintconfigForReConnection() {                              // 获取主机信息
            this.errConnent++;
            if (this.errConnent > 20) {
                return window.parent.location.href = window.location.href.indexOf('vueview') >= 0 ? '/login' : '/#/login';
            }
            stockApi.geteprintconfig().then(res => {
                if (!this.$app.isNull(res) || !this.$app.isNull(this.macAddress)) {
                    this.isHost = res === this.macAddress ? true : false;
                }
                this.errConnent = 0;
                this.reConnection();
            }).catch(_ => {
                setTimeout(() => {
                    this.geteprintconfigForReConnection();
                }, 2000)
            })
        },
        geteprintconfig() {                                             // 获取主机信息
            stockApi.geteprintconfig().then(res => {
                if (!this.$app.isNull(res) || !this.$app.isNull(this.macAddress)) {
                    this.isHost = res === this.macAddress ? true : false;
                    if (this.isHost !== this.masterSignalrStatus) {
                        this.update({
                            key: 'masterSignalrStatus',
                            data: this.isHost
                        })
                    } else {
                        this.signalr();
                    }
                }
            })
        },
        addMsgPrintRecord(orderId, msgJson, state = 301) {              // 获取主机信息
            const systemStr = msgJson.argsObj.find(e => e.Key === 'System.String');
            let guid = this.$app.isNull(systemStr) ? '' : JSON.parse(systemStr.Value).guid;
            let query = {
                id: orderId,
                guid: guid,
                topic: msgJson.topicName,
                add_source: this.isClient ? 301 : 201,
                state: state,
                print_data: '',
            };
            stockApi.addMsgPrintRecord(query)
        },
        handelFrontPrint(dataList, printType) {                         // 餐饮前台单打印
            // printType 1宾客单  
            let printTypeText = ['', '宾客单', '加菜单', '退菜单', '并台单', '换台单'];
            let printDataList = [];

            let dataArray1 = [
                {
                    type: 'line',
                    text: this.print_moreInfo.sv_us_shortname,
                    size: 17,
                    lineHeight: 30,
                    align: 1
                },
                {
                    type: 'line',
                    text: printTypeText[printType],
                    size: 14,
                    lineHeight: 24,
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '房台：' + this.print_moreInfo.sv_table_name,
                    size: 12,
                    lineHeight: 20
                },
                {
                    type: 'line',
                    text: '时间：' + this.$app.currentTime(new Date())
                },
                {
                    type: 'line',
                    text: '操作员：' + this.print_moreInfo.sv_ul_name
                }
            ]
            // 合并打印数组-第一部分
            printDataList = printDataList.concat(dataArray1);
            let tableData = {
                header: ['商品/编码', '数量', '单价', '小计'],
                list: [],
                footer: []
            }
            let buyNumber = 0, dealMoney = 0;
            tableData.list = dataList.map(e => {
                buyNumber = this.$app.addNumber(buyNumber, e.number);
                dealMoney += this.$app.multiplyNumber(e.dealPrice, e.number);
                let specs = '', tastes = '', chargings = ''
                e.specs.forEach(k => {
                    specs += '[' + k.name + k.price + '元]'
                })
                e.tastes.forEach(k => {
                    tastes += '[' + k.name + k.price + '元]'
                })
                e.chargings.forEach(k => {
                    chargings += '[' + k.name + k.price + '元]'
                })
                let productName = e.productName + specs + tastes + chargings;
                return {
                    name: e.isPackage ? '※' + productName : productName,
                    code: e.barCode,
                    number: e.number + '',
                    remark: e.remark || null,
                    specs: [],
                    tastes: [],
                    chargings: [],
                    couponMoney: e.productCouponMoney,
                    price: this.$app.moneyFixed(e.price, 2),
                    dealPrice: e.dealPrice,
                    total: this.$app.moneyFixed(e.dealMoney, 2),
                    packageGroups: e.isPackage ? e.packageGroups : null
                }
            })
            tableData.footer = ['合计', buyNumber + '', '', this.$app.moneyFixed(dealMoney)];
            let isDriverType = this.cashierJurisdiction.printName.indexOf('免驱动') < 0;
            let tableArray = this.$app.printTableDateCater(tableData, isDriverType, this.$store.state.printTemplate.salesData.width);
            // 合并打印数组-表格
            printDataList = printDataList.concat(tableArray);

            let shopInfo = []
            shopInfo.push({ type: 'line', text: this.$app.isNull(this.print_moreInfo.sv_remark) ? '' : ('备注：' + this.print_moreInfo.sv_remark), spaceLine: 2 })

            // 宾客单\加菜单\退菜单不要谢谢惠顾
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '谢谢惠顾，欢迎下次光临', align: 1 })

            printDataList = printDataList.concat(shopInfo);
            this.$print.sales(printDataList);
        },
        async getTemplate() {                                           // 获取用户标签模板
           
        },
        getFoodTastes(e) {                                              // 获取口味
            let tastes = '';
            !this.$app.isNull(e.tastes) && (tastes = e.tastes.reduce((txt, item, i) => (txt + (i === 0 ? '' : ' ') + item.name), ''));
            !this.$app.isNull(e.chargings) && (tastes += e.chargings.reduce((txt, item, i) => (txt + (i === 0 ? '' : ' ') + item.name), ' '));
            return tastes
        },
        async printPriceTag(e, kitchenPrinter) {                        // 打印商品标签
            await this.getTemplate()
            if (this.$app.isNull(this.templateList)) return this.$message.error('获取标签模板数据失败')
            const temJson = this.templateList.find(e => e.templateId === kitchenPrinter[0].sv_labeltemplate_id);
            let productName = e.productName;
            !this.$app.isNull(e.specs) && (productName += '(' + e.specs[0].name + ')');
            const tastes = this.getFoodTastes(e);
            const prData = {
                sv_p_name: productName,                                     // 商品名称
                sv_production_date: new Date(),                             // 打印时间
                tastes: tastes,                                             // 口味
                sv_p_unitprice: e.dealPrice,                                // 单价
                sv_productionplace: this.print_moreInfo.sv_us_address,      // 店铺地址
                sv_us_phone: this.print_moreInfo.sv_us_phone,               // 店铺电话
                sv_catering_grade: this.print_moreInfo.sv_table_name,       // 台号->牌号
            }

            for (let i = 0; i < e.number; i++) {
                printLabel({
                    data: [prData],
                    tem: temJson,
                    printName: kitchenPrinter[0].sv_printer_ip,
                    dir: '0',
                    columnNum: 1,
                    userInfo: {
                        sv_us_name: this.print_moreInfo.sv_us_name,
                        sv_uit_cache_name: this.print_moreInfo.sv_uit_cache_name
                    }
                });
            }
        },
        getKitchenPrinter(dataList, type) {                             // 获取厨打方案并打印
            let ids = [];
            dataList.forEach(e => {
                if (e.isPackage) {
                    e.packageGroups.forEach(p => {
                        p.products.forEach(k => {
                            ids.push({ packageproduct_id: e.productId, packagegroup_id: p.id, product_id: k.productId })
                        })
                    })
                } else {
                    ids.push({ product_id: e.productId, packageproduct_id: 0, packagegroup_id: 0 })
                }
            })
            stockApi.getKitchenPrinter(ids).then(res => {
                if (res) {
                    const extendInfo = {
                        tableName: '',
                        everyday_serialnumber: '',
                        orderTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        remark: '',
                    }
                    kitchenPrintMain(res, dataList, type, extendInfo);
                }
            });
        },
        async updateElectricSwitch(systemStr) {                         // 打开/关闭电控开关
            try {
                if (this.isClient) {
                    await Cef.poolTableLightControll(systemStr.sv_port, systemStr.sv_switch, parseInt(systemStr.sv_electric_num));
                    await stockApi.electricSwitchLog({ sv_electric_id: systemStr.sv_electric_id, sv_switch: systemStr.sv_switch }).then(res => { });
                }
            } catch (error) {

            }
            return
        },
    }
};