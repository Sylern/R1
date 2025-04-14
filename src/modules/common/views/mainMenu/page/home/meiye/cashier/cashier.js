import { stockApi } from "@/api/index.js";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import cashierRight from '@/modules/common/views/common/components/meiye/cashierRight/cashierRight.vue';
import numberChange from '@/modules/common/views/common/base/numberChange/numberChange.vue';
import servicerSettingSingle from '@/modules/common/views/common/base/servicerSettingSingle/servicerSettingSingle.vue';
import carttingMeiye from '@/modules/common/views/common/base/carttingMeiye/carttingMeiye.vue';
import memberAdd from '@/modules/common/views/common/base/memberAdd/memberAdd.vue';
import memberRecharge from '@/modules/common/views/common/base/memberRecharge/memberRecharge.vue';
import cateringReturn from '@/modules/common/views/common/base/cateringReturn/cateringReturn.vue';
export default {
    components: { numberChange, servicerSettingSingle, carttingMeiye, cashierRight, memberAdd, memberRecharge, cateringReturn },
    name: 'm-cashier',
    data() {
        return {
            isSubmitting: false,                                // 是否挂单中
            startServicerStatus: false,                         // 展示修改开单人
            isOrderBack: false,                                 // 是否反结账
            tableInfo: {
                sv_order_list_id: null,                         // 反结账使用
                sv_without_list_id: null,
                sv_table_using_state: null,
                sv_employee_id: -1,
                sv_employee_name: '',
                sv_catering_grade: null,
                preOrderMoney: 0,
                sv_remark: '',
                sv_sex: 0,                                      // 0男客 1女客
                wt_datetime: this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            },

            searchText: '',                                     // 搜索关键字输入框绑定
            searchKeywords: '',                                 // 搜索关键字传组件
            numberChangeStatus: false,                          // 修改就餐人数
            memberAddImport: null,
            memberAddStatus: false,                             // 新增会员弹窗
            memberRechargeStatus: false,                        // 会员充值弹窗

            categoryFirstStatus: false,                         // 新增一级分类弹窗
            categorySecondStatus: false,                        // 新增二级分类弹窗
            topBtnType: [                                       // 顶部按钮
                {
                    icon: 'icon-shoukuan',
                    name: '项目',
                    type: '1'
                },
                {
                    icon: 'icon-shoukuan',
                    name: '卖品',
                    type: '0,2'
                },
                {
                    icon: 'icon-goucika',
                    name: '售卡',
                    type: 'fn',
                    url: '/cashier/cardRecharge'
                },
                {
                    icon: 'icon-yuyue',
                    name: '预约',
                    type: 'fn',
                    url: '/reservation/kanban'
                },
            ],
            producttype_id: '1',                                // 获取分类类型 1 服务商品
            firstSelected: 0,                                   // 一级菜单选中
            firstSelectedItem: {                                // 一级菜单选中item
                id: -1,
                label: ''
            },
            secondSelected: 0,                                  // 二级菜单选中
            secondSelectedItem: {                               // 二级菜单选中item
                id: -1,
                label: ''
            },
            goodsWrapHeight: '',                                // 商品列表的高度
            firstCategory: [],
            secondCategory: [],

            tipsNum: 0,                                         // 消息提示数量
            showPopStoreCard: false,
            updateRemarkVisible: false,
            updateRemark: ''
        }
    },
    computed: {
        ...mapGetters(['hasStoreCard']),
        ...mapState(['isCefClient', 'userInfo', 'carttingData', 'cashierJurisdiction', 'printTemplate', 'memberInfo', 'couponCountNumber', 'selectedInfo', 'selectedEmployee', 'user_local_data', 'carttingSearchCursor', 'customerDisplayData']),
        ...mapState('permission', ['CashierManage']),
        memberSelected() {
            return this.memberInfo.member_id !== ''
        },
        imgBase() {
            return stockApi.imgBase()
        },
        isCarrtingNull() {
            return this.$app.isNull(this.carttingData.productResults)
        },
        isOnlight() {
            return this.$route.path === '/cashier/lightCashier'
        },
    },
    watch: {
        carttingSearchCursor: {                                         // 监听购物车商品加入结束
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
                    })
                }
            }
        },
    },
    beforeMount() {
        this.isOrderBack = this.$route.query.isOrderBack || false;
        if (this.isOnlight) {
            this.update({
                key: 'selectedEmployee',
                data: {}
            });
            this.getUiGroupingEmployeeList();
        }
    },
    mounted() {
        if (this.customerDisplayData.enable) {
            this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
        }
        if (this.$app.isNull(this.tableInfo.sv_order_list_id)) this.tableInfo.sv_order_list_id = this.selectedInfo.sv_order_list_id;
        if (this.$app.isNull(this.tableInfo.sv_without_list_id)) this.tableInfo.sv_without_list_id = this.selectedInfo.sv_without_list_id;
        if (this.$app.isNull(this.tableInfo.sv_catering_grade)) this.tableInfo.sv_catering_grade = this.selectedInfo.sv_catering_grade;

        this.tableInfo.sv_employee_id = this.selectedEmployee.sv_employee_id;
        this.tableInfo.sv_employee_name = this.selectedEmployee.sv_employee_name;
        this.tableInfo.sv_remark = this.$app.isNull(this.selectedEmployee.sv_remark) ? '' : this.selectedEmployee.sv_remark;
        if (this.selectedEmployee.wt_datetime) this.tableInfo.wt_datetime = this.$app.currentTime(new Date(this.selectedEmployee.wt_datetime), 'yyyy-MM-dd HH:mm:ss');
        if (!this.$app.isNull(this.selectedEmployee.sv_sex)) this.tableInfo.sv_sex = this.selectedEmployee.sv_sex;


        !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
        this.$root.$on('handleInputFocus', () => {
            this.$nextTick(() => {
                !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
            })
        })
        this.$root.$on('showMemberAdd', (dataObj) => {
            this.memberAddImport = dataObj;
            this.showMemberAdd(dataObj);
        });
        this.getCateringRegionPageList()                            // 获取消息提示数
        this.getFirstCategory();
        this.$root.$on('meiyeCashier', (code) => {
            // console.log('restaurant code:' + code + 'is click');
            this.$nextTick(() => {
                this.$refs.meiyeCashier && this.$refs.meiyeCashier.focus();
            })
        });
        this.$root.$on('updateMeiyeHome', this.handleBack);
    },
    beforeDestroy() {
        this.clearCartting();
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'clearSelectedInfo', 'syncCarttingData', 'setCateringReturn', 'touchCarttingCursor']),
        ...mapActions(['getUiGroupingEmployeeList', 'meiyeTakeOrder']),
        currentCardInfo() {
            return this.memberInfo.wallets_list.find(e => e.sv_wallet_id === this.memberInfo.sv_wallet_id) || {}
        },
        handleRemarkUpdate() {                                  // 修改储值卡备注
            this.showPopStoreCard = false;
            this.updateRemark = this.currentCardInfo().sv_remark;
            this.updateRemarkVisible = true;
        },
        handlePopReaharge() {
            this.showPopStoreCard = false;
            this.$root.$emit('keyCode', 82);
        },
        handleSubmitInfo() {
            const postData = {
                sv_wallet_id: this.memberInfo.sv_wallet_id,
                type: 3,
                value: this.updateRemark
            }
            stockApi.updateMemberNewWallet(postData).then((res) => {
                if (res) {
                    this.$message.success('修改成功');
                    this.updateRemarkVisible = false;
                    this.currentCardInfo().sv_remark = postData.value;
                }
            })
        },
        //#endregion
        handleHexiao() {                                            // 点击核销图标
            this.$root.$emit('keyCode', 1001);
        },
        handleMessage() {                                           // 点击消息图标
            this.$router.push({
                path: '/messageManagemen/priceChange'
            })
        },
        handleBack() {                                              // 返回挂单列表
            if (this.isOrderBack) {
                this.$router.push('/cashier/orderList');
                return
            }
            this.clearCartting();
			this.update({
				key: 'isInCartting',
				data: false
			});
            this.$emit('handleBack');
        },
        clearCarttingList() {                                       // 清空购物车
            this.$root.$emit('keyCode', 112);
        },
        handleSearch() {
            this.firstSelected = 0;                                 // 一级菜单置为全部
            this.$refs.cashierRight.searchGoodsList(this.searchKeywords);
            this.$nextTick(() => {
                this.searchKeywords = '';
            });
        },
        handleSearchCheckIn() {                                     // 搜索栏按空格键直接弹结算
            this.$refs.searchKeywords.blur();
            this.showCheckin();
        },
        handleEnter() {
            return this.showCheckin()
        },
        showCheckin() {                                             // 显示订单结算弹窗 Enter
            this.$root.$emit('keyCode', 13);
        },
        showMemberList() {                                          // 显示会员选择列表
            this.$root.$emit('setUseType', 'allow_Consumption');
            this.$root.$emit('keyCode', 117);
        },
        showStoreCard() {
            if (this.memberInfo.wallets_list.length < 2) return;
            this.showPopStoreCard = false;
            this.$root.$emit('keyCode', 80);
        },
        showMemberAdd(dataObj) {                                    // 显示新增会员弹窗
            this.memberAddStatus = true;
            if (this.$app.isNull(dataObj)) {
                this.memberAddImport = {
                    newType: 'phone',
                    val: ''
                };
            }
        },
        handleServicer(item) {                                      // 修改开单人返回
            this.tableInfo.sv_employee_id = item.sv_employee_id;
            this.tableInfo.sv_employee_name = item.sv_employee_name;
            this.update({
                key: 'selectedEmployee',
                data: item
            })
            this.startServicerStatus = false;
        },
        handleOrderRemark() {                                       // 填写整单备注
            this.$prompt('请输入备注内容', '整单备注', {
                inputPlaceholder: '请输入备注内容，限100个字',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{0,100}$/,
                inputValue: this.tableInfo.sv_remark || '',
                inputErrorMessage: '请输入备注内容，限100个字'
            }).then(({ value }) => {
                this.tableInfo.sv_remark = value;
            }).catch(e => {

            });
            return
        },
        withOrderSave() {                                           // 挂单
            if (this.isCarrtingNull) {
                // 取单
                if (this.isOnlight) {
                    // 美业简易模式
                    this.$router.push('/cashier/home')
                } else {
                    this.handleBack();
                }
                return
            }
            let sv_pending_list = this.carttingData.productResults.map((e, i) => {
                let provider_list = e.multCommissions.map(workerItem => {
                    return workerItem.map((em, emIndex) => {
                        return {
                            sort: emIndex,
                            e_id: em.sv_employee_id,
                            percent: em.percent,
                            selectedType: em.selectedType,
                            type: em.isAppoint ? 1 : 2,
                        }
                    })
                });
                let sv_preferential = {
                    type: 1,                // 1无改价无次卡抵扣  2有改价  3有次卡，value存次卡id
                    value: e.dealMoney
                };
                if (e.productChangePrice !== null) {
                    sv_preferential = {
                        type: 2,
                        value: e.productChangePrice
                    }
                }
                let promotionId = this.$app.isNull(e.buyStepPromotion) ? null : (e.buyStepPromotion.type === 15 ? e.buyStepPromotion.promotionId : null);
                if (promotionId !== null) {
                    sv_preferential = {
                        type: 3,
                        value: promotionId
                    }
                }
                return {
                    index: i + 1,
                    product_id: e.productId,
                    product_num: e.number,
                    product_total: e.dealMoney,
                    product_unitprice: e.dealPrice,
                    sv_preferential: JSON.stringify(sv_preferential),
                    multiple_provider_list: provider_list
                }
            });

            let query = {
                sv_pending_order_id: this.$app.isNull(this.tableInfo.sv_without_list_id) ? 0 : this.tableInfo.sv_without_list_id,
                sv_catering_grade: this.$app.isNull(this.selectedInfo.sv_catering_grade) ? null : this.selectedInfo.sv_catering_grade,
                sv_bizemployee_id: this.isOnlight ? (this.$app.isNull(this.userInfo.samodel) ? 0 : this.userInfo.samodel.sv_employee_id) : this.tableInfo.sv_employee_id,         // 开单人
                sv_order_source: 100,
                member_id: this.memberInfo.member_id,                       // 会员Id
                sv_sex: this.tableInfo.sv_sex,
                sv_remark: this.tableInfo.sv_remark,
                sv_org_money: this.carttingData.totalMoney,                 // 原总价
                sv_actual_money: this.carttingData.dealMoney,               // 成交总价 === dealMoney
                sv_pending_list: sv_pending_list
            }
            this.isSubmitting = true;
            stockApi.pendingOrder(query).then(res => {
                this.isSubmitting = false;
                // if (this.cashierJurisdiction.printEnable) this.handelFrontPrint(JSON.parse(JSON.stringify(this.carttingData.productResults)), 1);
				this.clearCartting();
                this.clearMember();
                this.clearSelectedInfo();
                this.$message.success('挂单成功');
                if (this.isOnlight) {
                    // 美业简易模式
                    this.$router.push('/cashier/home')
                } else {
                    this.handleBack();
                }
                return
            }).catch(_ => {
                this.isSubmitting = false;
            });
        },
        handleTakeOrder() {
            stockApi.takeOrder({ sv_pending_order_id: this.tableInfo.sv_without_list_id }).then(res => {
                if (!res) return
                if (this.$app.isNull(res.product)) return this.$message.warning('没有找到挂单商品，请稍候再试');
                this.clearCartting();
                let goodsList = res.product.map(e => {
                    let productChangePrice = null;
                    let setmealId = null;
                    if (!this.$app.isNull(e.sv_preferential)) {
                        productChangePrice = JSON.parse(e.sv_preferential).type === 2 ? JSON.parse(e.sv_preferential).value : null;
                        setmealId = JSON.parse(e.sv_preferential).type === 3 ? JSON.parse(e.sv_preferential).value : null;
                    }
                    return {
                        productId: e.product_id,
                        provider: (e.provider ? [e.provider] : e.multiple_provider) || [],
                        number: e.product_num,
                        setmealId: setmealId,
                        productChangePrice,
                        remark: e.remark,
                    }
                });
                let obj = {
                    member_id: res.member_id,
                    list: goodsList
                }
                this.meiyeTakeOrder(obj);
                this.update({
                    key: 'selectedInfo',
                    data: {
                        ...this.selectedInfo,
                        sv_without_list_id: res.sv_pending_order_id,
                        sv_catering_grade: res.sv_catering_grade || null
                    }
                });
                this.update({
                    key: 'selectedEmployee',
                    data: {
                        sv_employee_id: res.sv_bizemployee_id,
                        sv_employee_name: res.sv_bizemployee_name,
                        sv_employee_photo: res.sv_bizemployee_photo,
                        wt_datetime: res.wt_datetime,
                        sv_sex: res.sv_sex,
                        sv_remark: res.sv_remark
                    }
                });
                this.showServicesPrrson = false;
                this.showCashier = true;
            });
        },
        handleSubmitOrder() {                                       // 结算
            if (this.carttingData.productResults.length === 0) return
            this.update({
                key: 'selectedInfo',
                data: JSON.parse(JSON.stringify(this.tableInfo))
            });
            this.showCheckin();
        },
        //#region 
        getFirstCategory() {                                        // 获取商品一级分类
            stockApi.getFirstCategory({ is_cashier: true }).then(res => {
                if (res) {
                    this.firstCategory = this.$app.isNull(res) ? [] : res;
                    this.touchCarttingCursor();
                }
            });
        },
        getSecondCategory() {                                       // 获取商品二级分类
            stockApi.getSecondCategory({ cid: this.firstSelectedItem.id }).then(res => {
                if (res.succeed) {
                    this.secondCategory = this.$app.isNull(res.values) ? [] : res.values;
                    this.touchCarttingCursor();
                }
            });
        },
        handelFrontPrint(dataList) {                                // 挂单打印
            let printDataList = [];
            let dataArray1 = [
                {
                    type: 'line',
                    text: this.userInfo.sv_us_shortname,
                    size: 17,
                    lineHeight: 30,
                    align: 1
                },
                {
                    type: 'line',
                    text: '前台挂单',
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '时间：' + this.$app.currentTime(new Date())
                },
                {
                    type: 'line',
                    text: '开单人：' + this.tableInfo.sv_employee_name,
                    bottomLine: false
                }
            ]
            // 合并打印数组-第一部分
            printDataList = printDataList.concat(dataArray1);
            let tableData = {
                header: ['商品/编码', '数量', '单价', '小计'],
                list: [],
                footer: []
            }
            let buyNumber = 0, dealMoney = 0;
            tableData.list = dataList.map(e => {
                buyNumber += e.number;
                dealMoney += this.$app.multiplyNumber(e.dealPrice, e.number);
                let specs = '', tastes = '', chargings = ''
                e.specs.forEach(k => {
                    specs += '[' + k.name + k.price + '元]'
                })
                e.tastes.forEach(k => {
                    tastes += '[' + k.name + k.price + '元]'
                })
                e.chargings.forEach(k => {
                    chargings += '[' + k.name + k.price + '元]'
                })
                let productName = e.productName + specs + tastes + chargings;
                return {
                    name: e.isPackage ? '※' + productName : productName,
                    code: e.barCode,
                    number: e.number + '',
                    remark: e.remark || null,
                    specs: [],
                    tastes: [],
                    chargings: [],

                    price: this.$app.moneyFixed(e.dealPrice, 2),
                    total: this.$app.moneyFixed(e.dealMoney, 2),
                    packageGroups: e.isPackage ? e.packageGroups : null
                }
            })
            tableData.footer = ['合计', buyNumber + '', '', this.$app.moneyFixed(dealMoney)];
            let isDriverType = this.cashierJurisdiction.printName.indexOf('免驱动') < 0;
            let tableArray = this.$app.printTableDate(tableData, isDriverType, this.printTemplate.salesData.width);
            // 合并打印数组-表格
            printDataList = printDataList.concat(tableArray);

            let shopInfo = []
            shopInfo.push({ type: 'line', text: '电话：' + this.userInfo.sv_us_phone })
            shopInfo.push({ type: 'line', text: '地址：' + this.userInfo.sv_us_address })
            shopInfo.push({ type: 'line', text: '备注：' + this.tableInfo.sv_remark, spaceLine: 2 })
            shopInfo.push({ type: 'line', text: '谢谢惠顾，欢迎下次光临', align: 1 })

            printDataList = printDataList.concat(shopInfo);
            this.$print.sales(printDataList);
        },
        getCateringRegionPageList() {                               // 获取消息数 totalCount
            stockApi.getCateringRegionPageList().then(res => {
                if (!this.$app.isNull(res)) {
                    this.tipsNum = res.totalCount;
                }
            });
        }
    }
};