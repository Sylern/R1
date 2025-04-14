import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    name: 'servicerSetting',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        hasBtnAll: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            menuPos: -1,
            imgBase: stockApi.imgBase(),
        }
    },
    computed: {
        ...mapState(['storeEmployeeList']),
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
                    dataList = dataList.concat(item.list);
                });
            } else {
                dataList = this.storeEmployeeList[this.menuPos].list;
            }
            return dataList
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    if (this.carttingPos < 0) return;
                    this.$nextTick(() => {

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
        handleMenuItem(pos) {                               // 切换员工菜单
            if (this.menuPos === pos) return;
            this.menuPos = pos;
        },
        handleEmployeeItem(item) {                          // 选择员工
            this.$emit('handleServicer', item);
        },
        handleAll() {                                       // 全选员工
            this.$emit('handleServicer');
        },
        handleCancel() {                                    // 取消选择
            this.closeDialog();
        },
    }
};