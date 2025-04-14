import { mapMutations, mapState } from 'vuex';
import memberRecharge from '../memberRecharge/memberRecharge.vue';
export default {
    name: 'moreFuncEntry',
    components: { memberRecharge },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        const showKouci = this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_pleasure_ground' || this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_cosmetology';
        return {
            checkIconList: [],
            iconList: [
                {
                    icon: 'icon-tuihuo',
                    name: '退货',
                    isShow: false,
                    isChecked: false,
                    type: 3,
                    fnName: '',
                    permission: ''
                },
                {
                    icon: 'icon-huanhuo',
                    name: '换货',
                    isShow: false,
                    isChecked: false,
                    type: 3,
                    fnName: '',
                    permission: ''
                },
                {
                    icon: 'icon-hexiao',
                    name: '核销',
                    isShow: false,
                    isChecked: false,
                    type: 3,
                    fnName: '',
                    permission: 'Reverse'
                },
                {
                    icon: 'icon-chongzhi',
                    name: '充值',
                    isShow: true,
                    isChecked: false,
                    type: 0,
                    fnName: 'showMemberRecharge',
                    permission: 'Recharge'
                },
                {
                    icon: 'icon-shoukuan',
                    name: '无码收银',
                    isShow: true,
                    isChecked: false,
                    type: 3,
                    fnName: 75,                             // K键值
                    permission: 'Quick'
                },
                {
                    icon: 'icon-goucika',
                    name: '售卡',
                    isShow: true,
                    isChecked: showKouci ? true : false,
                    type: 1,
                    fnName: '/cashier/cardRecharge',
                    permission: 'BuyCard'
                },
                {
                    icon: 'icon-kehujicun',
                    name: '寄存/领取',
                    isShow: true,
                    isChecked: false,
                    type: 1,
                    fnName: '/cashier/deposit',
                    permission: 'key_deposit_id'
                },
                {
                    icon: 'icon-kuaijiejian',
                    name: '快捷键',
                    isShow: true,
                    isChecked: false,
                    noCheckIcon: true,
                    type: 3,
                    fnName: 122,                            // F11
                    permission: ''
                },
                {
                    icon: 'icon-daohang',
                    name: '自定义菜单',
                    isShow: false,
                    isChecked: false,
                    noCheckIcon: true,
                    type: 1,
                    fnName: 'moreFunc',
                    permission: ''
                }
            ],
            memberListStatus: false,                        // 会员列表
            memberRechargeStatus: false,                    // 会员充值弹窗
        }
    },
    computed: {
        ...mapState(['userInfo', 'memberInfo', 'user_local_data']),
        ...mapState('permission', ['CashierManage']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.syncIconStatus();
                    // this.checkIconList = this.user_local_data.iconCheckList;
                    this.$nextTick(() => {
                        this.$refs.moreFuncEntry.focus();
                    })
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData']),
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'moreFuncEntry');
            this.$root.$emit('restaurant', 'moreFuncEntry');
        },
        syncIconStatus() {                                     // 同步图标勾选状态
            this.checkIconList = this.iconList.map(e => {
                let item = this.user_local_data.iconCheckList.find(m => m.keyName === e.name);
                let isChecked = this.$app.isNull(item) ? false : item.isChecked;
                e.isChecked = isChecked;
                return {
                    keyName: e.name,
                    isChecked
                }
            })
        },
        showMemberRecharge() {
            this.$root.$emit('setUseType', 'allow_Recharge');
            if (this.memberInfo.member_id) {
                if (!this.memberInfo.allow_Recharge) return this.$message.warning('不支持跨店会员充值');
            }
            this.memberRechargeStatus = true;
        },
        handleCheckIcon(item) {
            let iconIndex = this.checkIconList.findIndex(e => e.keyName === item.name);
            if (iconIndex < 0) return;
            this.checkIconList[iconIndex].isChecked = item.isChecked;
            // if (item.isChecked) {
            //     // 最多存3个
            //     if (this.checkIconList.length === 3) this.checkIconList.splice(0, 1);
            //     this.checkIconList.push({
            //         keyName: item.name,
            //         isChecked: true
            //     });
            // } else {
            //     this.checkIconList = this.checkIconList.filter(e => e.keyName !== item.name);
            // }
            this.updateUserLocalData({
                ...this.user_local_data,
                iconCheckList: this.checkIconList
            })
        },
        handleItem(item) {                                    // 图标点击事件     
            // type: 0 1 2 3 4 ['当前页方法', '同一个router','pageNesting嵌套','执行方法','回到老系统']
            if (item.type === 0) {
                this[item.fnName]();
                return
            }
            if (item.type === 1) {
                this.closeDialog();
                this.$router.push({
                    path: item.fnName
                });
                return
            }
            if (item.type === 2) {
                this.closeDialog();
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
                this.closeDialog();
                this.$root.$emit('keyCode', item.fnName);
                return
            }
        }
    }
};