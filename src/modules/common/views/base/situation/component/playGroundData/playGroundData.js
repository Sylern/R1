import { stockApi } from '@/api'
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import base from '@/api/base';
import { mapState } from 'vuex'
export default {
    components: { payTypeList },
    model: {
        prop: 'show',
        event: 'input'
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },

    data() {
        this.intervalTime = 60000     //间隔60秒定时获取一次数据
        this.timer = null
        return {
            query: {
                InOutStatus: 2,       //null全部 2在场 1 离场
                BeginDate: "",        //开始时间
                EndDate: "",          //结束时间
                Page: 1,              //页码
                BarCode: "",          //票码
                userId: "",           //店铺id
                Size: 10,             //页量
            },
            list: [],
            total: 0,
            checkedAll: false,        //票据是否全选
            checkedJson: [],          //当前选中的票据id
            dateType: "today",        //时间帅选类型
            showClearDlg: false,
            endTime: "",              //清场截止时间
            isRefresh: false,         //刷新动画
            timeoutCount: 0,          //超时票数
            paybackMoney: 0,          //补款金额
            refundMoney: 0,           //应退金额


            showNoDlg: false,        //搜索票码弹窗
            outGates: [],            //可选闸机列表
            currentGateSN: '',       //当前选中闸机
            outInfo: {},             //出闸票信息
            inInfos: [],             //入闸票信息
            memberInfo: {            // 当前票码拥有的会员
                member_id: ''
            },
            consumeId: 0,            //当前选择入闸的商品表示id
            showInOutVerify: false,  //出入闸弹窗
            verifyName: "inVerify",  //出闸还是入闸
            barCode: "",             //搜索的票码

            payInfo: {
                queryId: '',
                money: ""           //实收金额
            },
            payQuery: {
                totalMoney: 0,
                dealMoney: 0,
                payments: [
                    {
                        name: "", //"扫码付",
                        money: 0,
                    }
                ],
                caleDto: {
                    buySteps: [
                        {
                            index: 1,
                            productId: 0,
                        }
                    ],
                    memberId: "",
                    currentStep: 3,
                },
                remark: "", //"订单：xxx，游玩码：xxx，补款1元",
                sourceType: 100,
                isSettle: true,
            },
            Forbid: ""
        }
    },
    watch: {
        show: {
            handler(val) {
                const ymd = this.$app.currentTime(new Date(), "yyyy-MM-dd")
                this.query.BeginDate = `${ymd} 00:00:00`
                this.query.EndDate = `${ymd} 23:59:59`
                this.dateType = 'today'
                this.query.userId = this.$store.state.userInfo.user_id
                val && this.ConsumeInfos()
                !val && this.timer && this.clearInterval()
                val && (this.Forbid = this.userInfo.user_id + '' + new Date().getTime())
            },
            immediate: true
        }
    },
    computed: {
        ...mapState(['userInfo']),
        outInBtnTxt() {
            const { verifyName, outInfo } = this
            const { refundMoney = 0, paybackMoney = 0 } = outInfo
            if (verifyName === 'inVerify') { return '验票入闸' }
            if (paybackMoney > 0) { return '补款出闸' }
            if (refundMoney > 0) { return '退款出闸' }
            return '验票出闸'
        },
        halfwayOutTxt() {
            // 补款出闸、退款出闸、中途离场
            const { verifyName } = this
            if (verifyName === 'inVerify') { return '' }
            return "中途离场"
        }
    },

    destroyed() {
        this.timer && this.clearInterval()
    },
    methods: {
        //#region  方法
        initPayQuery() {
            this.payQuery = {
                totalMoney: 0,
                dealMoney: 0,
                payments: [
                    {
                        name: "", //"扫码付",
                        money: 0,
                    }
                ],
                caleDto: {
                    buySteps: [
                        {
                            index: 1,
                            productId: 0,
                        }
                    ],
                    memberId: "",
                    currentStep: 3,
                },
                remark: "", //"订单：xxx，游玩码：xxx，补款1元",
                sourceType: 100,
                isSettle: true,
            }
        },
        sendMessage(messages = [], gateSN) {
            if (messages.length === 0) { return Promise.resolve() }
            const messageIdMap = {
                test: '200',
                open: '201',
                playmusic: '202'
            }
            const params = { gateSN }
            const item = messages[0]
            if (typeof (item) === 'string') {
                params.messageId = messageIdMap[item]
                params.command = item
            } else {
                const [[key, arg]] = Object.entries(item)
                params.messageId = messageIdMap[key]
                params.command = key
                params.commandArg = arg
            }
            return stockApi.ControlGate(params).finally(() => {
                return this.sendMessage(messages.slice(1), gateSN)
            })
        },

        SwipeBarCode4Web(actionType = 5) { /*actionType 1中途离场 2退款离场 3补款离场 4离场 5入场*/
            const { consumeId, currentGateSN } = this
            if (currentGateSN === "") { this.$message({ type: "error", message: "请选择闸机" }); return Promise.reject("请选择闸机") }
            if (!consumeId) { this.$message({ type: "error", message: "consumeId不能为空" }); return Promise.reject("consumeId不能为空") }
            const dateTime = this.$app.currentTime(new Date(), "yyyy-MM-dd HH:mm:ss")
            return stockApi.SwipeBarCode4Web({ consumeId: consumeId, gateSN: currentGateSN, dateTime, actionType }).then(arg => {
                // this.$message({ type: "success", message: `${actionType === 5 ? '入闸成功' : '出闸成功'}` })
                this.$message({ type: "success", message: '验票成功' })
                this.initVerify()
                this.barCode = ""
                this.ConsumeInfos()
                return arg
            })
        },
        initOutGates(outGates, directionType) {   //directionType 1进出，2只进，3只出
            if (outGates.length === 0) return
            this.outGates = (outGates || []).filter(item => (+item.sv_direction === 1) || (+item.sv_direction === +directionType)).map(item => ({ value: item.sv_sn, label: item.sv_name }))
            this.currentGateSN = this.outGates[0].value || ""
        },
        initVerify() {
            this.currentGateSN = ""
            this.memberInfo = {
                member_id: ''
            }
            this.inInfos = []
            this.outInfo = {}
            this.payInfo.money = ""
            this.payInfo.queryId = ""
            this.consumeId = 0
            this.outGates = []
        },

        clearInterval() {
            clearInterval(this.timer);
            this.timer = null
        },
        ConsumeInfos(isInterval) {
            const { checkedJson } = this
            this.clearInterval()
            return stockApi.ConsumeInfos(this.query).then(res => {
                const { total, datas, infos } = res
                this.timeoutCount = infos.timeoutCount || 0
                this.paybackMoney = infos.paybackMoney || 0
                this.refundMoney = infos.refundMoney || 0
                this.total = total || 0
                this.list = (datas || []).map(item => {
                    item.checked = checkedJson.findIndex(checkedId => `${item.id}` === `${checkedId}`) > -1;
                    return item
                })
                this.list.length > 0 && (this.checkedAll = this.list.filter(item => item.checked).length === this.list.length)
                !isInterval && this.timer && this.clearInterval()
                !isInterval && !this.timer && (this.timer = setInterval(() => {
                    this.ConsumeInfos(true)
                }, this.intervalTime))
            })
        },
        //#endregion


        //#region  事件
        checkAllHandle(checked) {
            if (checked) {
                this.list.forEach(item => {
                    this.checkedJson.findIndex(checkedId => checkedId === item.id) === -1 && this.checkedJson.push(item.id)
                })
            } else {
                this.list.forEach(item => {
                    const index = this.checkedJson.findIndex(checkedId => checkedId === item.id)
                    index > -1 && this.checkedJson.splice(index, 1)
                })
            }
            this.list = this.list.map(item => { item.checked = checked; return item })
        },
        checkHandle(checked, id) {
            if (checked) {
                this.checkedJson.push(id)
            } else {
                this.checkedJson = this.checkedJson.filter(checkedId => checkedId !== id)
            }
            this.checkedAll = this.list.filter(item => item.checked).length === this.list.length
        },
        dateSelectHandle(type, date) {
            if (this.dateType === type && (type !== 'other')) { return }
            this.query.Page = 1
            const now = new Date()
            let ymd = ''
            if (type === 'today' || (!date && type === 'other')) {
                this.dateType = 'today'
                ymd = this.$app.currentTime(now, "yyyy-MM-dd")
                this.query.BeginDate = `${ymd} 00:00:00`
                this.query.EndDate = `${ymd} 23:59:59`

            } else if (type === 'yesterday') {
                this.dateType = type
                ymd = this.$app.currentTime(new Date(now.getTime() - 24 * 60 * 60 * 1000), "yyyy-MM-dd")
                this.query.BeginDate = `${ymd} 00:00:00`
                this.query.EndDate = `${ymd} 23:59:59`

            } else if (type === 'week') {
                this.dateType = type
                // const subDay = now.getDay() - 1
                // ymd = this.$app.currentTime(new Date(now.getTime() - (subDay > -1 ? subDay : 7) * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
                // ymd = this.$app.currentTime(new Date(now.getTime() - (now.getDate() - 1) * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
                ymd = this.$app.currentTime(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
                this.query.BeginDate = `${ymd} 00:00:00`
                this.query.EndDate = this.$app.currentTime(now, "yyyy-MM-dd HH:mm:ss")

            } else {
                this.dateType = type
                this.query.BeginDate = this.$app.currentTime(date[0], "yyyy-MM-dd HH:mm:ss")
                this.query.EndDate = this.$app.currentTime(date[1], "yyyy-MM-dd HH:mm:ss")
            }
            this.ConsumeInfos()
        },
        statusHandle(InOutStatus) {
            if (this.query.InOutStatus === InOutStatus) { return }
            this.query.InOutStatus = InOutStatus
            this.query.Page = 1
            this.ConsumeInfos()
        },
        searchHandle() {
            if (this.$refs.sInput === document.activeElement || this.query.BarCode) {
                this.query.Page = 1
                this.ConsumeInfos()
            }
        },
        handleCurrentChange(page) {
            this.query.Page = page
            this.ConsumeInfos()
        },
        handleSizeChange(size) {
            this.query.Size = size
            this.ConsumeInfos()
        },
        cleanAllHandle() {
            const { endTime } = this
            if (endTime === "") { return }
            stockApi.CleanAll({ endTime }).then(() => {
                this.$message({ type: "success", message: "一键清场成功" })
                this.showClearDlg = false
                this.checkedJson = []
                this.ConsumeInfos()
            })
        },
        cleanHandle() {
            const { checkedJson } = this
            if (checkedJson.length === 0) { return }
            stockApi.Clean(checkedJson).then(() => {
                this.$message({ type: "success", message: "清场成功" })
                this.checkedJson = []
                this.ConsumeInfos()
            })
        },
        refreshHandle() {
            this.isRefresh = true
            this.ConsumeInfos().finally(() => {
                this.isRefresh = false
            })
        },

        handleSearch() {
            this.searchNOHandle()
        },
        async searchNOHandle() {
            const { barCode } = this
            if (!barCode) { return }
            const getMemberInfo = (id) => {
                if (!id || (+id === 0)) { return }
                stockApi.getMemeberInfo({ id, GetCount: true }).then(res => {
                    if (res.sv_mr_headimg) { res.sv_mr_headimg = this.$app.fmtImg(res.sv_mr_headimg) }
                    this.memberInfo = res
                })
            }

            const playing = await stockApi.Product4Playing({ barCode })
            //sv_in_out_status 1中途离场
            if (playing && (+playing.sv_in_out_status) !== 1) {
                this.outInfo = playing
                this.verifyName = 'outVerify'
                this.payInfo.money = playing.paybackMoney
                this.consumeId = playing.id
                this.initOutGates(playing.outGates, 3)
                getMemberInfo(playing.sv_member_id)
            } else {
                let playings = []
                if (!playing) {
                    playings = await stockApi.Products({ isFinish: false, barCode })
                } else {
                    playings = [playing]
                }
                if (playings.length === 0) {
                    this.$message("票码信息不存在")
                    this.initVerify()
                    return
                }
                this.verifyName = 'inVerify'
                this.inInfos = playings
                if (this.inInfos.length > 0) {
                    this.consumeId = this.inInfos[0].id
                    this.initOutGates(this.inInfos[0].outGates, 2)
                    getMemberInfo(this.inInfos[0].sv_member_id)
                }
            }
            this.showNoDlg = false
            this.showInOutVerify = true
        },
        opGateHandle(halfway) {
            const { outInBtnTxt, currentGateSN, outInfo, payInfo } = this
            const currentOutInfo = { ...outInfo }
            if (!currentGateSN) { return }
            this.sendMessage(['test'], currentGateSN).then(() => {
                if (halfway) { //中途离场
                    this.SwipeBarCode4Web(1).then(arg => {
                        arg && this.sendMessage(['open', { playmusic: arg }], currentGateSN)
                    })
                } else {
                    switch (outInBtnTxt) {
                        case '验票入闸':
                            this.SwipeBarCode4Web(5).then(arg => {
                                arg && this.sendMessage(['open', { playmusic: arg }], currentGateSN)
                            })
                            break
                        case '补款出闸':
                            const { sv_product_id, sv_member_id, orderRunningId, sv_bar_code } = currentOutInfo
                            const currentPayMethods = this.$refs.payTypeList.getPayTypeInfo()
                            if (currentPayMethods.length === 0) { this.$message.error("请选择付款方式"); return }
                            const payQuery = JSON.parse(JSON.stringify(this.payQuery))
                            payQuery.totalMoney = payInfo.money
                            payQuery.dealMoney = payInfo.money
                            payQuery.payments = [{ money: payInfo.money, name: currentPayMethods[0].name }]
                            payQuery.caleDto.buySteps = [{ index: 1, number: 1, productId: sv_product_id, productChangePrice: payInfo.money }]
                            if (+sv_member_id === 0) { delete payQuery.caleDto.memberId } else { payQuery.caleDto.memberId = sv_member_id }
                            payQuery.caleDto.currentStep = 3
                            payQuery.remark = `订单:${orderRunningId || ""},游玩码:${sv_bar_code},补款${payInfo.money}元`
                            payQuery.sourceType = 100
                            payQuery.isSettle = true
                            this.isSubmitting = true

                            stockApi.orderSave(payQuery, this.Forbid, false).then(res => {
                                this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
                                if (res !== false && !this.$app.isNull(res)) {
                                    this.isSubmitting = false;
                                    if (this.$refs.payTypeList.isScanPay()) {
                                        this.payInfo.queryId = res.queryId
                                        this.$refs.payTypeList.handleScan();
                                    } else {
                                        this.SwipeBarCode4Web(3).then(arg => {
                                            // const outTime = this.$app.currentTime(new Date(), "yyyy-MM-dd HH:mm:ss")
                                            // stockApi.PayBack({ barCode: sv_bar_code, gateSN: currentGateSN, outTime }).then(() => {
                                            arg && this.sendMessage(['open', { playmusic: arg }], currentGateSN)
                                            // })
                                        })
                                    }
                                } else {
                                    this.isSubmitting = false;
                                }
                            }).catch(_ => {
                                this.isSubmitting = false;
                                this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
                            });
                            break
                        case '退款出闸':
                            this.SwipeBarCode4Web(2).then(arg => {
                                // const outTime = this.$app.currentTime(new Date(), "yyyy-MM-dd HH:mm:ss")
                                // stockApi.Refund({ barCode: currentOutInfo.sv_bar_code, gateSN: currentGateSN, outTime }).then(() => {
                                arg && this.sendMessage(['open', { playmusic: arg }], currentGateSN)
                                // })
                            })
                            break
                        case '验票出闸':
                            this.SwipeBarCode4Web(4).then(arg => {
                                arg && this.sendMessage(['open', { playmusic: arg }], currentGateSN)
                            })
                            break
                    }
                }
            })
        },
        inTickChangeHandle(item) {
            this.consumeId = item.id
            this.initOutGates(item.outGates, 2)
        },

        amountChangeHandle() {
            this.payInfo.money = this.$app.verifyDecimal(this.payInfo.money, 2).replace(/^0(\d+)/, '$1')
        },

        handleCloseScan() {
            this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
        },
        scanPaySuccess() {
            this.$message.success('补款成功');
            const { currentGateSN } = this
            // const { outInfo: { sv_bar_code }, currentGateSN } = this
            // const outTime = this.$app.currentTime(new Date(), "yyyy-MM-dd HH:mm:ss")
            this.SwipeBarCode4Web(3).then(arg => {
                // stockApi.PayBack({ barCode: sv_bar_code, gateSN: currentGateSN, outTime }).then(() => {
                arg && this.sendMessage(['open', { playmusic: arg }], currentGateSN)
                // })
            })
        },
        verifyHandle() {
            this.showNoDlg = true
            this.$nextTick(() => {
                this.$refs.barCode.focus()
            })
        }
        //#endregion
    }
}