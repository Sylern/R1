import { basicApi } from "@/api/index.js";
export default {
    name: 'guiderSelect',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
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
        selectedList() {
            let dataArray = [];
            this.dataList.forEach(e => {
                if (e.isSelected) {
                    dataArray.push(e)
                }
            });
            return dataArray
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
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
            basicApi.getEmployeePageList().then(res => {
                if (res.succeed && !this.$app.isNull(res.values)) {
                    this.dataList = res.values.map(e => {
                        return {
                            isSelected: false,
                            ...e
                        }
                    });
                }
            });
        },
        handleGuider(index) {
            if (this.selectedList.length > 2 && !this.dataList[index].isSelected) {
                this.$message({ message: '参与同一个项目的销售人员不能超过三个', type: 'warning' });
                return
            }
            this.dataList[index].isSelected = !this.dataList[index].isSelected;
        },
        handleSure() {
            if (this.selectedList.length < 1) {
                return this.$message({ message: '请选择销售人员', type: 'warning' });
            };
            this.$emit('changeOperator', this.selectedList);
            this.closeDialog();
        },
    }
};