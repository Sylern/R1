import { stockApi } from "@/api/index.js";
export default {
    name: 'guiderSelect',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '导购员选择'
        },
        selectedNumber: {
            type: Number,
            default: 4
        }
    },
    data() {
        return {
            selectedId: '',
            selectedIds: [],
            dataList: []
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        imgBase() {
            return stockApi.imgBase()
        },
    },
    watch: {
        dialogVisible: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.selectedIds = [];
                        this.$refs.guiderSelect.focus();
                        this.getEmployeePageList();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        closeDialog() {
            this.dialogVisible = 'close';
        },
        getEmployeePageList() {
            stockApi.getEmployeePageListV2().then(res => {
                if (res.succeed && !this.$app.isNull(res.values)) {
                    this.dataList = res.values;
                    this.$nextTick(() => {
                        !!this.$refs.guiderList && this.$refs.guiderList.update();
                    })
                }
            });
        },
        handleGuider(item) {
            if (this.selectedNumber === 1) {
                this.selectedIds.push({
                    id: item.sv_employee_id,
                    name: item.sv_employee_name,
                    groupName: item.sp_grouping_name
                });
                return this.handleSure()
            }
            let index = this.selectedIds.findIndex(e => e.id === item.sv_employee_id);
            if (index > -1) return this.selectedIds.splice(index, 1);
            if (this.selectedIds.length === this.selectedNumber) {
                this.selectedIds.splice(0, 1);
                if (this.selectedNumber > 1) this.$message.warning('最多只能选择' + this.selectedNumber + '人')
            }
            this.selectedIds.push({
                id: item.sv_employee_id,
                name: item.sv_employee_name,
                groupName: item.sp_grouping_name
            });
        },
        handleSure() {
            this.$emit('handleBack', this.selectedIds);
            this.closeDialog();
        },
    }
};