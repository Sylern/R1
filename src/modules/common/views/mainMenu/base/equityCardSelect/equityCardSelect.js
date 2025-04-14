import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
    name: 'discount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            queryEntity: {
                status: 1,                      // 1.有效；2.已过期
                member_id: 0,
                page: 1,
                pagesize: 999,
            },
            list: [],
            cardIndex: 0,
        }
    },
    computed: {
        ...mapState(['userInfo', 'memberInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        logo() {
            return this.$app.fmtImg(this.userInfo.sv_store_logo)
        },
        commonEquity() {
            const currentShow = this.list.length > 0 ? this.list[this.cardIndex] : {}
            return currentShow.interestsList ? (currentShow.interestsList || []).filter((item) => item.sv_midetail_type !== 1) : []         // 把卡礼包权益排除
        },
        gitEquity() {
            const currentShow = this.list.length > 0 ? this.list[this.cardIndex] : {}
            return currentShow.interestsList ? (currentShow.interestsList || []).filter((item) => item.sv_midetail_type === 1) : []
        },
        currentShow() {
            return this.list.length > 0 ? this.list[this.cardIndex] : {}
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.list = [];
                    this.queryEntity.member_id = this.memberInfo.member_id;
                    this.getInterestsListByMemberId();
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                default:
                    console.log('discount key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        changeCardPos(pos) {
            this.cardIndex = pos;
        },
        bgStyle(item) {
            if (item.sv_micard_bg == 0) {
                return { backgroundColor: item.sv_micard_bgvalue || 'white' }
            } else {
                return { backgroundImage: `url(${item.sv_micard_bgvalue})` }
            }
        },
        vaildDes(item) {
            const {
                sv_micard_vaildtype: vaildtype,                     // 权益卡类型 0直接发卡，1付费发卡，2充值发卡，3指定条件发卡
                sv_micard_vaildday: vaildday,                       // 领取之日起多少天有效
                sv_micard_vaildend: vaildend,                       // 有效期结束时间
                sv_mi_member_relation_status: status,               // 权益卡状态 0已发卡，1已领取，2已到期，3已回收，4已禁用
                sv_mi_member_relation_takedate: takedate,           // 领取时间
            } = item || {}

            if (+vaildtype === 0) { return '永久有效' }
            if (+vaildtype === 1) {
                return (+status !== 1 && +status !== 2 && +status !== 4) ? `领取之日起${vaildday}天内有效`
                    : `${this.$app.currentTime(new Date(new Date(takedate).getTime() + (vaildday || 0) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}`
            }
            return `${this.$app.currentTime(new Date(vaildend), 'yyyy-MM-dd')}`
        },
        getInterestsListByMemberId() {
            stockApi.GetInterestsListByMemberId(this.queryEntity).then(res => {
                const { list, total } = res
                this.hasRequest = true
                this.total = total
                this.list = (list || []).map(item => {
                    if (item.sv_micard_bg == 1) { item.sv_micard_bgvalue = item.sv_micard_bgvalue }
                    item.interestsList = item.interestsList.map(_item => {
                        if (!this.$app.isNull(_item.sv_midetail_giveconfig)) { _item.sv_midetail_giveconfig = JSON.parse(_item.sv_midetail_giveconfig) }
                        if (_item.sv_mi_image) {
                            _item.sv_mi_image = this.$app.fmtImg(_item.sv_mi_image)
                        } else {
                            _item.sv_mi_image = base.frontImgBase + '/images/default.png'
                        }
                        return _item
                    })
                    item.sv_micard_desc = item.sv_micard_desc.split('\n')
                    return item
                })
            })
        },
        handleItemClick(item) {
            this.currentId = item.sv_wallet_id;
        },
        handleEnter() {
            this.closeDialog();
            this.update({
                key: 'memberInfo',
                data: {
                    ...this.memberInfo,
                    sv_wallet_id: this.currentId
                }
            });
            this.$root.$emit('setStoreCard');
        }
    }
};