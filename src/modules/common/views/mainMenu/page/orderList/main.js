import { mapState } from 'vuex';
import orderList from './common/orderList.vue';
import cosmetology from './cosmetology/cosmetology.vue';
import rechargeRecord from './rechargeRecord/rechargeRecord.vue';
import cardsSaleRecord from './cardsSaleRecord/cardsSaleRecord.vue';
import cardReport from './cardReport/cardReport.vue';
import reservationRecord from './reservationRecord/reservationRecord.vue';
import preMoneyReport from './preMoneyReport/preMoneyReport.vue';
export default {
    components: { orderList, cosmetology, rechargeRecord, cardsSaleRecord, cardReport, reservationRecord, preMoneyReport },
    name: 'main',
    data() {
		const reservationType = [1, 6]
		const hasReservation = reservationType.includes(this.$store.state.userInfo.sv_us_industrytype)
        return {
            menuPos: 0,
            menuList: [
                {
                    name: '销售流水',
                    isHide: false,
                    isEnable: true
                },
                {
                    name: '充值明细',
                    isHide: false,
                    isEnable: true
                },
                {
                    name: '售卡明细',
                    isHide: !this.$app.getCheckMenu('cardSalesSchedule'),
                    isEnable: true
                },
                {
                    name: '次卡消费',
                    isHide: !this.$app.getCheckMenu('consumption'),
                    isEnable: true
                },
                {
                    name: '房台预约',
                    isHide: !hasReservation,
                    isEnable: true
                },
                {
                    name: '预付金',
                    isHide: !hasReservation,
                    isEnable: true
                }
            ],
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isMeiye() {
            return this.userInfo.sv_us_industrytype === 1
        },
    },
    watch: {

    },
    beforeMount() {
        this.initMenu();
    },
    mounted() {

    },
    methods: {
        initMenu() {
            // 初始化菜单，不同行业存在不同菜单
            this.menuPos = this.$route.query ? (parseInt(this.$route.query.menuPos) || 0) : 0
        },
        handleMenuItem(item, index) {
            if (this.menuPos === index) return
            this.menuPos = index;
            this.$router.replace({ query: { menuPos: this.menuPos } })
        },
    }
};