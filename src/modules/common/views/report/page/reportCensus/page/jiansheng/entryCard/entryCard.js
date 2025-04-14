import { stockApi } from '@/api'
export default {
    data() {
        return {
            queryEntity: {
                source: 100,
                user_id: "",
                keywards: "",
                sv_open_card_state: '',             //默认不传(全部)，true 已开卡，false 未开卡
                sv_card_type: '',                   //入场卡类型默认不传全部 0次卡2期卡
                sv_start_order_datetime: "",        //购买开始时间默认查询7天前
                sv_end_order_datetime: "",          //购买结束时间 默认当前时间
                sv_start_expiration_datetime: "",   //到期开始时间默认不传查询所有
                sv_end_expiration_datetime: "",     //到期结束时间默认不传所有
                sv_start_datetime: "",              //开卡开始时间默认查询所有
                sv_end_datetime: "",                //开卡结束时间默认查询所有
                pageIndex: 1,
                pageSize: 10,
            },
            cardTypes: [{ label: '全部', value: '' }, { label: '次卡', value: 0 }, { label: '期卡', value: 2 }],
            openCardStates: [{ label: "全部", value: "" }, { label: "已开卡", value: true }, { label: "未开卡", value: false }],
            dataList: [],
            total: 0,
            checkedJson: [],
            showGift: false,
            showEffective: false,
            showRegion: false,
            checkList: []
        }
    },
    mounted() {
        // this.initOrderDateTime()
        this.GetGymSellingCardsList()
    },
    methods: {
        //#region  方法
        GetGymSellingCardsList() {
            const query = {...this.queryEntity}
            if(!query.sv_start_order_datetime ){
                delete query.sv_start_order_datetime
                delete query.sv_end_order_datetime
            }

            stockApi.GetGymSellingCardsList(query).then(res => {
                const { total, list } = res || {}
                this.total = total
                this.dataList = list || [];
                this.dataList.forEach((item, index) => {
                    if (this.checkedJson.find(checked => checked.id === item.id)) {
                        this.$refs.multipleTable.toggleRowSelection(this.dataList[index])
                    }
                })
            })
        },
        // initOrderDateTime() {
        //     const now = new Date()
        //     this.queryEntity.sv_start_order_datetime = `${this.$app.currentTime(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")} 00:00:00`
        //     this.queryEntity.sv_end_order_datetime = `${this.$app.currentTime(now, "yyyy-MM-dd")} 23:59:59`
        // },
        //#endregion

        //#region  事件

        //#endregion
        handleChangeTime(e, type) {
            const start = this.$app.isNull(e) ? "" : `${this.$app.currentTime(e[0], "yyyy-MM-dd")} 00:00:00`
            const end = this.$app.isNull(e) ? "" : `${this.$app.currentTime(e[1], "yyyy-MM-dd")} 23:59:59`
            switch (type) {
                case 'order':
                    // if (start && end) {
                        this.queryEntity.sv_start_order_datetime = start
                        this.queryEntity.sv_end_order_datetime = end
                    // } else {
                    //     this.initOrderDateTime()
                    // }
                    break;
                case 'expiration':
                    this.queryEntity.sv_start_expiration_datetime = start
                    this.queryEntity.sv_end_expiration_datetime = end
                    break
                default:
                    this.queryEntity.sv_start_datetime = start
                    this.queryEntity.sv_end_datetime = end
            }
            this.queryEntity.pageIndex = 1
            this.GetGymSellingCardsList()

        },
        handleSelectionChange(val) {
            this.checkedJson = val;
        },
        showGiftHandle() {
            this.showGift = true
        },
        handleDownload() { 
            const query = { ...this.queryEntity }
            if(!query.sv_start_order_datetime ){
                delete query.sv_start_order_datetime
                delete query.sv_end_order_datetime
            }
            stockApi.GetGymSellingCardsListExport(query).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
                if (!res) {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
        },
        handleSearch() {
            this.GetGymSellingCardsList()
        },
        handleCurrentSize(index, type) {
            if (type === 'size') { this.queryEntity.pageSize = index }
            if (type === 'current') { this.queryEntity.pageIndex = index }
            this.GetGymSellingCardsList()

        },
        detailHandle(row) {
            console.log(row)
            this.$router.push("/entryCardDetail")
        }
    }
}