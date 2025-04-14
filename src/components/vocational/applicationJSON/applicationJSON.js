import vuedraggable from "vuedraggable";
import config, { ID_TEXT, ID_DATE, ID_NUMBER, ID_MEMBER_DATE, ID_MEMBER_SEX, ID_IDCARD } from './components/config'
import * as view from './components/view/index'
import * as edit from './components/edit/index'
export default {
    components: { ...view, ...edit, vuedraggable },
    data() {
        return {
            jsonData: [],                          // 选中的组件集合
            activeIndex: -1,                       // 当前激活的组件序号
        }
    },
    props: {
        visible: { type: Boolean, default: true },
        title: { type: String, default: '表单' },
        typeImg: {
            type: String,
            default: '/system/matchInfo/matchTop.png'
        },
        editData: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        componentConfig() { return config },
        componentGroup() {
            const { type } = this
            return [
                { title: "公共组件", ids: [ID_TEXT, ID_DATE, ID_NUMBER, ID_IDCARD] },
                (type === 1 && { title: "会员组件", ids: [ID_MEMBER_DATE, ID_MEMBER_SEX] })
            ]
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.showInit();
                }
            }
        }
    },

    mounted() {
        // const { editType, id, type } = this.$route.query
        // this.verifyTemplate = false
        // if (editType === 'add') {
        //     this.activeIndex = -1
        //     this.type = + (type || "3")
        //     this.jsonData = []
        //     this.templateName = ""
        //     this.id = 0
        // } else {
        //     id && stockApi.GetFormById({ id }).then(res => {
        //         const jsonData = JSON.parse(res.sv_form_content || "[]")
        //         this.activeIndex = jsonData.length > 0 ? 0 : -1
        //         this.templateName = res.sv_form_name
        //         this.type = res.sv_form_type
        //         this.jsonData = jsonData
        //         this.id = editType === 'copy' ? 0 : res.id
        //     })
        // }
    },
    methods: {
        showInit() {
            this.activeIndex = -1
            this.jsonData = [...this.editData]
        },
        closeDialog() {                                 // 关闭弹窗
            this.dialogVisible = 'close';
        },
        handleAddComponent(id) {                          // 点击组件 - 添加选中的组件数据
            const { componentConfig: { [id]: { props: { props } } } } = this
            let data = { id }
            for (const [key, val] of Object.entries(props)) { data[key] = val.default }
            this.jsonData.splice(++this.activeIndex, 0, data);
            this.$nextTick(() => { //当前激活模块滚动到顶部
                this.$refs.myScrollbar.wrap.scrollTop = this.$refs.refcomponent[this.activeIndex].$el.offsetTop
            });
        },
        handleActive(index) {                              // 点击添加的组件 - 设置选中效果
            this.activeIndex !== index && (this.activeIndex = index)
        },
        handleDelComponent(index) {                        // 删除组件
            this.jsonData.splice(index, 1);
            index <= this.activeIndex && (this.activeIndex--)
        },
        handSortChang({ moved }) {                        //排序发送改变
            const { newIndex, oldIndex } = moved;
            const activeIndex = this.activeIndex;
            if (oldIndex === activeIndex) { this.activeIndex = newIndex; return }
            if (oldIndex > activeIndex && newIndex <= activeIndex) { this.activeIndex++; return }
            this.activeIndex--;
        },
        handlePropChange({ pro, val }) {                              // 更新组件内的数据
            // debugger;
            this.$set(this.jsonData[this.activeIndex], pro, val);
        },
        handleSave() {
            const { jsonData } = this
            if (jsonData.length === 0) { this.$message({ type: "error", message: "请设计表单!" }); return }
            //如果存在日期组件，并且改组件为指定日期，则必须填写value
            const dateDataIndex = jsonData.findIndex(item => (item.id === ID_DATE && !item.today && !item.start))
            if (dateDataIndex > -1) {
                this.$message({ type: "error", message: `组件[${jsonData[dateDataIndex].label || config[ID_DATE].name}]为指定日期时，默认值不能为空` })
                this.activeIndex = dateDataIndex
                this.$nextTick(() => { this.$refs[`${config[ID_DATE].editName}_${dateDataIndex}`].validate() })
                return
            }
            this.$emit('handleSave', jsonData);
            this.closeDialog();
        },
    }
}