import numberChange from '../../../../base/numberChange/numberChange.vue';
import rCashier from '../cashier/cashier.vue';
import { stockApi } from "@/api/index.js";
import base from "@/api/base.js";
import { dcDialog } from '@/components/index';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
    components: { numberChange, rCashier, dcDialog },
    name: 'deskList',
    data() {
        return {
            frontImgBase: base.frontImgBase,
            isOrderBack: false,                         // 是否反结账
            menuList: [],                               // 房台区域
            //activeMenu: -1,                           // 选中的房台
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
                waitForClearCount: 0,                       // 待清台
                waitForStateCount: 0,                       // 已开台
                isBeforeHandCount: 0                        // 已预结
            },
            dataList: [],                               // 房台列表数据
            fanjieList: [],                             // 反结账列表数据
            keyScrollbar: 1,                            // 滚动条Key值
            refreshBool: false,                         // 刷新
            checkedItem: {},                            // 点击选中的房台
            notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
            isRemove: false,                            // 显示清除房台
            showCashier: false,                         // 打开收银台
            dataJson: {                                 // 传入点餐组件的数据
                code: ''
            },
            numberChangeStatus: false

        }
    },
    computed: {
        ...mapState(['refreshRoom']),
        ...mapState('permission', ['CashierManage']),
    },
    watch: {
        'queryEntity.regionId': {                               // 上级门店切换后获取分店年限
            deep: true, handler: function (newVal, oldVal) {
                if (newVal === -2) this.Getguandan();
            }
        },
        refreshRoom: {                                          // 推送消息刷新房台
            deep: true,
            handler(nval) {
                if (nval) {
                    this.getCashierRegionTableInfo();
                    this.update({ key: 'refreshRoom', data: false });
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
        if (!this.isOrderBack) {
            this.queryEntity.userId = this.$store.state.userInfo.user_id + '';
            this.getCateringRegionList();                       // 获取房台区域
        }
    },
    beforeDestroy() {
        this.$root.$off('onTable', this.onTable);
    },
    methods: {
        ...mapMutations(['update', 'clearMember']),
        onTable() {
            this.showCashier = false;
            this.clearMember();
            this.getCateringRegionList();
        },
        //#region 获取数据
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
        getCashierRegionTableInfo(searchHandle = false) {                       // 获取房台列表
            stockApi.GetCashierRegionTableInfo(this.queryEntity).then(res => {
                if (res) {
                    this.dataList = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.map((e, index) => {
                        // let sv_table_using_state = index > 4 ? 0 : index;
                        // let stateName = this.setStateName(sv_table_using_state);
                        // let time = this.$app.friendlyTime(new Date('2021-10-21 09:51:00'))
                        let stateName = this.setStateName(e.sv_table_using_state);
                        let time = this.$app.isNull(e.sv_table_opendate) ? '' : this.$app.friendlyTime(new Date(e.sv_table_opendate));
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
        Getguandan() {                                      // 查询反结账
            let obj = { user_id: this.queryEntity.userId, isAntiSettlement: true, tableId: -1, pageSize: 999999, page: 1, selectType: -1 }
            stockApi.Getguandan(obj).then(res => {
                this.fanjieList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                    let time = this.$app.isNull(e.wt_datetime) ? '' : this.$app.friendlyTime(new Date(e.wt_datetime)) + '前';
                    return { ...e, time }
                });
                !!this.$refs.scrollbar && this.$refs.scrollbar.update();
                if (this.refreshBool) this.refreshBool = false, this.$message({ message: '刷新成功', type: 'success' });
            });
        },


        //#endregion

        //#region   事件

        setStateName(state) {                               // 显示房台状态
            switch (state) {
                case 1: return '已开台';
                case 2: return '使用中';
                case 3: return '待清台';
                case 4: return '待接单';
                case 5: return '已预结';
                default: break;
            }
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
            this.queryEntity.regionId === -2 ? this.Getguandan() : this.getCashierRegionTableInfo();
        },
        handleJump(obj) {                                   // 跳转 房台列表
            let { type } = obj;
            switch (type) {
                case 'tableSetting': this.$router.push({ path: '/functionSetting/tableSetting' }); break;
                default: break;
            }
        },
        handleListTable(item) {                             // 点击房台
            // 0:空闲 1:已开台，待点餐 2:正在使用 3:待清台 4:待接单
            if (item.sv_table_using_state === 0) {
                const permissionItem = this.CashierManage.openCateringTable_catering || { enabled: true }
                if (!permissionItem.enabled) {
                    return this.$message.warning(permissionItem.tips)
                }
                this.numberChangeStatus = true;
                this.checkedItem = item;
                return
            }
            if (item.sv_table_using_state === 1 || item.sv_table_using_state === 2 || item.sv_table_using_state === 4 || item.sv_table_using_state === 5) {
                this.dataJson.code = item.sv_table_id;
                this.dataJson.sv_table_using_state = item.sv_table_using_state;
                this.showCashier = true;
                return
            }
            if (item.sv_table_using_state === 3) {
                this.checkedItem = item;
                this.isRemove = true;
                return
            }
        },
        handleNumberChange(number) {                        // 确定就餐人数
            // this.showCashier = true;
            if (this.$app.isNull(number) || parseInt(number) === 0) this.$message({ message: '开台人数必须大于0', type: 'waring' });
            let obj = { operateTableId: this.checkedItem.sv_table_id, openTableNum: parseInt(number), operateType: 0, sv_table_using_state: this.checkedItem.sv_table_using_state }
            stockApi.OperateCateringTableByOperateType(obj).then(res => {
                // debugger;
                if (res || res === null) {
                    this.dataJson.code = this.checkedItem.sv_table_id;
                    this.dataJson.sv_table_using_state = 1;
                    this.showCashier = true;
                }
            });
        },
        handleRemove() {                                    // 清房台
            let obj = { operateTableId: this.checkedItem.sv_table_id, operateType: 1, sv_table_using_state: this.checkedItem.sv_table_using_state };
            stockApi.OperateCateringTableByOperateType(obj).then(res => {
                // debugger;
                if (res || res === null) {
                    this.getCashierRegionTableInfo();
                    this.isRemove = false;
                    this.$message.success('清台成功')
                }
            });
        },
        handleCancel(obj) {                                 // 点击反结区
            this.dataJson.code = obj.sv_table_id;
            this.showCashier = true;
        },
        //#endregion

    }
};