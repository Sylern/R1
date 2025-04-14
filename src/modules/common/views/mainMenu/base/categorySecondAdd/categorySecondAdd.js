import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'categorySecondAdd',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        firstCategoryId: {                          // 当前选择的一级分类id
            type: Number,
            default: -1
        },
        firstCategory: {                            // 传入的一级分类列表
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            currentFirstCategory: [],               // 一级分类
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
        ...mapState(['memberList']),
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
                        productcategory_id: this.firstCategoryId,
                        productsubcategory_id: 0,
                        producttype_id: 0,
                        sv_pc_name: '',
                        sv_pc_code: '',
                        sv_psc_parentid: 0,
                        user_id: 0
                    }
                    this.currentFirstCategory = this.firstCategory.map(e => {
                        return {
                            value: e.productcategory_id,
                            label: e.sv_pc_name
                        }
                    })
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
        ...mapMutations(['update']),
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'categorySecondAdd');
            this.$root.$emit('restaurant', 'categorySecondAdd');
        },
        handleEnter() {
            if (this.$app.isNull(this.querySubmit.sv_pc_name)) return this.$message({ message: '请输入分类名称', type: 'warning' });
            stockApi.saveCategory(this.querySubmit).then(res => {
                if (res.succeed) {
                    this.$emit('callback');
                    this.$message({ message: '新增分类成功', type: 'success' });
                    this.closeDialog();
                }else {
                    return this.$message({ message: res.errmsg, type: 'warning' });
                }
            });
        },
    }
};