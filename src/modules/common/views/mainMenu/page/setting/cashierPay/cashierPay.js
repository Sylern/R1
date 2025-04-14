import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { ImportImg } from '@/components/index';
import { mapState } from 'vuex';
export default {
    components: { ImportImg },
    data() {
        return {
            newVisible: false,                              // 打开新增/编辑窗口
            configList: ['CashPaymentMethod'],
            sv_detail_value: {
                p_cashpay: 'true',
                p_cardpay: 'true',
                p_scanpay: 'true',
                p_alipay: 'true',
                p_weChatpay: 'true',
                p_bank: 'true',
                p_coupon: 'true',
                p_meituan: 'true',
                p_koubei: 'false',
                p_meituan55: 'true',
                p_shezhang: 'false',
                c_custorm_payment: []
            },
            dataObj: {},
            dataList: [],
            isEdit: false,
            selectedIndex: null,
            iconSelectedPos: 0,
            customIconList: [
                {
                    key: 'custom1',
                    name: '',
                    isShow: false,
                    icon: base.frontImgBase + '/images/cashier/payImg/custom1.png',
                },
                // {
                //     key: 'custom2',
                //     name: '',
                //     isShow: false,
                //     icon: base.frontImgBase + '/images/cashier/payImg/custom2.png',
                // },
                // {
                //     key: 'custom3',
                //     name: '',
                //     isShow: false,
                //     icon: base.frontImgBase + '/images/cashier/payImg/custom3.png',
                // },
                // {
                //     key: 'custom4',
                //     name: '',
                //     isShow: false,
                //     icon: base.frontImgBase + '/images/cashier/payImg/custom4.png',
                // },
                {
                    key: 'custom5',
                    name: '',
                    isShow: false,
                    icon: base.frontImgBase + '/images/cashier/payImg/custom5.png',
                },
                {
                    key: 'custom6',
                    name: '',
                    isShow: false,
                    icon: base.frontImgBase + '/images/cashier/payImg/custom6.png',
                },
                {
                    key: 'custom7',
                    name: '',
                    isShow: false,
                    icon: base.frontImgBase + '/images/cashier/payImg/custom7.png',
                }
            ],
            customDataList: [],
            dialogInfo: {
                payName: ''
            },
            dialogRules: {
                payName: [                                  // 支付方式名称
                    { required: true, message: '请输入支付方式名称', trigger: 'blur' },
                ]
            },
            p_scanpayCondition: true,                       // 是否可以打开扫码支付
            ImportImgJson: [],                              // 上传图片组件参数
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    watch: {
    },
    mounted() {
        this.getPayment();                                      // 获取支付设置
        this.p_scanpayCondition = this.userInfo.dec_payment_method !== null && this.userInfo.dec_payment_config.ConvergePay
    },

    methods: {
        handleSave() {

        },
        callbackImportImg() {

        },
        handleAdd() {                                           // 新增支付方式
            this.newVisible = true;
            this.isEdit = false;
            this.dialogInfo.payName = '';
            this.iconSelectedPos = 0;
        },
        handleEdit(item) {                                      // 编辑支付方式
            this.newVisible = true;
            this.isEdit = true;
            this.selectedIndex = item.index;
            this.dialogInfo.payName = item.name;
            this.iconSelectedPos = this.customIconList.findIndex(e => e.key === item.icon);
        },
        handleDelete(item) {                                    // 删除支付方式
            this.$confirm('确认要删除“' + item.name + '”吗？').then(_ => {
                let configData = {
                    sv_user_config_id: this.dataObj.sv_user_config_id,
                    sv_user_module_id: this.dataObj.sv_user_module_id,
                    detail_id: this.dataObj.sv_user_configdetail_id,
                    detailItem_id: item.id,
                    sort: item.sort,
                    type: 2
                }
                stockApi.updatePayment(configData).then(res => {
                    if (res) {
                        this.$message.success('修改成功');
                        this.getPayment();
                    }
                })
            }).catch(_ => {

            });
        },
        //#region   获取数据
        getPayment() {                                          // 获取支付设置
            stockApi.getPayment().then(res => {
                if (res) {
                    this.dataList = [];
                    this.dataObj = {
                        sv_user_id: res.sv_user_id,
                        sv_user_module_id: res.sv_user_module_id,
                        sv_user_config_id: res.sv_user_config_id,
                        sv_user_configdetail_id: res.sv_user_configdetail_id,
                        sv_user_configdetail_name: res.sv_user_configdetail_name,
                        sv_detail_value: res.sv_detail_value,
                        sv_remark: res.sv_remark
                    }
                    this.dataList = this.$app.isNull(res.detailItem) ? [] : res.detailItem.map((e, i) => {
                        return {
                            ...e,
                            cargoflow_enable: e.name === '储值卡' ? false : e.cargoflow_enable,
                            index: i,
                            showIcon: base.frontImgBase + '/images/cashier/payImg/' + e.icon + '.png',
                            recharge_enable: e.name === '赊账' || e.name === '欠款' ? false : e.recharge_enable,
                            recharge_unCheck: e.name === '赊账' || e.name === '欠款' ? true : false,
                            cargoflow_unCheck: e.name === '储值卡' ? true : false,
                        }
                    });
                }
            });
        },
        handleSwitch(item, type) {                              // 开关操作
            if (item.name === '扫码支付' && !this.p_scanpayCondition) {
                // 扫码支付-打开
                let showMessage = false;
                if (type === 1 && item.settlement_enable) {
                    item.settlement_enable = false;
                    showMessage = true;
                }
                if (type === 3 && item.recharge_enable) {
                    item.recharge_enable = false;
                    showMessage = true;
                }
                if (showMessage) return this.$message.warning('您尚未开通支付功能，请联系销售')
            }

            // this.dataObj = {
            //     sv_user_id: res.sv_user_id,
            //     sv_user_module_id: res.sv_user_module_id,
            //     sv_user_config_id: res.sv_user_config_id,
            //     sv_user_configdetail_id: res.sv_user_configdetail_id,
            //     sv_user_configdetail_name: res.sv_user_configdetail_name,
            //     sv_detail_value: res.sv_detail_value,
            //     sv_remark: res.sv_remark
            // }
            const enableType = {
                1: 'settlement_enable',                 // 结算开关
                3: 'recharge_enable',                   // 充值开关
                4: 'is_changezero',                     // 找零开关
                5: 'is_fast',                           // 快捷支付
                6: 'cargoflow_enable',                  // 货流要货
                7: 'is_scancode',                       // 快捷扫码
            }

            let configData = {
                sv_user_config_id: this.dataObj.sv_user_config_id,
                sv_user_module_id: this.dataObj.sv_user_module_id,
                detail_id: this.dataObj.sv_user_configdetail_id,
                detailItem_id: item.id,
                type: type,
                enable: item[enableType[type]]
            }
            stockApi.updatePayment(configData).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                    if (type === 5) {
                        this.getPayment();
                    }
                }
            })
        },
        setPaymentSort(item, ctr) {                             // 设置排序
            let typeList = {
                down: -1,
                up: 1,
                top: 2
            }
            let configData = {
                sv_user_config_id: this.dataObj.sv_user_config_id,
                sv_user_module_id: this.dataObj.sv_user_module_id,
                detail_id: this.dataObj.sv_user_configdetail_id,
                detailItem_id: item.id,
                type: typeList[ctr],
                sort: item.sort
            }
            stockApi.setPaymentSort(configData).then(res => {
                if (res) {
                    this.$message.success('排序成功');
                    this.getPayment();
                }
            })
        },
        handleDialogSure() {                                    // 保存数据
            if (this.dialogInfo.payName.indexOf('微信') > -1) {
                return this.$message.warning('您的新增支付方式名称系统已包含保留："微信"，请更换')
            }
            if (this.dialogInfo.payName.indexOf('支付宝') > -1) {
                return this.$message.warning('您的新增支付方式名称系统已包含保留："支付宝"，请更换')
            }
            if (this.dialogInfo.payName.indexOf('云闪付') > -1) {
                return this.$message.warning('您的新增支付方式名称系统已包含保留："云闪付"，请更换')
            }
            if (this.dialogInfo.payName.indexOf('待收') > -1) {
                return this.$message.warning('您的新增支付方式名称系统已包含保留："待收"，请更换')
            }

            let detailItem = {};
            if (this.isEdit) {
                detailItem = {
                    id: this.dataList[this.selectedIndex].id,
                    name: this.dialogInfo.payName,
                    icon: this.customIconList[this.iconSelectedPos].key
                }
            } else {
                detailItem = {
                    id: 0,
                    name: this.dialogInfo.payName,
                    icon: this.customIconList[this.iconSelectedPos].key
                }
            }
            let configData = [{
                ...this.dataObj,
                detailItem: detailItem
            }]
            stockApi.savePayment('CashPaymentMethod', configData).then(res => {
                if (res) {
                    this.$message.success(this.isEdit ? '修改成功' : '新增成功');
                    this.newVisible = false;
                    this.getPayment();
                }
            })
        },
        //#endregion
    }
}