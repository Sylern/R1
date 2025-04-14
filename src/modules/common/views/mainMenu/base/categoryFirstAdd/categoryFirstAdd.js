import { stockApi } from "@/api/index.js";
export default {
    name: 'categoryFirstAdd',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            querySubmit: {
                productcategory_id: 0,
                productsubcategory_id: 0,
                producttype_id: 0,
                sv_pc_name: '',
                sv_pc_code: '',
                sv_psc_parentid: 0,
                user_id: 0
            }
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
                    this.querySubmit = {
                        productcategory_id: 0,
                        productsubcategory_id: 0,
                        producttype_id: 0,
                        sv_pc_name: '',
                        sv_pc_code: '',
                        sv_psc_parentid: 0,
                        user_id: 0
                    }
                    this.getMaxProductCategory();
                    this.$nextTick(() => {
                        this.$refs.categryName.focus();
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
            this.$root.$emit('keyCode', 'categoryFirstAdd');
            this.$root.$emit('restaurant', 'categoryFirstAdd');
        },
        getMaxProductCategory() {                               // 获取分类编码
            stockApi.GetMaxProductCategory().then(res => {
                if (res) {
                    this.querySubmit.sv_pc_code = res;
                }
            });
        },
        changeMenu(type) {
            this.querySubmit.producttype_id = type;
        },
        handleEnter() {
            if (this.$app.isNull(this.querySubmit.sv_pc_name)) return this.$message({ message: '请输入分类名称', type: 'warning' });
            stockApi.saveCategory(this.querySubmit).then(res => {
                if (res.succeed) {
                    this.$emit('callback');
                    this.$message({ message: '新增分类成功', type: 'success' });
                    this.closeDialog();
                } else {
                    return this.$message({ message: res.errmsg, type: 'warning' });
                }
            });
        }
    }
};