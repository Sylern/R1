import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    components: {},
    name: 'hardware',
    data() {
        return {
            isAdd: false,
            query: {
                pageIndex: 1,
                pageSize: 10
            },
            total: 0,
            tableData: [],
            portList: [],
            addSubmit: {
                id: 0,
                sv_name: '',
                sv_port: '',
                sv_bit: 0,
                list: [],
            },
            relevanceShow: false,                       // 打开关联房台
            relevanceData: [],
            isBantch: false,                            // 批量打开房台
            tableSelectShow: false,                     // 打开选择房台
            menuList: [],                               // 房台区域
            tableSelectData: [],                        // 选择房台列表
            queryEntity: {                              // 查询条件
                pageSize: 99999,                            // 页码
                pageIndex: 1,                               // 页数
                userId: '',                                 // 店铺id
                regionId: -1,                               // 区域id
                queryTableCount: false,                     // 是否查询房台信息统计
                using_state: -1                             // 房台状态
            },
            currentECUItem: {

            }
        }
    },
    watch: {
    },
    computed: {
        ...mapState(['isCefClient']),
        showSumitList() {
            return this.addSubmit.list.slice(0, this.addSubmit.sv_bit)
        },
    },
    mounted() {
        this.getPortList();
        this.getElectricControlList();
    },
    methods: {
        async getPortList() {
            if (this.isCefClient) {
                this.portList = JSON.parse(await Cef.GetComList());
            }
        },
        handleAdd() {
            this.isAdd = true;
            this.addSubmit = {
                id: 0,
                sv_name: '',
                sv_port: '',
                sv_bit: 0,
                list: []
            }
            for (let index = 0; index < 64; index++) {
                this.addSubmit.list.push({
                    sv_electric_num: (index < 9 ? '0' : '') + (index + 1),
                    sv_table_id: 0,
                    sv_table_name: ''
                })
            }
            this.handleChangeType(8);
        },
        handleBackToList() {
            this.isAdd = false;
            this.getElectricControlList();
        },
        handleCurrentChange(page) {                             // 改变页码
            this.query.pageIndex = page;
            this.getElectricControlList();
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
            this.getElectricControlList();
        },
        handleEditGroup(item) {                                 // 编辑电控组
            this.addSubmit = {
                id: item.id,
                sv_name: item.sv_name,
                sv_port: item.sv_port,
                sv_bit: item.sv_bit,
                list: JSON.parse(JSON.stringify(item.list))
            }
            for (let index = this.addSubmit.list.length; index < 64; index++) {
                this.addSubmit.list.push({
                    sv_electric_num: (index < 9 ? '0' : '') + (index + 1),
                    sv_table_id: 0,
                    sv_table_name: ''
                })
            }
            this.isAdd = true;
        },
        handleDeleteGroup(item) {                               // 删除电控组
            this.$confirm('是否删除' + item.sv_name + '？').then(_ => {
                stockApi.deleteElectricControl({ id: item.id }).then(res => {
                    if (res) {
                        this.getElectricControlList();
                        this.$message.success('删除成功')
                    }
                })
            }).catch(_ => {

            });
        },
        getElectricControlList() {                              // 获取电控组列表
            stockApi.getElectricControlList(this.query).then(res => {
                if (res) {
                    this.tableData = res.list || [];
                    this.total = res.total;
                }
            })
        },
        handleChangeType(sv_bit) {
            if (this.addSubmit.sv_bit === sv_bit) return
            this.addSubmit.sv_bit = sv_bit;
        },
        handleSave() {                                          // 保存新增
            if (this.$app.isNull(this.addSubmit.sv_name)) return this.$message.warning('请输入电控组名称')
            const postData = {
                id: this.addSubmit.id,
                sv_name: this.addSubmit.sv_name,
                sv_port: this.addSubmit.sv_port,
                sv_bit: this.addSubmit.sv_bit,
                list: this.showSumitList.map(e => {
                    return {
                        sv_electric_num: e.sv_electric_num,
                        sv_table_id: e.sv_table_id
                    }
                }),
            }
            stockApi.operateElectricControl(postData).then(res => {
                if (res) {
                    this.isAdd = false;
                    this.getElectricControlList();
                    this.$message.success(postData.id === 0 ? '新增成功' : '修改成功')
                }
            })
        },
        handleShowRelevance() {
            this.relevanceShow = true;
            this.relevanceData = JSON.parse(JSON.stringify(this.showSumitList));
            this.$nextTick(() => {
                !!this.$refs.relevanceTable && this.$refs.relevanceTable.onReset();
            })
        },
        handleRelevanceUpdate(item) {
            this.currentECUItem = { ...item };
            this.isBantch = true;
            this.tableSelectShow = true;
            this.queryEntity.regionId = -1;
            this.getCateringRegionList();
        },
        handleRelevanceDelete(item) {                       // 解除关联
            if (this.$app.isNull(item.id)) {
                item.sv_table_id = 0;
                item.sv_table_name = '';
                return
            }
            // 编辑状态，解除关联调用接口
            stockApi.cancelElectricTableRelation({ id: item.id }).then(res => {
                if (res) {
                    item.sv_table_id = 0;
                    item.sv_table_name = '';
                    if (this.isBantch) {
                        this.addSubmit.list = this.addSubmit.list.map(e => {
                            return {
                                ...e,
                                sv_table_id: e.id === item.id ? 0 : e.sv_table_id,
                                sv_table_name: e.id === item.id ? 0 : e.sv_table_name,
                            }
                        })
                    }
                }
            })
        },
        handleSaveRelevance() {
            this.relevanceShow = false;
            this.addSubmit.list = JSON.parse(JSON.stringify(this.relevanceData));
            for (let index = this.addSubmit.list.length; index < 64; index++) {
                this.addSubmit.list.push({
                    sv_electric_num: (index < 9 ? '0' : '') + (index + 1),
                    sv_table_id: 0,
                    sv_table_name: ''
                })
            }
        },

        handleShowTableSelect(item) {
            if (item.sv_table_id) {
                this.$confirm('是否解除关联房台？').then(_ => {
                    this.handleRelevanceDelete(item);
                }).catch(_ => {

                });
                return
            }
            this.currentECUItem = { ...item };
            this.isBantch = false;
            this.tableSelectShow = true;
            this.queryEntity.regionId = -1;
            this.getCateringRegionList();
        },
        handleMenuClick(id) {                               // 点击房台区域
            this.queryEntity.regionId = id;
            this.getCashierRegionTableInfo();
        },
        getCateringRegionList() {                           // 获取房台区域
            if (this.menuList.length > 0) return this.getCashierRegionTableInfo();
            stockApi.getCateringRegionList({ seachStr: '', pageIndex: 1, pageSize: 999, }).then(res => {
                if (res) {
                    this.menuList = this.$app.isNull(res) ? [] : res.dataList.map(e => {
                        return { name: e.sv_region_name, id: e.sv_region_id }
                    });
                    this.menuList.unshift({ name: '全部', id: -1 });
                    this.getCashierRegionTableInfo();
                }
            })
        },
        getCashierRegionTableInfo() {                       // 获取房台列表
            stockApi.GetCashierRegionTableInfo(this.queryEntity).then(res => {
                if (res) {
                    this.tableSelectData = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.map((e, index) => {
                        let currentList = this.isBantch ? this.relevanceData : this.showSumitList;
                        const listSelectedItem = currentList.find(item => item.sv_table_id === e.sv_table_id);
                        const isSelected = !this.$app.isNull(e.sv_electric_num) || !this.$app.isNull(listSelectedItem);
                        const isDisabled = !this.$app.isNull(e.sv_electric_num) || !this.$app.isNull(listSelectedItem);
                        const sv_electric_num = !this.$app.isNull(e.sv_electric_num) ? e.sv_electric_num : !this.$app.isNull(listSelectedItem) ? listSelectedItem.sv_electric_num : '';
                        return { ...e, sv_electric_num, selected: isSelected, disabled: isDisabled }
                    });
                    this.$nextTick(() => {
                        !!this.$refs.tableListScroll && this.$refs.tableListScroll.update();
                    })

                }
            })
        },
        handleTableClick(item) {
            if (item.disabled) return;
            this.tableSelectData = this.tableSelectData.map(e => {
                return {
                    ...e,
                    selected: e.disabled ? e.selected : (e.sv_table_id !== item.sv_table_id ? false : !e.selected)
                }
            })
        },
        handleSaveTable() {
            const item = this.tableSelectData.find(e => !e.disabled && e.selected);
            if (this.$app.isNull(item)) return this.$message.warning('请选择房台')
            this.tableSelectShow = false;
            if (this.isBantch) {
                this.relevanceData.forEach(e => {
                    if (e.sv_electric_num === this.currentECUItem.sv_electric_num) {
                        e.sv_table_id = item.sv_table_id;
                        e.sv_table_name = item.sv_table_name;
                    }
                });
            } else {
                this.addSubmit.list.forEach(e => {
                    if (e.sv_electric_num === this.currentECUItem.sv_electric_num) {
                        e.sv_table_id = item.sv_table_id;
                        e.sv_table_name = item.sv_table_name;
                    }
                });
            }
            this.$nextTick(() => {
                this.tableSelectData = [];
            })
        },
    }
}