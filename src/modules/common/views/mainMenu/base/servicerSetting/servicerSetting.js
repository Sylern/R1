import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    name: 'servicerSetting',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isSingle: {
            type: Boolean,
            default: false
        },
        isOrderList: {
            type: Boolean,
            default: false
        },
        employeeList: {
            type: Array,
            default: () => []
        },
        carttingPos: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            menuPos: -1,
            imgBase: stockApi.imgBase(),
            selectedList: [],
        }
    },
    computed: {
        ...mapState(['storeEmployeeList', 'carttingData']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        currEmployeeList() {
            let dataList = [];
            if (this.menuPos === -1) {
                this.storeEmployeeList.forEach(item => {
                    dataList = dataList.concat(item.list || []);
                });
            } else {
                dataList = this.storeEmployeeList[this.menuPos].list || [];
            }
            return dataList
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    if (this.carttingPos < 0) return;
                    const dataArray = JSON.parse(JSON.stringify(this.employeeList));
                    this.selectedList = dataArray.length > 0 ? dataArray : [];
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
        handleMenuItem(pos) {                               // 切换员工菜单
            if (this.menuPos === pos) return;
            this.menuPos = pos;
        },
        handleDeleteSelected(pos) {                         // 删除当前所选员工
            if (pos < 0) return;
            this.selectedList.splice(pos, 1);
        },
        handleEmployeeItem(item) {                          // 选择员工
            if (this.isSingle) {
                this.selectedList = [];
                this.selectedList.push(item)
                return
            }
            if (this.selectedList.length === 4) return this.$message.warning('已选择 4 位员工，请删除后再选择');
            let hasIndex = this.selectedList.findIndex(e => e.sv_employee_id === item.sv_employee_id)
            if (hasIndex > -1) return this.$message.warning('已选第 ' + parseInt(hasIndex + 1) + ' 位是当前员工');
            item.isAppoint = false;
            this.selectedList.push(item);
        },
        handleClear() {                                     // 清空已选员工
            this.$confirm('是否要清空已选员工？').then(_ => {
                this.selectedList = [];
            }).catch(_ => {

            });
        },
        handleSure() {
            let list = JSON.parse(JSON.stringify(this.employeeList));
            list = this.selectedList.map((item, index) => {
                const itemPercent = this.selectedList.length === 1 ? 100 : parseInt(100 / this.selectedList.length)
                const percent = index !== this.selectedList.length - 1 ? itemPercent : (100 - itemPercent * (this.selectedList.length - 1))
                return {
                    ...item,
                    employeeId: item.sv_employee_id,
                    status: e.status || 0,
                    start_time: e.start_time || '',
                    end_time: e.end_time || '',
                    isLocked: false,
                    inputLocked: false,
                    percentValue: this.isOrderList ? 0 : this.$app.moneyFixed((percent * this.carttingData.productResults[this.carttingPos].dealMoney) / 100),
                    percent,
                }
            });
            if (list.length === 0) return this.$message.warning('请选择服务人员')
            this.$emit('handleServicerSetting', list);
            this.closeDialog();
        },
    }
};