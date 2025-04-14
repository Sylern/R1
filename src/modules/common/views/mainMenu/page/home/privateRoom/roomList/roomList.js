import base from "@/api/base.js";
import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import prCashier from '../cashier/cashier.vue';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import reservation from '@/modules/common/views/common/components/reservation/reservation.vue';
import reservationList from '@/modules/common/views/common/components/reservationList/reservationList.vue';
import reservationInfo from '@/modules/common/views/common/components/reservationInfo/reservationInfo.vue';
export default {
    components: { numberChange, prCashier, reservation, reservationList, reservationInfo },
    name: 'deskList',
    data() {
        return {
            imgBase: stockApi.imgBase(),
            isOrderBack: false,                         // 是否反结账
            frontImgBase: base.frontImgBase,
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
            keyScrollbar: 1,                            // 滚动条Key值
            refreshBool: false,                         // 刷新
            checkedItem: {},                            // 点击选中的房台
            notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
            isRemove: false,                            // 显示清除房台
            showCashier: false,                         // 打开收银台
            dataJson: {                                 // 传入点餐组件的数据
                code: ''
            },
            guiderList: [],                             // 员工列表
            employeeList: [],                           // 服务中员工
            groupList: [],
            state_count: {                              // 艺人技能状态
                all_count: 0,
                free_count: 0,
                service_count: 0
            },
            stateText: {
                0: '空闲',
                1: '服务中'
            },
            stateSelectPos: -1,                         // -1-全部 0-空闲 1-服务中
            showFnList: false,                          // 显示开台、预约、占用、维护
            startOrderStatus: false,
            scheduleStatus: false,
            numberChangeStatus: false,
            billabletimeList: [],
            editReservation: {},
            reservationStatus: false,                   // 预订弹窗
            reservationListStatus: false,               // 预订列表弹窗
            reservationInfoStatus: false,               // 预订详情弹窗
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
        }
    },
    computed: {
        ...mapState(['refreshRoom', 'menuJson', 'userInfo', 'isCefClient']),
        ...mapState('permission', ['CashierManage']),
        hasProgramAssistant() {
            const menuItem = (this.menuJson || []).find(e => e.menu_path === '/staffManagement/programAssistant');
            if (menuItem) return menuItem.sv_enabled
            return false
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
                    this.clearBillabletimeInfo()
                }
            }
        },
        hasProgramAssistant: {
            immediate: true,
            handler(newval) {
                if (newval) {
                    this.getTutorGroupingList()
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
        this.getEmployeePageList();
        this.queryEntity.userId = this.userInfo.user_id + '';
        this.getCateringRegionList();                       // 获取房台区域
        this.getUiGroupingEmployeeList();
    },
    beforeDestroy() {
        this.$root.$off('onTable', this.onTable);
    },
    methods: {
        ...mapMutations(['update', 'clearMember', 'clearCartting', 'clearBillabletimeInfo']),
        ...mapActions(['getUiGroupingEmployeeList']),
        onTable() {
            this.showCashier = false;
            this.clearCartting();
            this.getCateringRegionList();
            this.getUiGroupingEmployeeList();
        },
        //#region 获取数据
        getEmployeePageList() {                              // 获取导购员
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
        getTutorGroupingList() {
            stockApi.getTutorGroupingList().then(res => {
                if (res) {
                    this.groupList = this.$app.isNull(res.grouping_list) ? [] : res.grouping_list;
                    this.state_count = {
                        all_count: res.state_count.all_count,
                        free_count: res.state_count.free_count,
                        service_count: res.state_count.service_count
                    }
                    this.$nextTick(() => {
                        !!this.$refs.goodsListScroll && this.$refs.goodsListScroll.update();
                    })
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
                    this.getCashierRegionTableInfo();                   // 获取房台列表
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
                    if (searchHandle && this.dataList.length === 1) {
                        this.handleListTable(this.dataList[0])
                    }
                }
                if (this.refreshBool) this.refreshBool = false, this.$message({ message: '刷新成功', type: 'success' });
            })
        },
        //#endregion

        //#region   事件
        handleEmployeeList(list) {
            if (this.stateSelectPos === -1) return list
            return list.filter(e => e.employee_state === this.stateSelectPos)
        },
        handleWorkerState(pos) {
            this.stateSelectPos = pos;
        },
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
        handleRefresh() {                                   // 刷新
            this.refreshBool = true;
            this.getCashierRegionTableInfo();
        },
        handleJump(obj) {                                   // 跳转 房台列表
            let { type } = obj;
            switch (type) {
                case 'tableSetting': this.$router.push({ path: '/functionSetting/tableSetting' }); break;
                default: break;
            }
        },
        handleFnItem(type) {
            if (type === 'occupy') {
                // 占用
                this.showFnList = false;
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
                this.showFnList = false;
                this.popSubStatus = true;
                this.popObject.sv_type = 4;
                this.popObject.usingId = 0;
                this.popObject.sv_table_id = this.checkedItem.sv_table_id;
                this.popObject.sv_employee_id = this.guiderList.find(e => e.id === this.userInfo.user_id) ? this.userInfo.user_id : null;
                this.popObject.sv_remark = '';
                return
            }
            if (type === 'startOrderStatus') {
                // 开房台
                this.showFnList = false;
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
                this.showFnList = false;
                if (this.checkedItem.booking_type === 2) {
                    this.editReservation = {};
                    this.reservationStatus = true;
                } else {
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
                }
            }
            if (type === 'kaideng') {
                // 开灯
                this.showFnList = false;
                this.handleLightSwitch(this.checkedItem);
            }
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
                    this.dataJson.sv_table_id = this.popObject.sv_table_id;
                    this.dataJson.sv_table_using_state = 1;
                    if (this.popObject.usingId) this.popContentStatus = false;
                    this.startOrderStatus = false;
                    this.clearMember();
                    this.showCashier = true;
                }
            });
        },
        handleCancelBooking() {                             // 取消预约
            this.updateTableState(this.popContent.sv_table_id, 6, this.popContent.id, () => {
                this.popContentStatus = false;
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
                    this.$message.success(postData.id === 0 ? '预约成功' : '修改成功');
                    this.getCashierRegionTableInfo();
                }
            });
        },
        handleCancelOccupy() {                              // 取消占用
            this.updateTableState(this.popContent.sv_table_id, 5, this.popContent.id, () => {
                this.popContentStatus = false;
                this.$message.success('取消成功');
                this.getCashierRegionTableInfo();
            });
        },
        handleSuccessMaintenance() {                        // 完成维护
            this.updateTableState(this.popContent.sv_table_id, 7, this.popContent.id, () => {
                this.popContentStatus = false;
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
        handleLightSwitch(item) {
            let currentSwitch = item.sv_switch;
            stockApi.updateElectricSwitch({ sv_electric_id: item.sv_electric_id, sv_table_id: item.sv_table_id, sv_switch: currentSwitch ? false : true }).then(res => {
                if (res) {
                    let filterItem = this.dataList.find(e => e.sv_table_id === item.sv_table_id && e.sv_electric_id === item.sv_electric_id)
                    filterItem.sv_switch = !filterItem.sv_switch;
                    // this.handleLight(item.sv_port, currentSwitch ? false : true, item.sv_electric_num);
                }
            });
        },
        async handleLight(sv_port, sv_switch, sv_electric_num) {
            try {
                this.isCefClient && await Cef.poolTableLightControll(sv_port, sv_switch, parseInt(sv_electric_num));
            } catch (error) {

            }
        },
        handleTableState(item) {                              // 点击预约
            if (item.sv_table_using_state === 6) {
                if (item.booking_type === 2) {
                    this.checkedItem = item;
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
        reservationListSubmit(val) {
            if (val.type === 'scheduleStatus') {
                this.reservationStatus = true;
                this.editReservation = val;
                return
            }
            if (val.type === 'reservation') {
                this.reservationStatus = true;
                this.editReservation = val;
                return
            }
            if (val.type === 'reservationList') {
                this.reservationListStatus = true;
                return
            }
            if (val.type === 'info') {
                this.reservationInfoStatus = true;
                return
            }
            if (val.type === 'success') {
                this.reservationListStatus = true;
                this.getCashierRegionTableInfo();
                return
            }
        },
        handleListTable(item) {                             // 点击房台
            // 0:空闲 1:已开台，待点餐 2:正在使用 3:待清桌 4:待接单 5:已预结 9:待预结
            if (item.sv_table_using_state === 0) {
                this.showFnList = true;
                this.checkedItem = { ...item };
                return
            }
            if (item.sv_table_using_state === 1 || item.sv_table_using_state === 2 || item.sv_table_using_state === 4 || item.sv_table_using_state === 5 || item.sv_table_using_state === 9) {
                if (item.booking_type === 2) {
                    this.checkedItem = { ...item };
                    this.reservationInfoStatus = true;
                } else {
                    if (item.is_online_order) return this.$message.warning('客户已开台，无法操作')
                    this.dataJson.sv_table_id = item.sv_table_id;
                    this.dataJson.sv_table_using_state = item.sv_table_using_state;
                    this.clearMember();
                    this.showCashier = true;
                }
                return
            }
            if (item.sv_table_using_state === 3) {
                this.checkedItem = { ...item };
                this.isRemove = true;
                return
            }
            if (item.sv_table_using_state === 6 || item.sv_table_using_state === 7 || item.sv_table_using_state === 8) {
                // 6-预约 7-占用 8-维护
                if (item.booking_type === 2 && item.sv_table_using_state === 6) {
                    this.handleTableState(item)
                    return
                }
                stockApi.getCateringTableUsing({ tableId: item.sv_table_id }).then(res => {
                    const titleText = { 6: '预约', 7: '占用', 8: '维护' }
                    this.checkedItem = { ...item };
                    if (res || res === null) {
                        this.showFnList = false;
                        this.popContentStatus = true;
                        this.popContent = {
                            title: titleText[item.sv_table_using_state],
                            sv_table_using_state: item.sv_table_using_state,
                            ...res
                        }
                    }
                });
                return
            }
        },
        handleNumberChange(number) {                        // 确定就餐人数
            if (this.$app.isNull(number) || parseInt(number) === 0) this.$message({ message: '开台人数必须大于0', type: 'waring' });
            let obj = { operateTableId: this.checkedItem.sv_table_id, openTableNum: parseInt(number), operateType: 0, sv_table_using_state: this.checkedItem.sv_table_using_state }
            stockApi.OperateCateringTableByOperateType(obj).then(res => {
                if (res || res === null) {
                    this.dataJson.sv_table_id = this.checkedItem.sv_table_id;
                    this.dataJson.sv_table_using_state = 1;
                    this.clearMember();
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
        //#endregion

    }
};