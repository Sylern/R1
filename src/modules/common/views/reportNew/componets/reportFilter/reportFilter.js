import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import utils from '@/utils/utils';

export default {
    name: 'reportFilter',
    props: {
        filterable: {
            type: Object,
            default: () => { }
        },
        customSelect: {
            type: Object,
            default: {
                key: '',
                list: []
            }
        },
    },
    data() {
        return {
            query: {
                keywards: '',
                startDate: '',
                endDate: '',
                user_id: ''
            },
            storelist: [],
        }
    },
    computed: {
        ...mapState(['userInfo']),
        ...mapState('permission', ['CashierManage']),
    },
    watch: {

    },
    mounted() {
        // if (this.filterable.datetime) {
        //     this.query.startDate = this.filterable.datetime.start;
        //     this.query.endDate = this.filterable.datetime.end;
        // }
        if (this.customSelect.key) {
            this.query[this.customSelect.key] = ''
        }
        // this.query.category = this.categoryId;
        // this.query.erjicategory = this.erjicategory;
    },
    methods: {
        handleChangeTime(date) {
            this.query.startDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.endDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            if (!this.filterable.btnCustom) {
                this.$emit('update', { type: 'datetime', value: [this.query.startDate, this.query.endDate] })
            }
        },
        handleSearch() {
            this.$emit('search', this.query);
        },
        handleReset() {
            this.$emit('reset')
        },
        // #region 数据请求
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                // this.storeList.unshift({ label: '全部', value: '' });
                this.queryEntity.ShopIds = this.userInfo.user_id ? (this.userInfo.user_id + '') : '';
                this.CommissionByMonth();
            });
        },
        // #endregion
    }
};