import { stockApi } from "@/api/index.js";
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
            selectedId: '',
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
            stockApi.getEmployeePageList().then(res =>{
                if (res.succeed && !this.$app.isNull(res.values)) {
                    this.dataList = res.values;
                }
            });
        },
        handleGuider(item) {
            this.selectedId = item.sv_employee_id;
            this.$emit('changeOperator', item);
            this.closeDialog();
        },
    }
};