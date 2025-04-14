import { mapMutations } from 'vuex';
import { stockApi } from '@/api/index';
export default {
    components: {},
    data() {
        return {
            clientType: '',
            sessionId: '',
            erpNo: '',
            mrchNo: '',
            userInfo: {}
        }
    },
    computed: {

    },
    watch: {

    },
    mounted() {
        // http://localhost:8080/common#/authLogin?clientType=android&token=eyJhbGciOiJSUzI1NiIsImtpZCI6IkMxQzk3RDdGQTU3ODQwMDk2NDIyMDJBQjU1OUZBRTczIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2ODkzODQ1NTQsImV4cCI6MTY5MDAxODE1MywiaXNzIjoiaHR0cDovL2FwaS50ZXN0LmRlY2VycC5jYyIsIlVzZXJJZCI6IjQ1NTI4Mjk4IiwiVG9rZW5UeXBlIjoiQ29tbW9uVG9rZW5Nb2RlbCIsImlhdCI6IjE2ODkzODQ1NTQiLCJkZWNfc2FsZXNjbGVya19pZCI6IjAiLCJzdl9lbXBsb3llZV9uYW1lIjoiIiwib3BlcmF0aW5ncGxhdGZvcm0iOiIiLCJzeXN0ZW1uYW1lIjoiIiwic3ZfYXBwX3ZlcnNpb24iOiIiLCJvcmRlcl9vcGVyYXRvciI6IiIsImRlY19pc3NhbGVzY2xlcmsiOiJGYWxzZSIsInBvc2NvZGUiOiIiLCJzdl9zdG9yZV9zd2l0Y2hpbmciOiIiLCJvcGVyYXRvciI6IjQ1NTI4Mjk4IiwiY2xpZW50X2lkIjoid3BmX2NsaWVudCIsImF1ZCI6IndwZiIsInNjb3BlIjpbIndwZiJdfQ.Es-S03cAftfoLuRRwUUn7_aMCuIO8ZaxP6m_Sm7L9MfBWtdJ-QgboKEGC1UK16ucSMqJV1Da_ifw8CmPORvzFcWy5DlFw0OYH2duOFwtCPlHSaazuWILG7sU1k0jpoEciVTu6CWX8WhAvuDDTnd2TNuPmbf0ncT83pFNY9SwIkehXyVF1lckircMRXr6R0NinFOCtMQ9qhsLfx7ehA1cLT1lSkxhmquBpT0_AsEHIKj6l9zquI2TJPv7FpRPIX7EbzTE6D2dqNtsulv7Cmmmmn5wLNxuBCnd6_MHv2Aq2EnJEY8_hSKdoc2Ctu3Bm8ai9qxSpW2Rk5Ne4Nnk3YzN1Q
        this.clientType = this.$route.query.clientType;
        if (this.clientType === 'android') {
            let token = this.$route.query.token || '';
            if (this.$app.isNull(token)) {
                return
            }
            this.update({
                key: 'isOnAndroid',
                data: true
            })
            this.$app.setLocalStorage('token', token);
            this.getUserInfo();
            return
        }
        this.getUserInfoAndLogin();
    },
    methods: {
        ...mapMutations(['update', 'updateUserInfo', 'decodeJurisdiction']),
        getUserInfoAndLogin() {                          // 通过url token获取获取用户信息并登陆
            this.sessionId = this.$route.query.xxl_sso_sessionid;
            this.erpNo = this.$route.query.erpNo;
            this.mrchNo = this.$route.query.mrchNo;
            let localSessionId = this.$app.getLocalStorage('ccb_sessionId');
            let local_erpNo = this.$app.getLocalStorage('ccb_erpNo');
            let local_mrchNo = this.$app.getLocalStorage('ccb_mrchNo');
            if (this.$app.isNull(this.sessionId) || this.$app.isNull(this.erpNo) || this.$app.isNull(this.mrchNo)) return this.$message({ message: '获取授权失败，请退出后重试', type: 'error', duration: 0, showClose: true });
            if (this.sessionId !== localSessionId || this.erpNo !== local_erpNo || this.mrchNo !== local_mrchNo) {
                //url带过来的 sessionId  erpNo  mrchNo 和上次授权存储的有不同，清除相关登录数据
                this.$app.setLocalStorage('ccb_sessionId', this.sessionId);
                this.$app.setLocalStorage('ccb_erpNo', this.erpNo);
                this.$app.setLocalStorage('ccb_mrchNo', this.mrchNo);
                this.$app.deleteLocalStorage('token');
                this.$app.deleteLocalStorage('user_Info');
            }
            let token = this.$app.getLocalStorage('token');
            if (this.$app.isNull(token)) {
                stockApi.getTokenBySession({
                    xxl_sso_sessionid: this.sessionId,
                    erpNo: this.erpNo,
                    mrchNo: this.mrchNo
                }).then(res => {
                    if (res) {
                        this.$app.setLocalStorage('token', res);                            // 用户token
                        this.getUserInfo();
                    }
                }).catch(e => {
                    this.$message({ message: '获取登录信息失败，请退出后重试', type: 'error', duration: 0, showClose: true });
                });
            } else {
                this.getUserInfo();
            }
        },
        getUserInfo() {
            stockApi.getUserInfo().then(data => {
                if (data) {
                    this.$app.setLocalStorage('user_Info', JSON.stringify(data));           // 用户信息
                    // this.decodeJurisdiction();
                    // this.GetMenuList();
                    !!window.injectedObject && window.injectedObject.dismissLoading();
                    this.$router.push({ path: '/cashier/situation' });
                }
            })
        },
        GetMenuList() {                         // 获取菜单
            let menuJson = []
            if (!this.$app.isNull(this.$app.getLocalStorage('menuJson'))) {
                menuJson = this.$app.getLocalStorage('menuJson');
                this.update({
                    key: 'menuJson',
                    data: menuJson
                });
            }
            stockApi.GetMenuList({ sv_versionid: this.userInfo.versionId, sv_versionname: this.userInfo.sv_versionname }).then(data => {
                menuJson = this.$app.isNull(data) ? [] : data;
                this.$app.setLocalStorage('menuJson', menuJson);
                this.update({
                    key: 'menuJson',
                    data: menuJson
                });
                !!window.injectedObject && window.injectedObject.dismissLoading();
                this.$router.push({ path: '/cashier/situation' });
            })
        },
    }
}
