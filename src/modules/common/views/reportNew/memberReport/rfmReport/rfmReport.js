import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            queryEntity: {                          // 查询实体
                startdate: '',                          // 开始时间
                enddate: '',                            // 介绍时间
                start_num: 0,                           // 开始数量
                end_num: 0,                             // 结束数量
                start_price: 0,                         // 开始单价
                end_price: 0,                           // 结束单价
                page: 1,                                // 页面
                pagesize: 10,                           // 页数
            },
            numberPos: -1,
            numberList: [
                {
                    text: '3~5次',
                    start_num: 3,
                    end_num: 5
                },
                {
                    text: '6~10次',
                    start_num: 6,
                    end_num: 10
                },
                {
                    text: '11~20次',
                    start_num: 11,
                    end_num: 20
                }
            ],
            pricePos: -1,
            priceList: [
                {
                    text: '5~15元',
                    start_price: 5,
                    end_price: 15
                },
                {
                    text: '16~25元',
                    start_price: 16,
                    end_price: 25
                },
                {
                    text: '26~35元',
                    start_price: 26,
                    end_price: 35
                }
            ],
            inputData: {
                start_num: '',
                end_num: '',
                start_price: '',
                end_price: '',
            },
            total: 0,
            dataList: [],
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.queryEntity.startdate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.enddate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.PostRfmOrderList();
    },
    methods: {
        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.startdate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.enddate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.page = 1;
            this.PostRfmOrderList();
        },
        handleNumItem(pos) {
            if (pos !== 3) {
                this.inputData.start_num = '';
                this.inputData.end_num = '';
            }
            if (this.numberPos === pos && pos !== 3) {
                if (pos === 3) return
                this.numberPos = -1;
                this.queryEntity.start_num = 0;
                this.queryEntity.end_num = 0;
            } else {
                this.numberPos = pos;
                if (pos === 3) return
                this.queryEntity.start_num = this.numberList[this.numberPos].start_num;
                this.queryEntity.end_num = this.numberList[this.numberPos].end_num;
            }
            this.PostRfmOrderList();
        },
        handlePriceItem(pos) {
            if (pos !== 3) {
                this.inputData.start_price = '';
                this.inputData.end_price = '';
            }
            if (this.pricePos === pos && pos !== 3) {
                if (pos === 3) return
                this.pricePos = -1;
                this.queryEntity.start_price = 0;
                this.queryEntity.end_price = 0;
            } else {
                this.pricePos = pos;
                if (pos === 3) return
                this.queryEntity.start_price = this.priceList[this.pricePos].start_price;
                this.queryEntity.end_price = this.priceList[this.pricePos].end_price;
            }
            this.PostRfmOrderList();
        },
        handleInput({ target }) {
            target.value = this.$app.verifyNumber(target.value);
        },
        handleInputNumber(value, type) {
            if (type === 'start') {
                if (parseInt(value) > this.queryEntity.end_num && !this.$app.isNull(this.inputData.end_num)) {
                    this.inputData.start_num = this.queryEntity.end_num;
                }
                this.queryEntity.start_num = parseInt(this.inputData.start_num);
            } else {
                if (parseInt(value) < this.queryEntity.start_num) {
                    this.inputData.end_num = this.queryEntity.start_num;
                }
                this.queryEntity.end_num = parseInt(this.inputData.end_num);
            }
            this.$nextTick(() => {
                if (this.queryEntity.start_num > 0 && this.queryEntity.end_num > 0) {
                    this.PostRfmOrderList();
                }
            })
        },
        handleInputPrice(value, type) {
            if (type === 'start') {
                if (parseInt(value) > this.queryEntity.end_price && !this.$app.isNull(this.inputData.end_price)) {
                    this.inputData.start_price = this.queryEntity.end_price;
                }
                this.queryEntity.start_price = parseInt(this.inputData.start_price);
            } else {
                if (parseInt(value) < this.queryEntity.start_price) {
                    this.inputData.end_price = this.queryEntity.start_price;
                }
                this.queryEntity.end_price = parseInt(this.inputData.end_price);
            }
            this.$nextTick(() => {
                if (this.queryEntity.start_price > 0 && this.queryEntity.end_price > 0) {
                    this.PostRfmOrderList();
                }
            })
        },
        handleCurrentSize(index, type) {                   // 页码 - 页数
            if (type === 'current') this.queryEntity.page = index;
            if (type === 'size') this.queryEntity.page = 1, this.queryEntity.pagesize = index;
            this.PostRfmOrderList();
        },

        //#region   获取数据
        PostRfmOrderList() {                               // 获取列表数据
            stockApi.PostRfmOrderList(this.queryEntity).then(res => {
                let { total, list } = res;
                this.dataList = list;
                this.total = total;
            });
        },
        exportHandle() {                                  // 导出
            stockApi.PostRfmOrderList_Excel(this.queryEntity).then(res => {
                if (res) {
                    this.$app.downloadUrl(JSON.parse(res));
                } else {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
        },
        //#endregion
    }
}
