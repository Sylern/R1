import { mapState } from "vuex";
export default {
    name: 'admissionList',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            queryAdmission: {
                keywards: '',
                pc_id: -1,
                pageIndex: 1,                                   // 页码
                pageSize: 20                                    // 每页条数
            },
            packageTotalPage: 0,
            admissionList: [],                                    // 套餐列表
            goodsWrapHeight: '',                                // 商品列表的高度
            iconList: [
                {
                    icon: 'icon-chongzhi',
                    name: '充值',
                    isShow: true,
                    isChecked: true,
                    type: 3,
                    fnName: 82,
                    permission: 'Recharge'
                },
            ],
        }
    },
    computed: {
        ...mapState(['memberInfo'])
    },
    mounted() {
        this.getGymCardSellingList();
    },
    methods: {
        calcGoodsWrapHeight() {                                     // 计算商品列表的高度
            this.$nextTick(() => {
                this.goodsWrapHeight = this.$refs.admissionListWrap.offsetHeight + 'px' ;
            })
        },
        addAdmissionCart(event, admissionItem) {
            this.$emit('handleToCart', { event, admissionItem});
        },
        packagePageLast() {
            if (this.queryAdmission.pageIndex === 1) return;
            this.queryAdmission.pageIndex--;
            this.getGymCardSellingList();
        },
        packagePageNext() {
            if (this.queryAdmission.pageIndex === this.courseTotalPage) return;
            this.queryAdmission.pageIndex++;
            this.getGymCardSellingList();
        },
        handleSearch(searchText) {
            this.firstSelected = 0;
            this.handleReGetPackage(searchText);
        },
        handleReGetPackage(searchText) {
            this.queryAdmission.pageIndex = 1;
            this.getGymCardSellingList(searchText);
        },
        handleItem(item) {
            // type: 0 1 2 3 4 ['当前页方法', '同一个router','pageNesting嵌套','执行方法','回到老系统']
            if (item.type === 0) {
                this[item.fnName]();
                return
            }
            if (item.type === 1) {
                this.$router.push({
                    path: item.fnName
                });
                return
            }
            if (item.type === 2) {
                this.update({
                    key: 'pageNestingUrl',
                    data: item.fnName + '?memberId=' + this.memberInfo.member_id
                });
                this.$router.push({
                    path: '/pageNesting',
                    query: {
                        menuPos: 4
                    }
                });
                return
            }
            if (item.type === 3) {
                if (item.fnName === 82) {
                    // 充值
                    this.$root.$emit('setUseType', 'allow_Recharge');
                    if (this.memberInfo.member_id) {
                        if (!this.memberInfo.allow_Recharge) return this.$message.warning('不支持跨店会员充值');
                    }
                }
                this.$root.$emit('keyCode', item.fnName);
                return
            }
        },
        //#region 数据请求
        getGymCardSellingList(searchText) {                        // 获取入场卡列表
            const query = {
                ...this.queryAdmission,
                keywards: this.$app.isNull(searchText) ? '' : searchText
            }
            cardManageApi.getGymCardSellingList(query).then(res => {
                if (res) {
                    this.admissionList = this.$app.isNull(res.list) ? [] : res.list;
                    this.packageTotalPage = res.total;
                    this.$nextTick(() => {
                        !!this.$refs.listWrap && this.$refs.listWrap.update();
                    });
                }
            });
        },
        //#endregion
    }
};