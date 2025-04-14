
import { stockApi } from '@/api/index';
export default {
    props: {
        visible: { type: Boolean, default: true },
        onlySelect: { type: Boolean, default: false },
        keywards: { type: String, default: '' }
    },
    data() {
        return {
            queryEntity: {
                regionId:-1,
                seachStr: '',
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
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    // this.queryEntity.keywards = this.seachStr;
                    this.checkedJson = [];
                    this.getClassRoomPageList();
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
            this.queryEntity.pageIndex = index; 
            this.getClassRoomPageList();
        },
        handleSizeChange(pageSize) {                // 改变条数
            this.queryEntity.pageIndex = 1; 
            this.queryEntity.pageSize = pageSize; 
            this.getClassRoomPageList();
        },
        handleSubmit() {
            this.closeDialog();
            this.$emit('handleSubmit', this.onlySelect ? this.checkedRadio : this.checkedJson);
        },
        inputSearch() {
            this.queryEntity.pageIndex = 1;
            this.getClassRoomPageList();
        },
        getClassRoomPageList() {                           // 获取课程列表
            let query = {...this.queryEntity}
            stockApi.getClassRoomPageList(query).then(res => {
                if (res) {
                    const {total,list} = res
                    this.list = this.$app.isNull(list) ? [] : list.map(item => {
                        let rowChecked = this.checkedJson.findIndex(e => e.id === item.id) > -1 ? true : false;
                        return {
                            ...item,
                            id: +item.sv_table_id,
                            rowChecked
                        }
                    });
                    this.total = total;
                }
            })
        },
    }
};