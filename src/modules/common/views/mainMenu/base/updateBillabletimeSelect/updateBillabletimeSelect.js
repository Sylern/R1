import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'goodsMoreInfo',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        tableId: {
            type: Number,
            default: null
        },
        billabletimeInfo: {
            type: Object,
            default: () => {
                return {
                    id: null,
                    configId: null,
                    code: '',
                    configNameId: '',
                    configName: '',                                     // 计费名称
                    startTime: '',                                      // 开始时间
                    endTime: '',                                        // 结束时间
                    durationUpdateTime: '',                             // 时长更新时间
                    duration: '',                                       // 累积时长
                    status: -1,                                         // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                    statusString: '',                                   // 计费状态
                    totalMoney: 0,                                      // 计费金额
                    pauseDuration: null,                                // 有效暂停时长
                    pauseTime: null,                                    // 可暂停时长
                    canPause: false,                                    // 是否允许暂停
                }
            }
        }
    },
    data() {
        return {
            sv_billable_id: '',
            billabletimeData: {
                id: null,
                list: []
            }
        }
    },
    computed: {
        ...mapState(['carttingData', 'cashierJurisdiction']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.sv_billable_id = '';
                    this.getBillabletimeConfig();
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
        },
        handleSure() {                                              // 确定按钮点击事件
            if (this.$app.isNull(this.sv_billable_id)) return this.$message.warning('请选择计费规则');
            let query = {
                tableId: this.tableId,
                sv_billable_id: this.sv_billable_id,
                sv_source_type: 100
            }
            
            stockApi.changeBillable(query).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                    this.$emit('handleBillableTimeUpdate', res);
                    this.closeDialog();
                }
            });
        },
        getBillabletimeConfig() {
            if(!this.$app.isNull(this.billabletimeData.configId) && this.billabletimeData.id === this.tableId && !this.$app.isNull(this.billabletimeData.list)) return
            stockApi.getBillabletimeConfig({ tableId: this.tableId }).then(res => {
                if (res) {
                    this.billabletimeData = {
                        id: this.tableId,
                        list: res.map(e => {
                            return {
                                ...e,
                                label: e.name,
                                value: e.id
                            }
                        })
                    }
                }
            });
        },
    }
};