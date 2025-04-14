import base from "@/api/base.js";
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'reservationList',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    sv_table_id: 0
                }
            }
        },
    },
    data() {
        const bookSelect = {}
        for (let index = 0; index < 24; index++) {
            bookSelect[index] = { isSet: false }
        }
        return {
            notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
            bookSelect,
            bookingList: [],                                    // 房台列表数据
            queryBooking: {                                     // 查询条件
                sv_source_type: -1,
                sv_table_id: 0,
                state: 4,                                       // 状态：-1全部，1.已预订；2.已开单；3.已取消；4.未取消预订单（已预订+已开单）
                pageIndex: 1,
                pageSize: 999
            },
            checkedItem: {},
            selectDate: '',
            currentDate: '',
            tommorowDate: '',
            activeIndex: 1,                                 // 日期当前索引
            weekList: []
        }
    },
    computed: {
        ...mapState(['memberInfo', 'queryUpdateCartting']),
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
                    this.queryBooking = {                            // 查询条件
                        sv_source_type: -1,
                        sv_table_id: 0,
                        state: 4,
                        pageIndex: 1,
                        pageSize: 999
                    };
                    this.queryBooking.sv_table_id = this.tableInfo.sv_table_id;
                    this.activeIndex = 1;
                    this.selectDate = this.currentDate = this.todayDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd');
                    this.tommorowDate = this.$app.currentTime(new Date(new Date().getTime() + 24 * 3600 * 1000), 'yyyy-MM-dd');
                    this.weekList = this.$app.getDateAndWeekList(new Date().getTime() - 24 * 3600 * 1000);
                    this.checkedItem = {};
                    this.bookingList = [];
                    this.getTableBookingList();
                    this.$nextTick(() => {
                        !!this.$refs.reservationList && this.$refs.reservationList.focus();
                    })
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update', 'clearMember']),
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handleImgUrl(val) {                                         // 拼接url
            let url = this.$app.isNull(val) ? (base.frontImgBase + '/images/cashier/default_user_logo.png') : val
            return this.$app.fmtImg(url)
        },
        handleSelectDateChange(e) {
            const newDate = this.$app.currentTime(e, 'yyyy-MM-dd');
            if (newDate !== this.currentDate) {
                this.activeIndex = 1;
                this.weekList = this.$app.getDateAndWeekList(e.getTime() - 24 * 3600 * 1000);
                this.currentDate = this.weekList[this.activeIndex].dateText;
                this.getTableBookingList();
            }
        },
        handleChangeDate(index) {
            if (this.activeIndex === index) return
            this.activeIndex = index;
			this.checkedItem = {};
            this.currentDate = this.weekList[this.activeIndex].dateText;
            this.getTableBookingList();
        },
        handleItem(item) {
            this.checkedItem = item
        },
        handleAddReservation() {
            this.closeDialog();
            this.clearMember();
            this.$emit('submit', { type: 'reservation', date: this.currentDate })
        },
        handleOpenTable() {
            if (this.$app.isNull(this.checkedItem.id)) return
            if (this.checkedItem.payment_state === 1) {
                if (this.checkedItem.sv_order_state === 4) {
                    return this.$message.warning('已超过预抵结束时间，不能开台！')
                }
                // 开房台
                const postData = {
                    sv_source_type: 100,
                    usingId: this.checkedItem.id,
                    sv_table_id: this.tableInfo.sv_table_id,
                    sv_type: 2
                }
                stockApi.operateCateringTableUsing(postData).then(res => {
                    if (res) {
                        this.$message.success('开台成功');
                        this.closeDialog();
                        this.$emit('submit', { type: 'info' })
                    }
                });
                return
            }
            if (this.checkedItem.payment_state === 0) {
                // 未支付，跳转预约下单
                this.closeDialog();
                this.clearMember();
                const dataInfo = {
                    type: 'reservation',
                    isEdit: true,
                    id: this.checkedItem.id
                }
                this.$emit('submit', dataInfo)
                return
            }
        },
        timeSelect() {
            this.bookSelect = [];
            this.bookingList.forEach(item => {
                const startHours = new Date(item.sv_arrival_date).getHours();
                const startMinutes = new Date(item.sv_arrival_date).getMinutes();
                const endHours = new Date(item.sv_arrival_end_date).getHours();
                const endMinutes = new Date(item.sv_arrival_end_date).getMinutes();
                const effectHours = endHours > startHours ? endHours - startHours : 0;
                for (let index = 0; index <= effectHours; index++) {
                    if (index === 0) {
                        this.bookSelect[startHours + index] = {
                            isSet: true,
                            left: parseFloat(startMinutes / 60) * 14 + 'px',
                            width: (index === effectHours && endHours > startHours ? parseFloat((endMinutes - startMinutes) / 60) : 1) * 14 + 'px'
                        }
                    } else {
                        if (endMinutes === 0 && index === effectHours) {

                        } else {
                            this.bookSelect[startHours + index] = {
                                isSet: true,
                                left: 0,
                                width: (index === effectHours ? parseFloat(endMinutes / 60) : 1) * 14 + 'px'
                            }
                        }
                    }
                }
            });
        },
        getTableBookingList() {
            this.checkedItem = {};
            const postData = {
                ...this.queryBooking,
                sv_arrival_start_date: this.currentDate + ' 00:00:00',
                // sv_arrival_end_date: this.currentDate + ' 23:59:59',
            }
            return stockApi.getTableBookingList(postData).then(res => {
                if (res) {
                    this.bookingList = res.list;
                    this.timeSelect();
                    this.$nextTick(() => {
                        if (!!this.$refs.listWrap) {
                            this.$refs.listWrap.wrap.scrollLeft = this.$refs.listWrap.wrap.offsetWidth;
                            this.$refs.listWrap.update();
                        }
                    })
                }
            });
        },
    }
};