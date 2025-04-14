import base from "@/api/base.js";
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import { kitchenPrintMain } from '@/utils/kitchenPrint.js';
import prCashier from '../cashier/cashier.vue';
import carttingCoffeeMore from '../../../../base/carttingCoffeeMore/carttingCoffeeMore.vue';
import carttingPreOrder from '../../../../base/carttingPreOrder/carttingPreOrder.vue';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import memberAdd from '../../../../base/memberAdd/memberAdd.vue';
import popTableList from '../../../../base/popTableList/popTableList.vue';
import popTableAnd from '../../../../base/popTableAnd/popTableAnd.vue';
import reservation from '@/modules/common/views/common/components/reservation/reservation.vue';
import reservationList from '@/modules/common/views/common/components/reservationList/reservationList.vue';
export default {
    components: { numberChange, prCashier, carttingCoffeeMore, carttingPreOrder, memberAdd, popTableList, popTableAnd, reservation, reservationList },
    name: 'deskList',
    data() {
        return {
            isOrderBack: false,                         // 是否反结账
            frontImgBase: base.frontImgBase,
            memberAddImport: null,
            memberAddStatus: false,                     // 新增会员弹窗
            isAfterSelectMember: false,                 // 是否是按钮操作选择会员之后
            billableTimer: null,                        // 计费循环时间器
            afterGetBill: false,
            billabletimeInfo: {                         // 计费数据
                id: null,
                code: '',
                configNameId: '',                       // 匹配计费规则演算id
                configName: '',                         // 计费名称
                startTime: '',                          // 开始时间
                endTime: '',                            // 结束时间
                durationUpdateTime: '',                 // 时长更新时间
                duration: '',                           // 累积时长
                status: -1,                             // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                statusString: '',                       // 计费状态
                totalMoney: 0,                          // 计费金额
                pauseDuration: null,                    // 有效暂停时长
                pauseTime: null,                        // 可暂停时长
                canPause: false,                        // 是否允许暂停
            },
            beforeGetOrder: false,
            orderData: {                                // 取单数据
                productResults: []
            },
            popTableListStatus: false,                  // 房台列表弹窗
            popTableAndStatus: false,                   // 并台弹窗
            popTableData: {
                title: '',
                dataType: 0
            },
            menuList: [],                               // 房台区域
            subMenuList: [                              // 房台状态
                { id: -1, name: '全部' },
                { id: 0, name: '空台' },
                { id: 2, name: '使用中' },
                { id: 3, name: '待清台' },
                { id: 4, name: '待接单' },
                { id: 5, name: '已预结' }
            ],
            queryEntity: {                              // 查询条件
                pageSize: 999999,                           // 页码
                pageIndex: 1,                               // 页数
                userId: '',                                 // 店铺id
                regionId: -1,                               // 区域id
                tableName: '',                              // 房台搜索
                queryTableCount: true,                      // 是否查询房台信息统计
                using_state: -1                             // 房台状态
            },
            sumCout: {                                  // 统计数据
                cateringTableAllCount: 0,                   // 全部
                freeStateCount: 0,                          // 空闲
                inUseStateCount: 0,                         // 正在使用
                bookingCount: 0,                            // 已预约
                occupationCount: 0,                         // 已占用
                repairingCount: 0,                          // 维护中
                waitForClearCount: 0,                       // 待清桌
                waitForStateCount: 0,                       // 已开台
                isBeforeHandCount: 0,                       // 已预结
            },
            dataList: [],                               // 房台列表数据
            refreshBool: false,                         // 刷新
            checkedItem: {                              // 点击选中的房台
                booking_type: 0,                        // 0-普通 1-预付金 : 2-预约时间
                preOrderMoney: 0,
                mergeCateringTableIds: []
            },
            preOrderStatus: false,                      // 预付金列表
            moreTableStatus: false,
            checkedItemLoaded: false,
            mergeCateringList: [],
            notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
            isRemove: false,                            // 显示清除房台
            showCashier: false,                         // 打开收银台
            dataJson: {                                 // 传入点餐组件的数据
                code: ''
            },
            guiderList: [],                             // 员工列表
            startOrderStatus: false,
            scheduleStatus: false,
            numberChangeStatus: false,
            billabletimeList: [],
            editReservation: {},
            reservationTableItem: {},
            reservationStatus: false,                   // 预订弹窗
            reservationListStatus: false,               // 预订列表弹窗
            popObject: {
                id: 0,
                sv_source_type: 100,
                sv_table_id: null,
                usingId: 0,
                sv_type: 2,                             // 类型：1.预订；2.开单 3.占用；4.维护
                sv_booking_id: 0,                       // 预订Id
                sv_booking_name: '',                    // 预订人
                sv_booking_mobile: '',                  // 预订联系电话
                sv_arrival_date: '',                    // 预订预抵时间
                sv_cancel_date: '',                     // 预订取消时间
                sv_employee_id: 0,                      // 员工Id
                sv_remark: '',                          // 备注
                wt_datetime: '',                        // 开单时间
                sv_billable_id: '',                     // 计费规则Id
                sv_table_use_number: 1,                 // 顾客人数
                sv_preknot_hour: 0,                     // 自动预结帐小时
                sv_preknot_minute: 0,                   // 自动预结帐分钟
            },
            popSubStatus: false,
            popContentStatus: false,                    // 预约 占用 维护弹窗
            popContent: {                               // 预约 占用 维护详情
                title: ''
            },
            bookingId: null,
            bookingInfo: {
                id: null
            }
        }
    },
    computed: {
        ...mapGetters(['hasProgramAssistant']),
        ...mapState(['refreshRoom', 'isCefClient', 'userInfo', 'memberInfo', 'takeASingleCale3', 'cashierJurisdiction']),
        ...mapState('permission', ['CashierManage']),
        store_logo() {
            let url = this.$app.isNull(this.userInfo.sv_store_logo) ? (base.frontImgBase + '/images/cashier/default_user_logo.png') : this.userInfo.sv_store_logo
            return this.$app.fmtImg(url)
        },
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
        // 0:空闲 1:已开台，待点餐 2:正在使用 3:待清桌 4:待接单 5:预结 6:预约 7:占用 8:维护 9:待预结
        hasStartOrder() {
            const stateList = [0];
            return this.$app.isNull(this.checkedItem.sv_table_using_state) ? false : stateList.includes(this.checkedItem.sv_table_using_state)
        },
        hasSchedule() {
            const stateList = [0, 6];
            return this.$app.isNull(this.checkedItem.sv_table_using_state) ? false : stateList.includes(this.checkedItem.sv_table_using_state)
        },
        hasOccupy() {
            const stateList = [0, 7];
            return this.$app.isNull(this.checkedItem.sv_table_using_state) ? false : stateList.includes(this.checkedItem.sv_table_using_state)
        },
        hasMaintenance() {
            const stateList = [0, 8];
            return this.$app.isNull(this.checkedItem.sv_table_using_state) ? false : stateList.includes(this.checkedItem.sv_table_using_state)
        },
        hasChangeTable() {
            const stateList = [1, 2, 4, 5, 9];
            return this.$app.isNull(this.checkedItem.sv_table_using_state) ? false : stateList.includes(this.checkedItem.sv_table_using_state)
        },
        hasSelectGoods() {
            const stateList = [0, 1, 2, 4, 5, 9];
            return this.$app.isNull(this.checkedItem.sv_table_using_state) ? false : stateList.includes(this.checkedItem.sv_table_using_state)
        },
        hasCheckinBtn() {
            const stateList = [1, 2, 5, 9];
            return this.$app.isNull(this.checkedItem.sv_table_using_state) ? false : stateList.includes(this.checkedItem.sv_table_using_state)
        },
        orderTotalMoney() {
            let billabletimeMoney = 0;
            if (this.mergeCateringList.length > 0) {
                this.mergeCateringList.forEach(e => {
                    if (e.billabletime) billabletimeMoney += e.billabletime.totalMoney
                })
            } else {
                billabletimeMoney = this.billabletimeInfo.totalMoney
            }
            this.orderData.productResults.forEach(e => {
                if (e.billabletime_code) {
                    billabletimeMoney = this.$app.addNumber(e.dealMoney, billabletimeMoney || 0)
                }
            })
            const caleMoney = this.$app.moneyFixed(this.$app.addNumber(this.orderData.dealMoney || 0, billabletimeMoney || 0))
            return this.takeASingleCale3.sv_isbeforehand && this.takeASingleCale3.sv_order_actual_money > 0 ? this.$app.moneyFixed(this.takeASingleCale3.sv_order_actual_money) : caleMoney
        },
    },
    watch: {
        refreshRoom: {                                          // 推送消息刷新房台
            deep: true,
            handler(newval) {
                if (newval) {
                    this.updateTableList();
                    this.update({ key: 'refreshRoom', data: false });
                }
            }
        },
        showCashier: {
            handler(newval) {
                if (newval) {
                    this.clearBillableTimer();
                    this.clearBillabletimeInfo()
                }
            }
        },
        'memberInfo.member_id': {
            handler(newval) {
                const takeOrderStatus = [1, 2, 4, 5, 9];
                if (newval) {
                    if (takeOrderStatus.includes(this.checkedItem.sv_table_using_state) && this.isAfterSelectMember) {
                        this.isAfterSelectMember = false;
                        this.updateCatering();
                    }
                } else {
                    if (takeOrderStatus.includes(this.checkedItem.sv_table_using_state) && this.checkedItem.sv_table_id && this.isAfterSelectMember) {
                        this.isAfterSelectMember = false;
                        this.updateCatering();
                    }
                }
            }
        },
        billabletimeInfo: {
            handler(newVal, oldVal) {
                if (newVal.pauseDuration >= newVal.pauseTime && newVal.pauseTime > 0 && newVal.status === 2 && this.caleStep === 1) {
                    // 暂停超时，需要弹出提示窗口
                    this.billabletimeTipsStatus = true;
                }
            }
        }
    },
    beforeMount() {
        this.isOrderBack = this.$route.query.isOrderBack;
        if (this.isOrderBack) {
            this.showCashier = true;
        }
    },
    mounted() {
        this.$root.$on('onTable', this.onTable);
        this.$root.$on('updateCateringState', this.updateCateringState);
        this.$root.$on('showMemberAdd', (dataObj) => {
            this.memberAddImport = dataObj;
            this.showMemberAdd(dataObj);
        });
        this.getEmployeePageList();
        this.queryEntity.userId = this.userInfo.user_id + '';
        this.getCateringRegionList();                      // 获取房台区域
        this.getUiGroupingEmployeeList();
    },
    beforeDestroy() {
        this.$root.$off('onTable', this.onTable);
        this.$root.$off('updateCateringState', this.updateCateringState);
        this.clearBillableTimer();
        this.clearMember();
    },
    methods: {
        ...mapMutations(['update', 'clearBillabletimeInfo', 'clearMember', 'syncCarttingData', 'setCateringReturn']),
        ...mapActions(['requsetMemberInfo', 'getUiGroupingEmployeeList']),
        onTable() {
            this.showCashier = false;
            this.getCateringRegionList();
            this.getUiGroupingEmployeeList();
        },
        handlePage() {
            if (this.moreTableStatus) {
                this.moreTableStatus = false;
            }
            if (this.preOrderStatus) {
                this.preOrderStatus = false;
            }
        },
        handleBack() {
            this.clearBillableTimer();
            this.checkedItem = {
                mergeCateringTableIds: []
            };
            this.billabletimeInfo = {                         // 计费数据
                id: null,
                code: '',
                configNameId: '',
                configName: '',                         // 计费名称
                startTime: '',                          // 开始时间
                endTime: '',                            // 结束时间
                durationUpdateTime: '',                 // 时长更新时间
                duration: '',                           // 累积时长
                status: -1,                             // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                statusString: '',                       // 计费状态
                totalMoney: 0,                          // 计费金额
                pauseDuration: null,                    // 有效暂停时长
                pauseTime: null,                        // 可暂停时长
                canPause: false,                        // 是否允许暂停
            }
            this.orderData = {
                productResults: []
            }
            this.clearMember();
        },
        updateCateringState(type) {                              // 餐饮结算成功更新房台
            // state 1需要自动清桌 2展示手动清桌弹窗 3预打
            this.orderData = {
                productResults: []
            }
            stockApi.updateCateringState({ tableId: this.checkedItem.sv_table_id, state: type }).then(res => {
                if (res || res === null) {
                    this.clearBillableTimer();
                    if (type === 1) {
                        this.checkedItem = {
                            mergeCateringTableIds: []
                        };
                        this.billabletimeInfo = {                         // 计费数据
                            id: null,
                            code: '',
                            configNameId: '',
                            configName: '',                         // 计费名称
                            startTime: '',                          // 开始时间
                            endTime: '',                            // 结束时间
                            durationUpdateTime: '',                 // 时长更新时间
                            duration: '',                           // 累积时长
                            status: -1,                             // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                            statusString: '',                       // 计费状态
                            totalMoney: 0,                          // 计费金额
                            pauseDuration: null,                    // 有效暂停时长
                            pauseTime: null,                        // 可暂停时长
                            canPause: false,                        // 是否允许暂停
                        }
                        this.orderData = {
                            productResults: []
                        }
                        this.clearMember();
                        this.getCateringRegionList();
                    }
                }
            });
        },
        showMemberList() {                                  // 显示会员选择列表
            this.isAfterSelectMember = true;
            this.$root.$emit('setUseType', 'allow_Consumption');
            this.$root.$emit('keyCode', 117);
        },
        showMemberAdd(dataObj) {                                    // 显示新增会员弹窗
            this.memberAddStatus = true;
            if (this.$app.isNull(dataObj)) {
                this.memberAddImport = {
                    newType: 'phone',
                    val: ''
                };
            }
        },
        handleClearMember() {                               // 清除选中会员
            this.clearMember();
            this.isAfterSelectMember = true;
        },
        showMemberRecharge() {                              // 显示会员充值弹窗
            this.memberRechargeStatus = true;
        },
        clearBillableTimer() {                              // 清除计时费timer
            console.log('clear');
            clearTimeout(this.billableTimer);
            this.billableTimer = null;
            this.update({
                key: 'billabletimeInfo',
                data: {
                    id: null,
                    configNameId: '',
                    configName: '',                         // 计费名称
                    startTime: '',                          // 开始时间
                    endTime: '',                            // 结束时间
                    duration: '',                           // 累积时长
                    status: -1,                             // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                    statusString: '',                       // 计费状态
                    totalMoney: 0,                          // 计费金额
                }
            })
            this.billabletimeInfo = {                       // 计费数据
                id: null,
                code: '',
                configNameId: '',
                configName: '',                             // 计费名称
                startTime: '',                              // 开始时间
                endTime: '',                                // 结束时间
                durationUpdateTime: '',                     // 时长更新时间
                duration: '',                               // 累积时长
                status: -1,                                 // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                statusString: '',                           // 计费状态
                totalMoney: 0,                              // 计费金额
                pauseDuration: null,                        // 有效暂停时长
                pauseTime: null,                            // 可暂停时长
                canPause: false,                            // 是否允许暂停
            }
        },
        pauseBillableTimer() {                              // 暂停计时费timer
            console.log('pause');
            this.billabletimeInfo.status = 2;
        },
        startBillableTimer() {
            let tableBillableRunningStatus = false, goodsBillableRunningStatus = false
            if (this.billabletimeInfo.status === 1 || this.billabletimeInfo.status === 2) {
                if (this.billabletimeInfo.configId === this.checkedItem.sv_billable_id) {
                    tableBillableRunningStatus = true;
                }
            }
            const postData = this.orderData.productResults.filter(k => k.isAssistant).map(e => {
                return {
                    code: e.billabletime_code,
                    endTime: this.checkedItem.preknot_date || this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
                }
            })
            if (postData.length > 0) {
                goodsBillableRunningStatus = true;
            }
            if (tableBillableRunningStatus || goodsBillableRunningStatus) {
                console.log('start');
                const cycleTime = 60000;
                this.billableTimer = setTimeout(() => {
                    Promise.all([this.getTableBillabletime(), this.getGoodsBillabletime()]).then(res => {
                        clearTimeout(this.billableTimer);
                        this.billableTimer = null;
                        this.startBillableTimer();
                    });
                }, cycleTime)
            } else {
                clearTimeout(this.billableTimer);
                this.billableTimer = null;
            }
        },

        //#region 获取数据
        async takeASingle(fn) {                                   // 取单
            let query = {
                tableId: this.checkedItem.sv_table_id
            }
            this.checkedItemLoaded = false;
            await stockApi.takeASingle(query).then(res => {
                if (res) {
                    this.update({
                        key: 'takeASingleCale3',
                        data: {
                            sv_isbeforehand: res.sv_isbeforehand,
                            tableId: this.checkedItem.sv_table_id,
                            member_id: res.member_id,
                            sv_integral: res.sv_integral,
                            sv_coupon_record_ids: res.sv_coupon_record_ids,
                            sv_employee_ids: res.sv_employee_ids,
                            sv_order_receivable: res.sv_order_receivable,
                            sv_order_actual_money: res.sv_order_actual_money
                        }
                    });

                    this.orderData = {
                        ...res,
                        productResults: (res.productResults || []).map((e, i) => {
                            let multCommissions = [];
                            (e.multiple_provider || []).forEach((workerItem) => {
                                let emArray = [];
                                workerItem.forEach(em => {
                                    emArray.push({
                                        selectedType: em.selectedType || '',
                                        isAppoint: em.isAppoint || false,
                                        billable_id: em.sv_billable_id,
                                        billabletime_code: em.billabletime_code || '',
                                        sv_employee_id: em.e_id,
                                        sv_employee_name: em.e_name,
                                        sv_employee_number: em.e_number,
                                        sv_employee_photo: em.e_photo,
                                        grouping_name: em.g_name,
                                        percent: em.percent,
                                        status: e.without_project_status,
                                        start_time: e.without_project_start_time,
                                        end_time: e.without_project_end_time,
                                    })
                                })
                                multCommissions.push(emArray)
                            })
                            return {
                                ...e,
                                isAssistant: this.$app.isNull(e.billabletime_code) ? false : true,
                                multCommissions: multCommissions.length === 0 ? [[]] : multCommissions
                            }
                        })
                    }
                    if (this.$app.isNull(this.orderData.member_id) || this.orderData.member_id === '0') {
                        this.clearMember();
                    } else {
                        if (this.orderData.member_id !== this.memberInfo.member_id) {
                            this.requsetMemberInfo(this.orderData.member_id);
                        }
                    }
                    !!fn && fn();
                }
            });
            this.checkedItemLoaded = true;
        },
        updateTableInfo() {                                 // 修改人数和备注
            let query = {
                sv_type: 2,                                 // 1人数 2备注
                sv_table_id: this.checkedItem.sv_table_id,
                sv_person_num: this.checkedItem.sv_person_num,
                user_id: this.userInfo.user_id,
                sv_remark: this.checkedItem.sv_remark,
                sv_order_source: 0
            }
            stockApi.updatePersonNumRemark(query).then(res => {
                if (res) {
                    return this.$message.success('备注成功')
                }
            });
        },
        updateCatering() {                                  // 修改挂单 
            let prlist = this.orderData.productResults.map(e => {
                let multiple_provider_list = [];
                (e.multiple_provider || []).forEach(ep => {
                    ep.forEach(em => {
                        let emArray = []
                        emArray.push({
                            e_id: em.e_id,
                            percent: em.percent
                        })
                        multiple_provider_list.push(emArray)
                    })
                })
                return {
                    product_id: e.productId,
                    product_price: e.price,
                    product_name: e.productName,
                    multiple_provider_list: multiple_provider_list,
                    sv_table_id_old: e.sv_table_id_old,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => e.id)],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => e.id)],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => e.id)],
                    sv_is_rouse: e.sv_is_rouse,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: e.totalMoney
                }
            });

            let query = {
                sv_order_source: 0,
                wt_datetime: this.checkedItem.wt_datetime,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.orderData.dealMoney,
                sv_order_receivable: this.orderData.dealMoney,
                sv_person_num: this.checkedItem.sv_person_num,
                sv_remark: this.checkedItem.sv_remark,
                sv_table_id: this.checkedItem.sv_table_id,
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id || '0',
                sv_table_is_together: false,                        // 是否拼桌
                sv_order_data_type: 0
            }
            stockApi.takeASingleUpdateCatering(query).then(res => {
                if (res) {
                    this.orderData = {
                        ...res,
                        productResults: (res.productResults || []).map((e, i) => {
                            let multCommissions = [];
                            (e.multiple_provider || []).forEach((workerItem) => {
                                let emArray = [];
                                workerItem.forEach(em => {
                                    emArray.push({
                                        selectedType: em.selectedType || '',
                                        isAppoint: em.isAppoint || false,
                                        sv_employee_id: em.e_id,
                                        sv_employee_name: em.e_name,
                                        sv_employee_number: em.e_number,
                                        sv_employee_photo: em.e_photo,
                                        grouping_name: em.g_name,
                                        percent: em.percent,
                                        status: e.without_project_status,
                                        start_time: e.without_project_start_time,
                                        end_time: e.without_project_end_time,
                                    });
                                })
                                multCommissions.push(emArray);
                            })
                            return {
                                ...e,
                                isAssistant: this.$app.isNull(e.billabletime_code) ? false : true,
                                multCommissions: multCommissions.length === 0 ? [[]] : multCommissions
                            }
                        })
                    }
                }
            });
        },
        getEmployeePageList() {                             // 获取导购员
            stockApi.getEmployeePageListV2().then(res => {
                if (res.succeed && !this.$app.isNull(res.values)) {
                    this.guiderList = res.values.map(e => {
                        return {
                            ...e,
                            value: e.sv_employee_id,
                            label: e.sv_employee_name,
                            isSelected: false
                        }
                    });
                }
            });
        },
        getCateringRegionList() {                           // 获取房台区域
            stockApi.getCateringRegionList({ seachStr: '', pageIndex: 1, pageSize: 999, }).then(res => {
                if (res) {
                    this.menuList = this.$app.isNull(res) ? [] : res.dataList.map(e => {
                        return { name: e.sv_region_name, id: e.sv_region_id }
                    });
                    this.menuList.unshift({ name: '全部', id: -1 });
                    // this.menuList.push({ name: '反结区', id: -2 });
                    !!this.$refs.scrollbarmLeft && this.$refs.scrollbarmLeft.update();
                    // this.queryEntity.regionId = this.$app.isNull(this.menuList) ? -1 : this.menuList[0].id;
                    this.getCashierRegionTableInfo();
                }
            })
        },
        updateTableList() {                                 // 获取刷新通知，更新房台
            stockApi.GetCashierRegionTableInfo(this.queryEntity).then(res => {
                if (res) {
                    this.dataList = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.map((e) => {
                        let stateName = this.setStateName(e.sv_table_using_state);
                        let time = this.$app.isNull(e.sv_table_opendate) ? '' : this.$app.timeToHourFomart(new Date(e.sv_table_opendate));
                        return { ...e, stateName, time }
                    });
                    this.sumCout = this.$app.isNull(res) || this.$app.isNull(res.cateringTableCount) ? this.sumCout : res.cateringTableCount;

                    !!this.$refs.scrollbar && this.$refs.scrollbar.update();
                }
            })
        },
        getCashierRegionTableInfo(searchHandle = false) {  // 获取房台列表
            stockApi.GetCashierRegionTableInfo(this.queryEntity).then(res => {
                if (res) {
                    this.dataList = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.map((e) => {
                        let stateName = this.setStateName(e.sv_table_using_state);
                        let time = this.$app.isNull(e.sv_table_opendate) ? '' : this.$app.timeToHourFomart(new Date(e.sv_table_opendate));
                        return { ...e, stateName, time }
                    });
                    this.sumCout = this.$app.isNull(res) || this.$app.isNull(res.cateringTableCount) ? this.sumCout : res.cateringTableCount;

                    !!this.$refs.scrollbar && this.$refs.scrollbar.update();
                    if (this.checkedItem.sv_table_id) {
                        const item = this.dataList.find(e => e.sv_table_id === this.checkedItem.sv_table_id)
                        !!item && this.handleListTable(item, true)
                    }
                    if (searchHandle && this.dataList.length === 1) {
                        this.handleListTable(this.dataList[0])
                    }
                }
                if (this.refreshBool) this.refreshBool = false, this.$message({ message: '刷新成功', type: 'success' });
            })
        },
        showCheckin() {                                             // 显示订单结算弹窗 Enter
            let syncToCart = JSON.parse(JSON.stringify(this.orderData));
            syncToCart.productResults = this.orderData.productResults.map(e => {
                let billabletime = null;
                if (!this.$app.isNull(e.billabletime_code)) {
                    billabletime = {
                        dateTime: e.billable.durationUpdateTime,
                        duration: e.billable.duration,
                        money: e.billable.totalMoney,
                        code: e.billable.code
                    }
                    return {
                        ...e,
                        productId: e.productId,
                        billabletime,
                        isHidden: true,
                        configNameId: 'Billabletime-' + e.billable.configId,
                        productName: e.productName,
                        barCode: '',
                        number: 1,
                        unitName: '',
                        price: e.billable.totalMoney,
                        productChangePrice: e.billable.totalMoney,
                        couponMoney: 0,
                        sv_return_status: 0,
                        dealMoney: e.billable.totalMoney,
                    }
                }
                return {
                    ...e
                }
            })
            let feeList = [];
            if (this.mergeCateringList.length > 0) {
                this.mergeCateringList.forEach(e => {
                    if (e.billabletime) {
                        let billabletime = null;
                        if (!this.$app.isNull(e.billabletime.code)) {
                            billabletime = {
                                dateTime: e.billabletime.durationUpdateTime,
                                duration: e.billabletime.duration,
                                money: e.billabletime.totalMoney,
                                code: e.billabletime.code,
                            }
                        }
                        if (e.billabletime.totalMoney > 0) {
                            let feeItem = {
                                productId: 0,
                                billabletime,
                                isHidden: true,
                                configNameId: 'Billabletime-' + e.billabletime.configId,
                                productName: e.billabletime.configName,
                                barCode: '',
                                number: 1,
                                unitName: '',
                                price: e.billabletime.totalMoney,
                                productChangePrice: e.billabletime.totalMoney,
                                couponMoney: 0,
                                sv_return_status: 0,
                                dealMoney: e.billabletime.totalMoney,
                            }
                            feeList.push(feeItem);
                        }
                    }
                })
                syncToCart.productResults = [...feeList, ...syncToCart.productResults];
            } else {
                if (!this.$app.isNull(this.billabletimeInfo.totalMoney) && !this.$app.isNull(this.billabletimeInfo.id)) {
                    let billabletime = null;
                    if (!this.$app.isNull(this.billabletimeInfo.code)) {
                        billabletime = {
                            dateTime: this.billabletimeInfo.durationUpdateTime,
                            duration: this.billabletimeInfo.duration,
                            money: this.billabletimeInfo.totalMoney,
                            code: this.billabletimeInfo.code,
                        }
                    }
                    let feeItem = {
                        productId: 0,
                        billabletime,
                        isHidden: true,
                        configNameId: 'Billabletime-' + this.billabletimeInfo.configId,
                        productName: this.billabletimeInfo.configName,
                        barCode: '',
                        number: 1,
                        unitName: '',
                        price: this.billabletimeInfo.totalMoney,
                        productChangePrice: this.billabletimeInfo.totalMoney,
                        couponMoney: 0,
                        sv_return_status: 0,
                        dealMoney: this.billabletimeInfo.totalMoney,
                    }
                    syncToCart.productResults.unshift(feeItem);
                }
            }
            this.billabletimeInfo.endTime = this.checkedItem.sv_table_prekont_date || this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
            this.update({
                key: 'billabletimeInfo',
                data: this.billabletimeInfo
            })
            if (syncToCart.productResults.length < 1) return this.$message.warning('还未下单商品，无法结算');
            syncToCart.givePromotions = [];
            syncToCart.productResults = syncToCart.productResults.filter(e => e.sv_return_status !== 2)
            let hasReturn = this.orderData.productResults.filter(e => e.sv_return_status === 2).map(e => {
                return {
                    ...e,
                    productName: '(退)' + e.productName
                }
            });
            this.update({
                key: 'selectedInfo',
                data: JSON.parse(JSON.stringify(this.checkedItem))
            });
            this.syncCarttingData(syncToCart);
            this.setCateringReturn(hasReturn);
            this.$root.$emit('keyCode', 13);
        },
        //#endregion

        //#region   事件
        setStateName(state) {                               // 显示房台状态
            const obj = {
                6: '约',
                7: '占',
                8: '维'
            }
            return obj[state] ? obj[state] : ''
        },
        handleInput({ target }) {
            target.value = this.$app.verifyNumber(target.value)
        },
        handleState(type) {                                 // 点击底部统计数据
            this.queryEntity.using_state = type;
            this.getCashierRegionTableInfo();
        },
        handleMenuClick(type) {                             // 点击房台区域
            this.queryEntity.regionId = type;
            if (type === -2) return;
            this.getCashierRegionTableInfo();
        },
        handleSearch() {
            if (this.$app.isNull(this.queryEntity.tableName)) return this.$message.warning('请输入房台名称')
            this.getCashierRegionTableInfo(true);
        },
        handleClearSearch() {
            this.queryEntity.tableName = '';
            this.getCashierRegionTableInfo();
        },
        handleRefresh() {                                           // 刷新
            this.refreshBool = true;
            this.getCashierRegionTableInfo();
        },
        handleRefresh() {
            this.popTableAndStatus = false;
            this.$message.success('操作成功');
            this.takeASingle();
            this.getCashierRegionTableInfo();
        },
        showPreOrder() {                                            // 展示预付金列表
            this.preOrderStatus = !this.preOrderStatus;
        },
        showMoreTable() {
            this.moreTableStatus = !this.moreTableStatus;
        },
        handleJump(obj) {                                           // 跳转 房台列表
            let { type } = obj;
            switch (type) {
                case 'tableSetting': this.$router.push({ path: '/functionSetting/tableSetting' }); break;
                default: break;
            }
        },

        async getCateringModel() {                                  // 获取房台基础信息
            let query = {
                tableId: this.checkedItem.sv_table_id
            }
            this.checkedItemLoaded = false;
            await stockApi.getCateringModel(query).then(res => {
                if (res) {
                    this.bookingId = res.sv_booking_id;
                    this.checkedItem.sv_billable_id = res.sv_billable_id;
                    this.checkedItem.booking_type = res.booking_type;
                    this.checkedItem.billabletime_code = res.billabletime_code;
                    this.checkedItem.is_have_prepayment = res.is_have_prepayment;
                    // this.checkedItem.sv_table_using_state = res.sv_table_using_state;
                    this.checkedItem.sv_without_list_id = res.sv_without_list_id || null;
                    this.checkedItem.sv_table_id = res.sv_table_id;
                    this.checkedItem.sv_region_name = res.sv_region_name;
                    this.checkedItem.sv_table_name = res.sv_table_name;
                    this.checkedItem.sv_person_num = res.sv_person_num;
                    this.checkedItem.sv_service_fee_json = JSON.parse(res.sv_service_fee_json);
                    this.checkedItem.sv_remark = res.sv_remark;
                    this.checkedItem.sv_table_prekont_date = res.sv_table_prekont_date || null;
                    this.checkedItem.wt_datetime = this.$app.currentTime(new Date(res.wt_datetime), 'yyyy-MM-dd HH:mm:ss');
                    this.checkedItem.mergeCateringTableIds = res.mergeCateringTableIds || []
                }
            });
            await this.getMergeCateringList();
            await this.getTableBillabletime();
            this.startBillableTimer();
            if (this.checkedItem.is_have_prepayment) {
                this.getPrepaymentMoney4Table();
            }
            if (this.checkedItem.booking_type === 2 && this.bookingId) {
                this.getBookingById();
            }
        },
        getPrepaymentMoney4Table() {
            let query = {
                tableId: this.checkedItem.sv_table_id
            }
            stockApi.getPrepaymentMoney4Table(query).then(res => {
                this.checkedItem.preOrderMoney = res;
                this.checkedItem.is_have_prepayment = this.checkedItem.preOrderMoney > 0 ? true : false;
            });
        },
        getBookingById() {                                          // 获取房台基础信息
            stockApi.getBookingById({ id: this.bookingId }).then(res => {
                if (res) {
                    this.bookingInfo = res;
                }
            });
        },
        async getMergeCateringList() {
            if (this.checkedItem.mergeCateringTableIds.length > 0) {
                const dataArray = [{ sv_table_id: this.checkedItem.sv_table_id, sv_without_list_id: this.checkedItem.sv_without_list_id }, ...this.checkedItem.mergeCateringTableIds]
                return stockApi.getMergeCateringList(dataArray).then(res => {
                    if (res) {
                        this.mergeCateringList = res;
                    }
                });
            } else {
                this.moreTableStatus = false;
            }
            return false
        },
        async getTableBillabletime() {
            if (!this.$app.isNull(this.checkedItem.billabletime_code) && this.hasCheckinBtn) {
                this.afterGetBill = false;
                return stockApi.getBillabletime({ code: this.checkedItem.billabletime_code, dateTime: this.checkedItem.sv_table_prekont_date }).then(res => {
                    if (res) {
                        this.afterGetBill = true;
                        this.billabletimeInfo = {
                            id: res.id,
                            configId: res.configId,
                            code: res.code,
                            configNameId: 'Billabletime-' + res.configId,
                            configName: res.configName,
                            startTime: res.startTime,
                            endTime: '',
                            duration: res.duration,
                            durationString: res.durationString,
                            durationUpdateTime: res.durationUpdateTime,
                            status: res.status,                 // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                            statusString: res.statusString,
                            totalMoney: res.totalMoney,
                            pauseDuration: res.pauseDuration,
                            pauseTime: res.pauseTime,
                            canPause: res.pauseTime > 0
                        }
                        this.update({
                            key: 'billabletimeInfo',
                            data: this.billabletimeInfo
                        })
                    }
                });
            }
            return false
        },

        getGoodsBillabletime() {
            const postData = this.orderData.productResults.filter(k => k.isAssistant).map(e => {
                return {
                    code: e.billabletime_code,
                    endTime: this.checkedItem.preknot_date || this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
                }
            })
            if (postData.length === 0) return
            return stockApi.getBantchBillabletime(postData).then(res => {
                if (res) {
                    (res || []).forEach(item => {
                        if (item.code === 1) {
                            const billableItem = item.data;
                            const billableIndex = this.orderData.productResults.findIndex(e => e.billabletime_code === billableItem.code)
                            if (billableIndex > -1) {
                                this.orderData.productResults[billableIndex].dealMoney = billableItem.totalMoney;
                                this.orderData.productResults[billableIndex].dealPrice = billableItem.totalMoney;
                                this.orderData.productResults[billableIndex].billable = billableItem;
                            }
                        } else {
                            this.$message.error(item.msg)
                        }
                    })
                }
            });
        },
        handleClearTable() {
            this.$alert('是否结束服务？', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    if (action === 'confirm') {
                        let obj = { operateTableId: this.checkedItem.sv_table_id, operateType: 1, sv_table_using_state: 1 };
                        stockApi.OperateCateringTableByOperateType(obj).then(res => {
                            if (res || res === null) {
                                this.$message.success('清台成功');
                                this.handleBack();
                            }
                        });
                    }
                }
            });
        },
        handleFnItem(type, hasFn = true) {                  // 点击操作按钮
            if (!hasFn) return
            this.dataJson.producttype = type === 'programAssistant' ? '5' : '-1';
            if (type === 'programAssistant') {
                // 选择艺人
                if (this.checkedItem.is_online_order && this.checkedItem.booking_type === 1) return this.$message.warning('客户开台，不支持选购商品')
                if (this.checkedItem.sv_table_using_state === 0) {
                    this.handleFnItem('startOrderStatus')
                    return
                }
                this.dataJson.sv_table_id = this.checkedItem.sv_table_id;
                this.dataJson.sv_table_using_state = this.checkedItem.sv_table_using_state;
                this.showCashier = true;
                return
            }
            if (type === 'startOrderStatus') {
                // 开房台
                stockApi.getBillabletimeConfig({ tableId: this.checkedItem.sv_table_id }).then(res => {
                    if (res) {
                        this.billabletimeList = res.map(e => {
                            return {
                                ...e,
                                label: e.name,
                                value: e.id
                            }
                        })
                        this.popObject.wt_datetime = new Date();
                        // this.popObject.wt_datetime = '';
                        this.popObject.sv_table_id = this.checkedItem.sv_table_id;
                        this.popObject.usingId = 0;
                        this.popObject.sv_table_use_number = 1;
                        this.popObject.sv_employee_id = this.guiderList.find(e => e.id === this.userInfo.user_id) ? this.userInfo.user_id : null;
                        this.popObject.sv_billable_id = this.billabletimeList.find(e => e.is_default) ? this.billabletimeList.find(e => e.is_default).id : '';
                        this.popObject.sv_preknot_hour = 0;
                        this.popObject.sv_preknot_minute = 0;
                        this.popObject.sv_remark = '';
                        this.startOrderStatus = true;
                    }
                });
                return
            }
            if (type === 'scheduleStatus') {
                // 预约
                if (this.checkedItem.booking_type === 2) {
                    this.reservationTableItem = { ...this.checkedItem };
                    this.editReservation = {};
                    this.reservationStatus = true;
                    return
                }
                if (this.checkedItem.sv_table_using_state === 6) {
                    // 弹窗
                    stockApi.getCateringTableUsing({ tableId: this.checkedItem.sv_table_id }).then(res => {
                        const titleText = { 6: '预约', 7: '占用', 8: '维护' }
                        if (res || res === null) {
                            this.popContentStatus = true;
                            this.popContent = {
                                title: titleText[this.checkedItem.sv_table_using_state],
                                sv_table_using_state: this.checkedItem.sv_table_using_state,
                                ...res
                            }
                        }
                    });
                    return
                }
                this.scheduleStatus = true;
                this.popObject.id = 0;
                this.popObject.sv_table_id = this.checkedItem.sv_table_id;
                this.popObject.usingId = 0;
                this.popObject.sv_booking_name = '';
                this.popObject.sv_booking_mobile = '';
                this.popObject.sv_arrival_date = new Date(new Date().getTime() + 3600 * 1000);
                this.popObject.sv_cancel_date = new Date(new Date().getTime() + 7200 * 1000);
                this.popObject.sv_employee_id = this.guiderList.find(e => e.id === this.userInfo.user_id) ? this.userInfo.user_id : null;
                this.popObject.sv_remark = '';
                return
            }
            if (type === 'reservationList') {
                // 预约列表
                this.reservationTableItem = { ...this.checkedItem };
                this.reservationListStatus = true;
                return
            }
            if (type === 'occupy') {
                // 占用
                if (this.checkedItem.sv_table_using_state === 7) {
                    // 弹窗
                    stockApi.getCateringTableUsing({ tableId: this.checkedItem.sv_table_id }).then(res => {
                        const titleText = { 6: '预约', 7: '占用', 8: '维护' }
                        if (res || res === null) {
                            this.popContentStatus = true;
                            this.popContent = {
                                title: titleText[this.checkedItem.sv_table_using_state],
                                sv_table_using_state: this.checkedItem.sv_table_using_state,
                                ...res
                            }
                        }
                    });
                    return
                }
                this.popSubStatus = true;
                this.popObject.sv_type = 3;
                this.popObject.usingId = 0;
                this.popObject.sv_table_id = this.checkedItem.sv_table_id;
                this.popObject.sv_employee_id = this.guiderList.find(e => e.id === this.userInfo.user_id) ? this.userInfo.user_id : null;
                this.popObject.sv_remark = '';
                return
            }
            if (type === 'maintenance') {
                // 维护
                if (this.checkedItem.sv_table_using_state === 8) {
                    // 弹窗
                    stockApi.getCateringTableUsing({ tableId: this.checkedItem.sv_table_id }).then(res => {
                        const titleText = { 6: '预约', 7: '占用', 8: '维护' }
                        if (res || res === null) {
                            this.popContentStatus = true;
                            this.popContent = {
                                title: titleText[this.checkedItem.sv_table_using_state],
                                sv_table_using_state: this.checkedItem.sv_table_using_state,
                                ...res
                            }
                        }
                    });
                    return
                }
                this.popSubStatus = true;
                this.popObject.sv_type = 4;
                this.popObject.usingId = 0;
                this.popObject.sv_table_id = this.checkedItem.sv_table_id;
                this.popObject.sv_employee_id = this.guiderList.find(e => e.id === this.userInfo.user_id) ? this.userInfo.user_id : null;
                this.popObject.sv_remark = '';
                return
            }
            if (type === 'changeTable') {
                this.popTableListStatus = true;
                this.popTableData = {
                    tableId: this.checkedItem.sv_table_id,
                    tableName: this.checkedItem.sv_table_name,
                    title: '换台 - 选择房台',
                    dataType: 0
                }
                return
            }
            if (type === 'mergeTable') {
                this.popTableAndStatus = true;
                this.popTableData = {
                    tableId: this.checkedItem.sv_table_id,
                    tableName: this.checkedItem.sv_table_name,
                    title: '并台 - 选择房台',
                    dataType: 1
                }
                return
            }
            if (type === 'kaideng') {
                // 开灯
                // if (!this.checkedItem.sv_electric_id) return this.$message.warning('房台未配置电控开关')
                if (!this.checkedItem.sv_switch) this.handleLightSwitch(this.checkedItem);
                return
            }
            if (type === 'guandeng') {
                // 关灯
                // if (!this.checkedItem.sv_electric_id) return this.$message.warning('房台未配置电控开关')
                if (this.checkedItem.sv_switch) this.handleLightSwitch(this.checkedItem);
                return
            }
            if (type === 'selectGoods') {
                if (this.checkedItem.is_online_order && this.checkedItem.booking_type === 1) return this.$message.warning('客户开台，不支持选购商品')
                if (this.checkedItem.sv_table_using_state === 0) {
                    this.handleFnItem('startOrderStatus')
                    return
                }
                this.dataJson.sv_table_id = this.checkedItem.sv_table_id;
                this.dataJson.sv_table_using_state = this.checkedItem.sv_table_using_state;
                this.showCashier = true;
                return
            }
            if (type === 'editRemark') {
                if (this.checkedItem.sv_table_using_state === 0) {
                    this.handleFnItem('startOrderStatus')
                    return
                }
                this.$prompt('请输入备注内容', '备注', {
                    inputPlaceholder: '请输入备注内容，限100个字',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{0,100}$/,
                    inputValue: this.checkedItem.sv_remark || '',
                    inputErrorMessage: '请输入备注内容，限100个字',
                }).then(({ value }) => {
                    this.checkedItem.sv_remark = value;
                    this.updateTableInfo();
                }).catch(e => {

                });
                return
            }
            if (type === 'recharge') {
                this.$root.$emit('keyCode', 82);
                return
            }
        },
        handleUpdateTable(val) {                                    // 0 换台 1 并台 2 移菜
            if (val.type === 1) {
                // 并台
                stockApi.mergeCateringTable({
                    sv_source_type: 100,
                    operateTableId: this.checkedItem.sv_table_id,
                    mergeCateringTableIds: val.list
                }).then(res => {
                    if (res) {
                        this.popTableAndStatus = false;
                        this.$message.success('操作成功');
                        this.takeASingle();
                        this.getCashierRegionTableInfo();
                    }
                })
                return
            }
            stockApi.operateCateringTable({
                operateTableId: this.checkedItem.sv_table_id,
                changeOrFightCateringTableId: val.id,
                operateType: val.type === 0 ? 3 : 5
            }).then(res => {
                if (res) {
                    let printTableName = this.checkedItem.sv_table_name + '->' + val.name;
                    this.checkedItem.sv_table_id = val.id;
                    this.checkedItem.sv_table_name = val.name;
                    this.popTableListStatus = false;
                    this.$message.success('操作成功');
                    this.getCashierRegionTableInfo();
                    this.takeASingle(() => {
                        this.getKitchenPrinter(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 'change' : 'and', printTableName);
                        this.handelFrontPrint(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 4 : 5);
                    });
                }
            });
        },
        handleLightSwitch(item) {
            let currentSwitch = item.sv_switch;
            stockApi.updateElectricSwitch({ sv_electric_id: item.sv_electric_id, sv_table_id: item.sv_table_id, sv_switch: currentSwitch ? false : true }).then(res => {
                if (res) {
                    let filterItem = this.dataList.find(e => e.sv_table_id === item.sv_table_id && e.sv_electric_id === item.sv_electric_id)
                    filterItem.sv_switch = !filterItem.sv_switch;
                    this.checkedItem.sv_switch = filterItem.sv_switch;
                    // this.handleLight(item.sv_port, currentSwitch ? false : true, item.sv_electric_num);
                }
            });
        },
        handleOccupyToMaintenance() {                       // 占用状态点击维护
            this.popSubStatus = true;
            this.popObject.sv_type = 4;
            this.popObject.sv_table_id = this.popContent.sv_table_id;
            this.popObject.usingId = this.popContent.id;
            this.popObject.sv_remark = this.popContent.sv_remark;
            this.popObject.sv_employee_id = this.popContent.sv_employee_id || null;
        },
        handleContentToSchedule() {                         // 占用、维护状态点击预约
            this.scheduleStatus = true;
            this.popObject.sv_table_id = this.checkedItem.sv_table_id;
            this.popObject.usingId = this.popContent.id;
            this.popObject.sv_booking_name = '';
            this.popObject.sv_booking_mobile = '';
            this.popObject.sv_arrival_date = new Date(new Date().getTime() + 3600 * 1000);
            this.popObject.sv_cancel_date = new Date(new Date().getTime() + 7200 * 1000);
            this.popObject.sv_employee_id = this.popContent.sv_employee_id || null;
            this.popObject.sv_remark = this.popContent.sv_remark;
        },
        handleUpdateSchedule() {                            // 预约详情点击修改
            this.scheduleStatus = true;
            this.popObject.id = this.popContent.id;
            this.popObject.sv_table_id = this.checkedItem.sv_table_id;
            this.popObject.usingId = this.popContent.id;
            this.popObject.sv_booking_name = this.popContent.sv_booking_name;
            this.popObject.sv_booking_mobile = this.popContent.sv_booking_mobile;
            this.popObject.sv_arrival_date = this.popContent.sv_arrival_date;
            this.popObject.sv_cancel_date = this.popContent.sv_cancel_date;
            this.popObject.sv_employee_id = this.popContent.sv_employee_id || null;
            this.popObject.sv_remark = this.popContent.sv_remark;
        },
        handleScheduleToStartOrder() {                      // 预约详情点击预定开单
            stockApi.getBillabletimeConfig({ tableId: this.checkedItem.sv_table_id }).then(res => {
                if (res) {
                    this.billabletimeList = res.map(e => {
                        return {
                            ...e,
                            label: e.name,
                            value: e.id
                        }
                    })
                    // this.popObject.wt_datetime = new Date();
                    this.popObject.wt_datetime = '';
                    this.popObject.sv_table_id = this.checkedItem.sv_table_id;
                    this.popObject.usingId = this.popContent.id;
                    this.popObject.sv_table_use_number = 1;
                    this.popObject.sv_remark = this.popContent.sv_remark;
                    this.popObject.sv_employee_id = this.popContent.sv_employee_id || null;
                    this.popObject.sv_billable_id = this.billabletimeList.find(e => e.is_default) ? this.billabletimeList.find(e => e.is_default).id : '';
                    this.popObject.sv_preknot_hour = 0;
                    this.popObject.sv_preknot_minute = 0;
                    this.startOrderStatus = true;
                }
            });
        },
        handlePreknotTime(value) {
            this.popObject.sv_preknot_minute = 0;
            this.popObject.sv_preknot_hour = value;
        },
        handleStartOrder() {                                // 确定开房台
            const postData = {
                sv_type: 2,
                sv_table_id: this.popObject.sv_table_id,
                usingId: this.popObject.usingId,
                member_id: this.memberInfo.member_id,
                sv_table_use_number: this.popObject.sv_table_use_number,
                wt_datetime: this.$app.isNull(this.popObject.wt_datetime) ? '' : this.$app.currentTime(this.popObject.wt_datetime, 'yyyy-MM-dd HH:mm:ss'),
                sv_billable_id: this.$app.isNull(this.popObject.sv_billable_id) ? 0 : this.popObject.sv_billable_id,
                sv_employee_id: this.$app.isNull(this.popObject.sv_employee_id) ? 0 : this.popObject.sv_employee_id,
                sv_preknot_hour: this.popObject.sv_preknot_hour,
                sv_preknot_minute: this.popObject.sv_preknot_minute,
                sv_remark: this.popObject.sv_remark,
            }
            stockApi.operateCateringTableUsing(postData).then(res => {
                if (res) {
                    this.checkedItem.sv_table_using_state = 1;
                    this.dataJson.sv_table_id = this.popObject.sv_table_id;
                    this.dataJson.sv_table_using_state = 1;
                    if (this.popObject.usingId) this.popContentStatus = false;
                    this.startOrderStatus = false;
                    this.showCashier = true;
                }
            });
        },
        handleCancelBooking() {                             // 取消预约
            this.updateTableState(this.popContent.sv_table_id, 6, this.popContent.id, () => {
                this.popContentStatus = false;
                this.checkedItem.sv_table_using_state = 0;
                this.$message.success('取消成功');
                this.getCashierRegionTableInfo();
            });
        },
        handleBooking() {                                   // 确定预约
            const postData = {
                sv_type: 1,
                id: this.popObject.id,
                sv_table_id: this.popObject.sv_table_id,
                usingId: this.popObject.usingId || 0,
                sv_booking_name: this.popObject.sv_booking_name,
                sv_booking_mobile: this.popObject.sv_booking_mobile,
                sv_arrival_date: this.$app.currentTime(new Date(this.popObject.sv_arrival_date), 'yyyy-MM-dd HH:mm:ss'),
                sv_cancel_date: this.$app.currentTime(new Date(this.popObject.sv_cancel_date), 'yyyy-MM-dd HH:mm:ss'),
                sv_employee_id: this.$app.isNull(this.popObject.sv_employee_id) ? 0 : this.popObject.sv_employee_id,
                sv_remark: this.popObject.sv_remark,
            }
            stockApi.operateCateringTableUsing(postData).then(res => {
                if (res) {
                    if (this.popObject.usingId) this.popContentStatus = false;
                    this.scheduleStatus = false;
                    this.checkedItem.sv_table_using_state = 6;
                    this.$message.success(postData.id === 0 ? '预约成功' : '修改成功');
                    this.getCashierRegionTableInfo();
                }
            });
        },
        handleCancelOccupy() {                              // 取消占用
            this.updateTableState(this.popContent.sv_table_id, 5, this.popContent.id, () => {
                this.popContentStatus = false;
                this.checkedItem.sv_table_using_state = 0;
                this.$message.success('取消成功');
                this.getCashierRegionTableInfo();
            });
        },
        handleSuccessMaintenance() {                        // 完成维护
            this.updateTableState(this.popContent.sv_table_id, 7, this.popContent.id, () => {
                this.popContentStatus = false;
                this.checkedItem.sv_table_using_state = 0;
                this.$message.success('操作成功');
                this.getCashierRegionTableInfo();
            });
        },
        handleUpdatePopSub() {                              // 确定占用 维护
            const postData = {
                sv_type: this.popObject.sv_type,
                usingId: this.popObject.usingId || 0,
                sv_table_id: this.popObject.sv_table_id,
                sv_employee_id: this.$app.isNull(this.popObject.sv_employee_id) ? 0 : this.popObject.sv_employee_id,
                sv_remark: this.popObject.sv_remark,
            }
            stockApi.operateCateringTableUsing(postData).then(res => {
                if (res) {
                    if (this.popObject.usingId) this.popContentStatus = false;
                    this.popSubStatus = false;
                    this.checkedItem.sv_table_using_state = this.popObject.sv_type === 3 ? 7 : 8;
                    this.$message.success('操作成功');
                    this.getCashierRegionTableInfo();
                }
            });
        },
        updateTableState(tableId, state, usingId, _fn) {
            // 1.自动清桌；2.手动清桌；3.预打；5.取消占用；；6.取消预订；7.完成维护
            stockApi.updateCateringState({ sv_source_type: 100, tableId, state, usingId }).then(res => {
                if (res) {
                    !!_fn && _fn();
                }
            });
        },
        async handleLight(sv_port, sv_switch, sv_electric_num) {
            try {
                this.isCefClient && await Cef.poolTableLightControll(sv_port, sv_switch, parseInt(sv_electric_num));
            } catch (error) {

            }
        },
        reservationListSubmit(val) {
            if (val.type === 'reservation') {
                this.reservationStatus = true;
                this.editReservation = val;
                return
            }
            if (val.type === 'reservationList') {
                this.reservationListStatus = true;
                this.editReservation = val;
                return
            }
            if (val.type === 'info') {
                this.handleListTable(this.reservationTableItem, true)
                return
            }
            if (val.type === 'success') {
                this.reservationListStatus = true;
                this.getCashierRegionTableInfo();
                return
            }
        },
        handleTableState(item) {                              // 点击预约
            if (item.sv_table_using_state === 6) {
                if (item.booking_type === 2) {
                    this.reservationTableItem = { ...item };
                    this.reservationListStatus = true;
                } else {
                    this.popSubStatus = true;
                }
                this.popObject.id = 0;
                this.popObject.sv_table_id = item.sv_table_id;
                this.popObject.usingId = 0;
                this.popObject.sv_booking_name = '';
                this.popObject.sv_booking_mobile = '';
                this.popObject.sv_arrival_date = new Date(new Date().getTime() + 3600 * 1000);
                this.popObject.sv_cancel_date = new Date(new Date().getTime() + 7200 * 1000);
                this.popObject.sv_employee_id = this.guiderList.find(e => e.id === this.userInfo.user_id) ? this.userInfo.user_id : null;
                this.popObject.sv_remark = '';
            }
        },
        handleListTable(item, reGet = false) {              // 点击房台
            // 0:空闲 1:已开台，待点餐 2:正在使用 3:待清桌 4:待接单 5:预结 6:预约 7:占用 8:维护 9:待预结
            if (item.booking_type === 2 && item.sv_table_using_state === 0 && !reGet) {
                this.reservationTableItem = { ...item };
                this.editReservation = {};
                this.reservationStatus = true;
                return
            }
            if (item.booking_type === 2 && item.sv_table_using_state === 6 && !reGet) {
                this.handleTableState(item)
                return
            }
            if (item.sv_table_id === this.checkedItem.sv_table_id && !reGet) return
            this.mergeCateringList = [];
            this.checkedItem = { ...item, preOrderMoney: 0, mergeCateringTableIds: [] };
            this.orderData = {
                productResults: []
            }
            this.clearBillableTimer();
            if (this.checkedItem.sv_table_using_state !== 0) this.getCateringModel()
            const takeOrderStatus = [1, 2, 4, 5, 9];
            if (takeOrderStatus.includes(item.sv_table_using_state)) {
                this.takeASingle(() => {
                    this.getGoodsBillabletime();
                });
            } else {
                this.clearMember();
            }
        },
        handleNumberChange(number) {                        // 确定就餐人数
            // this.showCashier = true;
            if (this.$app.isNull(number) || parseInt(number) === 0) this.$message({ message: '开台人数必须大于0', type: 'waring' });
            let obj = { operateTableId: this.checkedItem.sv_table_id, openTableNum: parseInt(number), operateType: 0, sv_table_using_state: this.checkedItem.sv_table_using_state }
            stockApi.OperateCateringTableByOperateType(obj).then(res => {
                if (res || res === null) {
                    this.dataJson.sv_table_id = this.checkedItem.sv_table_id;
                    this.dataJson.sv_table_using_state = 1;
                    this.showCashier = true;
                }
            });
        },
        handleRemove() {                                    // 清房台
            let obj = { operateTableId: this.checkedItem.sv_table_id, operateType: 1, sv_table_using_state: this.checkedItem.sv_table_using_state };
            stockApi.OperateCateringTableByOperateType(obj).then(res => {
                if (res || res === null) {
                    this.getCashierRegionTableInfo();
                    this.isRemove = false;
                    this.$message.success('清台成功')
                }
            });
        },
        getKitchenPrinter(dataList, type, tableName) {              // 获取厨打方案并打印
            // // 后厨打印已转为推送打印后厨
            // return
            let ids = [];
            dataList.forEach(e => {
                if (e.isPackage) {
                    e.packageGroups.forEach(p => {
                        p.products.forEach(k => {
                            ids.push({ sv_without_product_id: parseInt(e.productId + '' + e.index), packageproduct_id: e.productId, packagegroup_id: p.id, product_id: k.productId })
                        })
                    })
                } else {
                    ids.push({ sv_without_product_id: parseInt(e.productId + '' + e.index), product_id: e.productId, packageproduct_id: 0, packagegroup_id: 0 })
                }
            })
            if (ids.length === 0) return
            stockApi.getKitchenPrinter(ids).then(res => {
                if (res) {
                    // 厨打 type-厨打类型 add-加菜单 return-退菜单 online-厨打单 change-换台 and-并台
                    const extendInfo = {
                        isWaitting: false,
                        tableName: tableName || this.checkedItem.sv_table_name,
                        everyday_serialnumber: '',
                        orderTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        remark: this.checkedItem.sv_remark,
                    }
                    kitchenPrintMain(res, dataList, type, extendInfo);
                }
            });
        },
        handelFrontPrint(dataList, printType) {                     // 餐饮前台单
            // printType 1宾客单  
            // return // 后厨打印已转为推送打印后厨
            if (!this.cashierJurisdiction.PrintSet_guestorderprint) return;
            let printTypeText = ['', '宾客单', '加菜单', '退菜单', '换台单', '并台单'];
            let printDataList = [];

            let dataArray1 = [
                {
                    type: 'line',
                    text: this.userInfo.sv_us_shortname,
                    size: 17,
                    lineHeight: 30,
                    align: 1,
                    spaceLine: 0
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
                    text: '房台：' + this.checkedItem.sv_table_name,
                    align: 0,
                    spaceLine: 0,
                    size: 12,
                    lineHeight: 20
                },
                {
                    type: 'line',
                    text: '时间：' + this.$app.currentTime(new Date()),
                    align: 0,
                    spaceLine: 0
                },
                {
                    type: 'line',
                    text: '操作员：' + this.userInfo.sv_ul_name,
                    align: 0,
                    spaceLine: 0
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

            // 宾客单和加菜单不打印合计以后的内容
            let shopInfo = []
            // 宾客单\加菜单\退菜单不要地址、电话
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '电话：' + this.userInfo.sv_us_phone, align: 0, spaceLine: 0 })
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '地址：' + this.userInfo.sv_us_address, align: 0, spaceLine: 0 })

            shopInfo.push({ type: 'line', text: '备注：' + (this.$app.isNull(this.checkedItem.sv_remark) ? '' : this.checkedItem.sv_remark), align: 0, spaceLine: 2 })

            // 宾客单\加菜单\退菜单不要谢谢惠顾
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '谢谢惠顾，欢迎下次光临', align: 1, spaceLine: 0 })

            printDataList = printDataList.concat(shopInfo);

            this.$print.sales(printDataList);
        },
        //#endregion
    }
};