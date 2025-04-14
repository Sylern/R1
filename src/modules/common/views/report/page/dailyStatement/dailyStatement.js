
export default {
    data() {
        return {
            queryData: {
                startTime: '',
                EndTime: '',
                startEndTime: '',
            }
        }
    },
    methods: {
        handleChangeTime(e) {                   // 时间选择器回调函数
            this.queryData.startTime = e[0];
            this.queryData.EndTime = e[1];
            this.getIntelligentSalesList();
        },
    }
}