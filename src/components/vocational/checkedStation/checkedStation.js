/* 
    visible - false 隐藏    true 显示
    dataJson - 数据  label-名称 value-值
    activeJson - 选中的岗位id
*/
import { stockApi } from '@/api/index';
export default {
    components: {},
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Array, default: [] },
        activeJson: { type: Array, default: [] }
    },
    data() {
        return {
            activeId: [],                       // 选中的岗位id
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                this.$emit('update:visible', value);
            }
        },
    },
    mounted() {
    },
    watch: {
        activeJson: {
            deep: true,
            handler: function (newVal, oldVal) {
                this.activeId = newVal;
            }
        },
    },
    methods: {
        //#region 事件
        handleSubmit() {                                // 岗位 - 确定
            let array = this.$app.isNull(this.activeId) || this.$app.isNull(this.dataJson) ? [] : this.dataJson.filter(item => this.activeId.findIndex(k => k === item.value) > -1);
            this.$emit('callback', array);
            this.dialogVisible = false;
        },
        handleIsDisabled(obj) {                         // 岗位 - 禁用
            if (this.$app.isNull(this.activeJson)) return false;
            let item = this.activeJson.find(e => e === obj.value);
            if (this.$app.isNull(item)) return false;
            return item.isDisable === true ? true : false;
        },
        //#endregion

        //#region 获取数据


        //#endregion
    }
}