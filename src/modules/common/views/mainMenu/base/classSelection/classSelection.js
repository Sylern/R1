import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    name: 'discount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        courseList: {
            type: Array,
            default: () => {
                return []
            }
        },
        memberId: {
            type: String,
            default: ''
        },
        orderId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogSelectClass: false,
            currentCourse: {},
            checkClassList: [],
            tableClassData: []
        }
    },
    computed: {
        ...mapState(['userInfo']),
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
                        !!this.$refs.myTableCourse && this.$refs.myTableCourse.onReset();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        focusNext(data) {
            if (this.$app.isNull(data.value)) return
            this.$refs['input_' + data.refPos][0].blur();
            if (!!this.$refs['input_' + (data.refPos + 1)]) {
                this.$refs['input_' + (data.refPos + 1)][0].focus();
            }
        },
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                        // Enter
                    // this.handleSubmit();
                    return;
                case 27:                                        // Esc
                    this.closeDialog();
                    return;
                default:
                    console.log('discount key ' + code + ' is click');
                    return;
            }
        },
        handleSelected(item) {
            this.currentCourse = item;
            this.getCourseClassTeacherAssistants();
        },
        handleSelectAll(data, checkedBool) {                    // 课程全选 
            let json = [...this.checkClassList];
            if (checkedBool) {
                this.tableClassData.forEach(item => {
                    if (this.checkClassList.findIndex(e => e.sv_guid === item.sv_guid) === -1) json.push(item);
                });
            } else {
                json = json.filter(item => this.tableClassData.findIndex(e => e.sv_guid === item.sv_guid) === -1)
            }
            this.checkClassList = json;
        },
        handleSellect(row, data, checkedBool) {                 // 课程单选
            if (checkedBool) {
                if (this.checkClassList.findIndex(e => e.sv_guid === row.sv_guid) === -1) {
                    this.checkClassList.push(row);
                }
            } else {
                this.checkClassList = this.checkClassList.filter(e => e.sv_guid !== row.sv_guid);
            }
        },
        handleClassSure() {
            this.currentCourse.sv_class_name = this.checkClassList.map(e => e.sv_class_name);
            this.currentCourse.sv_class_ids = this.checkClassList.map(e => e.sv_guid);
            this.$set(this.courseList, this.currentCourse.index, this.currentCourse);
            this.dialogSelectClass = false;
        },
        getCourseClassTeacherAssistants() {                     // 查询可选班级列表
            this.dialogSelectClass = true;
            if (this.$app.isNull(this.orderId)) return
            let query = {
                p_id: this.currentCourse.sv_product_id
            }
            this.checkClassList = [];
            this.tableClassData = [];
            stockApi.getCourseClassTeacherAssistants(query).then(res => {
                if (res) {
                    this.tableClassData = this.$app.isNull(res) ? [] : res.map(e => {
                        return {
                            ...e,
                            rowChecked: false,
                            pnamesText: e.pnames.join(),
                            teacherText: e.teacher.join(),
                            assistantText: e.assistant.join(),
                        }
                    });
                    this.$nextTick(() => {
                        !!this.$refs.myTableClass && this.$refs.myTableClass.onReset();
                    })
                }
            });
        },
        handleSubmit() {                                        // 课程绑定班级
            const wattingList = this.courseList.filter(e => e.sv_state === 0 && !this.$app.isNull(e.sv_class_name));
            if (wattingList.length < 1) return this.closeDialog();
            const query = {
                source: 100,
                m_id: this.memberId,
                orderId: this.orderId,
                courseClassLists: this.courseList.map(e => {
                    return {
                        p_id: e.sv_product_id,
                        sv_guids: e.sv_class_ids
                    }
                })
            }
            stockApi.addMemberCoursesClass(query).then(_ => {
                this.$message.success('课程选班成功');
                this.closeDialog();
            });
        },
        closeDialog() {
            this.dialogVisible = 'close';
            this.dialogSelectClass = false;
            this.$emit('close');
        },
    }
};