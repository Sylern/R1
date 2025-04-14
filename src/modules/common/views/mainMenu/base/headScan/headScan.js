import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapActions, mapState } from 'vuex';
export default {
    name: 'headScan',
    props: {
        isOnWatchScan: {
            type: Boolean,
            default: false
        },
        handleMemberInfo: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            headScanStatus: false,                              // 人脸识别弹窗
            headScanMemberInfo: {
                sv_mr_name: '',
                sv_ml_name: '',
                sv_mr_mobile: '',
                sv_mr_birthday: '',
                sv_mw_availableamount: '',
                sv_mw_availablepoint: '',
            },
        }
    },
    computed: {
        ...mapState(['memberInfo', 'userInfo', 'memberSetting']),
        ...mapState('permission', ['CashierManage']),
    },
    mounted() {
        this.$root.$on('handleHeadScan', dataObj => {
            let memberId = dataObj.memberId;
            if (this.isOnWatchScan) {
                stockApi.getMemberInfo({ m_id: memberId }).then(res => {
                // stockApi.getMemberInfo({ Id: memberId, is_pc: true }).then(res => {
                    if (res) {
                        this.headScanMemberInfo = {
                            ...res,
                            member_id: memberId
                        }
                        this.headScanStatus = true;
                        this.$emit('handleShow')
                    }
                });
            }
        })
    },
    onUnmounted() {
        this.$root.$off('handleHeadScan');
    },
    methods: {
        ...mapActions(['requsetMemberInfo']),
        closeDialog() {                                             // 关闭弹窗
            this.headScanStatus = false;
            this.$emit('handleCancel')
        },
        handleHeadScanCanel() {
            this.headScanMemberInfo = {
                sv_mr_name: '',
                sv_ml_name: '',
                sv_mr_mobile: '',
                sv_mr_birthday: '',
                sv_mw_availableamount: '',
                sv_mw_availablepoint: '',
            };
            this.closeDialog();
        },
        handleHeadScanSure() {
            this.closeDialog();
            if (this.handleMemberInfo) {
                this.requsetMemberInfo(this.headScanMemberInfo.member_id);
            }
            this.$emit('handleHeadScan', this.headScanMemberInfo)
        },
    }
};