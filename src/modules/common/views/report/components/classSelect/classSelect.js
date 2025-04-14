import { stockApi } from '@/api/index';
export default {
    props: {
        visible: { type: Boolean, default: true },
        onlySelect: { type: Boolean, default: false },
        keywards: { type: String, default: '' },
        title:{type:String,default:"选择班级"}
    },
    data() {
        return {
            queryClass: {
                seachStr: '',
                classRoom:-1,
                classGrade:-1,
                classFinishstate:-1,
                scheduleState:-1,
                pageIndex: 1,                           // 页码
                pageSize: 10                            // 每页条数
            },
            checkedRadio: {},
            total: 0,
            checkedJson: [],
            list: [],
        };
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        name(){
            return this.title === '选择班级'?'班级':'场地'
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.queryClass.keywards = this.seachStr;
                    this.checkedJson = [];
                    this.getClassListPageList();
                }
            }
        },
    },
    methods: {
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handleSelectAll(data, checkedBool) {                // 课程全选 
            let that = this, json = [...this.checkedJson];
            if (checkedBool) {
                this.list.forEach(item => {
                    if (that.checkedJson.findIndex(e => e.id === item.id) === -1) json.push(item);
                });
            } else {
                json = json.filter(item => that.list.findIndex(e => e.id === item.id) === -1)
            }
            this.checkedJson = json;
        },
        handleSellect(row, data, checkedBool) {             // 课程单选
            if (checkedBool) {
                if (this.checkedJson.findIndex(e => e.id === row.id) === -1) {
                    this.checkedJson.push(row);
                }
            } else {
                this.checkedJson = this.checkedJson.filter(e => e.id !== row.id);
            }
        },
        handleCurrentChange(index) {                // 改变页码
            this.queryClass.pageIndex = index; 
            this.getClassListPageList();
        },
        handleSizeChange(pageSize) {                // 改变条数
            this.queryClass.pageIndex = 1; 
            this.queryClass.pageSize = pageSize; 
            this.getClassListPageList();
        },
        handleSubmit() {
            this.closeDialog();
            this.$emit('handleSubmit', this.onlySelect ? this.checkedRadio : this.checkedJson);
        },
        inputSearch() {
            this.queryClass.pageIndex = 1;
            this.getClassListPageList();
        },
        getClassListPageList() {                           // 获取课程列表
            let query = {...this.queryClass}
            stockApi.getClassListPageList(query).then(res => {
                if (res) {
                    const {total,list} = res
                    this.list = this.$app.isNull(list) ? [] : list.map(item => {
                        let rowChecked = this.checkedJson.findIndex(e => e.id === item.id) > -1 ? true : false;
                        return {
                            ...item,
                            id: item.sv_guid,
                            rowChecked
                        }
                    });
                    this.total = total;
                }
            })
        },
    }
};