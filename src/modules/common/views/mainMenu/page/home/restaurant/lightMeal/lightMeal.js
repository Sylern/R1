import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from "vuex";
import quickPay from '../../quickPay/quickPay.vue';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import popTableList from '../../../../base/popTableList/popTableList.vue';
import carttingLight from '../../../../base/carttingLight/carttingLight.vue';
import goodsList from '../../../../base/goodsList/goodsList.vue';
import memberAdd from '../../../../base/memberAdd/memberAdd.vue';
import memberRecharge from '../../../../base/memberRecharge/memberRecharge.vue';
import categoryFirstAdd from '../../../../base/categoryFirstAdd/categoryFirstAdd.vue';
import categorySecondAdd from '../../../../base/categorySecondAdd/categorySecondAdd.vue';
export default {
    components: { quickPay, numberChange, popTableList, carttingLight, goodsList, memberAdd, memberRecharge, categoryFirstAdd, categorySecondAdd },
    name: 'lightMeal',
    data() {
        return {
            fastPayInfo: {
                is_scancode: false,
                isSet: false,
                payment: ''
            },
            isSubmitting: false,                                // 是否在提交挂单
            searchText: '',                                     // 搜索关键字输入框绑定
            searchKeywords: '',                                 // 搜索关键字传组件
            memberAddImport: null,
            memberAddStatus: false,                             // 新增会员弹窗
            memberRechargeStatus: false,                        // 会员充值弹窗
            categoryFirstStatus: false,                         // 新增一级分类弹窗
            categorySecondStatus: false,                        // 新增二级分类弹窗
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
            firstCategory: [],
            secondCategory: [],
            postPopStatus: false,                               // 挂单弹出窗
            postPopText: '',                                    // 挂单备注
            postPopPrintStatus: true,                           // 挂单打印
            tipsNum: 0                                          // 消息提示数量
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingData', 'carttingSearchCursor', 'memberInfo', 'couponCountNumber', 'selectedInfo', 'pricingScaleData', 'user_local_data', 'customerDisplayData']),
        ...mapState('permission', ['CashierManage']),
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
        isOrderTake() {                                         // 是否挂单
            return !this.$app.isNull(this.carttingData.productResults)
        }
    },
    watch: {
        carttingSearchCursor: {                                   // 监听购物车商品加入结束
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
                    })
                }
            }
        },
        memberAddStatus: {                                    // 监听新增会员弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.lightMeal.blur();
                } else {
                    this.$refs.lightMeal.focus();
                }
            }
        },
        memberRechargeStatus: {                               // 监听会员充值弹窗编号
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.lightMeal.blur();
                } else {
                    this.$refs.lightMeal.focus();
                }
            }
        },
        categoryFirstStatus: {                                // 监听新增一级分类弹窗编号
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.cashier.blur();
                } else {
                    this.$refs.cashier.focus();
                }
            }
        },
        categorySecondStatus: {                                // 监听新增二级分类弹窗编号
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.cashier.blur();
                } else {
                    this.$refs.cashier.focus();
                }
            }
        },
        postPopStatus: {
            handler(newVal, oldVal) {
                if (oldVal) {
                    this.postPopText = '';
                }
            }
        },
        'carttingData.dealMoney': {
            handler(newVal, oldVal) {
                if (newVal) {
                    if (newVal > 0 && this.customerDisplayData.enable) {
                        this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 2, newVal);
                    }
                }
            }
        }
    },
    mounted() {
        if (this.customerDisplayData.enable) {
            this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
        }
        this.$refs.searchKeywords.focus();
        this.$root.$on('handleInputFocus', () => {
            this.$nextTick(() => {
                !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
            })
        })
        this.$root.$on('showMemberAdd', (dataObj) => {
            this.memberAddImport = dataObj;
            this.showMemberAdd(dataObj);
        });

        this.getPermissions_Client();
        this.getFirstCategory();
        this.getCateringRegionPageList()                            // 获取消息提示数
        this.update({
            key: 'isLightMeal',
            data: true
        });
        this.$root.$on('restaurant', this.pageFocus);
    },
    beforeDestroy() {
        this.$root.$off('restaurant', this.checkinSuccess);
        this.update({
            key: 'isLightMeal',
            data: false
        })
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'touchCarttingCursor']),
        ...mapMutations('permission', ['setPermission']),
        pageFocus() {
            this.$nextTick(() => {
                this.$refs.restaurant && this.$refs.restaurant.focus();
            })
        },
        getPermissions_Client() {
            let menuJson = this.$app.getLocalStorage('menuJson');
            let permissionItem = menuJson ? menuJson.find(e => e.menu_code === 'CashierlightMeal') : null;
            if (this.$app.isNull(permissionItem)) return
            let query = {
                module_code: permissionItem.menu_code,
                sp_grouping_id: this.userInfo.sp_grouping_id
            }
            stockApi.getPermissions_Client(query).then(res => {
                if (res) {
                    this.setPermission({
                        key: 'CashierManage',
                        data: res
                    })
                    return
                }
                console.log('未获取到权限');
            });
        },
        handleHexiao() {                                            // 点击核销图标
            this.$root.$emit('keyCode', 1001);
        },
        handleMessage() {                                           // 点击消息图标
            this.$router.push({
                path: '/messageManagemen/priceChange'
            })
        },
        handleClearCartting() {                                     // 清空购物车
            this.$alert('清空当前购物车？', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    if (action === 'confirm') {
                        this.clearCartting();
                    }
                }
            });
        },
        editGoodsItem(goodsList) {                                  // 修改商品
            this.takeASingleUpdateCatering(goodsList, '修改成功');
        },
        handleSearch() {
            if (this.$app.quickScanPayCheck(this.searchKeywords) && this.fastPayInfo.is_scancode) {
                this.$root.$emit('quickCashier', { payment: '扫码支付', authCode: this.searchKeywords })
                this.$refs.searchKeywords.blur();
                this.$nextTick(() => {
                    this.searchKeywords = '';
                });
                return
            }
            this.firstSelected = 0;                                 // 一级菜单置为全部
            this.$refs.goodsList.searchGoodsList(this.searchKeywords);
            this.$nextTick(() => {
                this.searchKeywords = '';
            });
        },
        showMemberList() {                                          // 显示会员选择列表
            this.$root.$emit('keyCode', 117);
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
        handleSubtract(item, index) {                               // 加菜数量减
            if (item.product_num <= 1) return;
            item.product_num -= 1;
            this.$set(this.dishContentList, index, item);
        },
        handleAdd(item, index) {                                    // 加菜数量加
            item.product_num += 1;
            this.$set(this.dishContentList, index, item);
        },
        showMemberRecharge() {                                      // 显示会员充值弹窗
            this.memberRechargeStatus = true;
        },
        showCategoryFirst() {                                       // 显示新增一级分类
            this.categoryFirstStatus = true;
        },
        showCategorySecond() {                                      // 显示新增二级分类
            this.categorySecondStatus = true;
        },
        updateGoodsNumber(type) {                                   // 修改选中商品数量
            if (type == 'add') {
                this.$root.$emit('keyCode', 107);
            } else if (type == 'subtract') {
                this.$root.$emit('keyCode', 109);
            }
        },
        handleOrderRemark() {                                       // 填写整单备注
            this.$prompt('请输入备注内容', '整单备注', {
                inputPlaceholder: '请输入备注内容，限100个字',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{0,100}$/,
                inputValue: this.selectedInfo.sv_remark || '',
                inputErrorMessage: '请输入备注内容，限100个字'
            }).then(({ value }) => {
                this.update({
                    key: 'selectedInfo',
                    data: {
                        ...this.selectedInfo,
                        sv_remark: value
                    }
                });
            }).catch(e => {

            });
            return
        },
        handlePostPop() {
            // if (this.$app.isNull(this.postPopText)) return this.$message.warning('请输入挂单备注');
            this.post_guadan();
        },
        handleOrderTake() {                                         // 挂单-取单
            if (this.isOrderTake) {
                // 挂单
                this.postPopStatus = true;
                return
            }
            this.$root.$emit('keyCode', 81);
        },
        post_guadan() {                                             // 轻餐挂单
            if (this.carttingData.productResults.length < 1) return;
            let prlist = this.carttingData.productResults.map(e => {
                return {
                    product_id: e.productId,
                    product_price: e.price,
                    product_name: e.productName,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    sv_is_rouse: this.sv_is_rouse,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: e.totalMoney
                }
            });
            let query = {
                sv_order_source: 0,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.carttingData.dealMoney,
                sv_order_receivable: this.carttingData.dealMoney,
                sv_remark: this.postPopText,
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id,
                sv_without_list_id: this.$app.isNull(this.selectedInfo.sv_without_list_id) ? 0 : this.selectedInfo.sv_without_list_id,
                sv_order_data_type: 0
            }
            this.isSubmitting = true;
            stockApi.fast_post_guadan(query).then(res => {
                this.isSubmitting = false;
                if (res) {
                    if (this.postPopPrintStatus) this.handelPrint(JSON.parse(JSON.stringify(this.carttingData)), this.postPopText);
                    this.clearCartting();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.update({
                        key: 'memberInfo',
                        data: {
                            member_id: ''
                        }
                    });
                    this.update({
                        key: 'selectedInfo',
                        data: {
                            ...this.selectedInfo,
                            sv_remark: ''
                        }
                    });
                    this.postPopStatus = false;
                    return this.$message.success('挂单成功')
                }
            }).catch(_ => {
                this.isSubmitting = false;
            })
        },
        handelPrint(goodsData, remark) {
            let printDataList = [
                {
                    type: 'line',
                    text: this.userInfo.sv_us_shortname,
                    size: 23,
                    lineHeight: 60,
                    align: 1
                },
                {
                    type: 'line',
                    text: '预打小票',
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '挂单时间：' + this.$app.currentTime(new Date())
                },
            ];
            if (!this.$app.isNull(this.memberInfo.member_id)) {
                let memberData = [
                    {
                        type: 'line',
                        text: '会员名称：' + this.memberInfo.sv_mr_name
                    },
                    {
                        type: 'line',
                        text: '会员卡号：' + this.memberInfo.sv_mr_cardno
                    }
                ]
                printDataList.printDataList.concat(memberData);
            }
            printDataList.push({
                type: 'line',
                text: '挂单备注：' + remark,
                bottomLine: true
            });
            let tableData = {
                header: ['名称/条码', '数量', '单价', '小计'],
                list: [],
                footer: []
            }
            tableData.list = goodsData.productResults.map(e => {
                return {
                    name: e.isPackage ? '※' + e.productName : e.productName,
                    code: e.barCode,
                    number: e.number + '',
                    specs: e.specs,
                    tastes: e.tastes,
                    chargings: e.chargings,
                    price: this.$app.moneyFixed(e.dealPrice, 2),
                    total: this.$app.moneyFixed(e.dealMoney, 2),
                    packageGroups: e.isPackage ? e.packageGroups : null
                }
            })
            tableData.footer = ['合计', goodsData.dealNumber + '', '', this.$app.moneyFixed(goodsData.totalMoney)];
            let isDriverType = this.$store.state.cashierJurisdiction.printName.indexOf('免驱动') < 0;
            let tableArray = this.$app.printTableDate(tableData, isDriverType, this.$store.state.printTemplate.salesData.width);
            // 合并打印数组-表格
            printDataList = printDataList.concat(tableArray);
            this.$print.sales(printDataList);
        },
        // takeASingle() {                                             // 取单
        //     let query = {
        //         orderId: this.tableInfo.sv_table_id
        //     }
        //     stockApi.fast_takeASingle(query).then(res => {
        //         if (res) {
        //             this.clearCartting();
        //             this.clearMember();
        //         }
        //     });
        // },
        postFastPay() {
            this.$root.$emit('quickCashier', { payment: this.fastPayInfo.payment })
        },
        showCheckin() {                                             // 显示订单结算弹窗 Enter
            this.$root.$emit('keyCode', 13);
        },
        handleFirstCategoryAll() {                                  // 一级菜单点击事件-全部
            this.firstSelected = 0;
            this.secondSelected = 0;
            this.firstSelectedItem = {
                id: -1,
                label: ''
            };
            this.secondSelectedItem = {
                id: -1,
                label: ''
            };
            this.$nextTick(() => {
                this.$refs.goodsList.searchGoodsList(this.searchKeywords);
            });
        },
        handleFirstCategory(item, index) {                          // 一级菜单点击事件
            if (this.firstSelected == index && this.firstSelected != 0) return;
            this.firstSelected = index;
            this.firstSelectedItem = {
                id: item.productcategory_id,
                label: item.sv_pc_name
            };
            this.secondSelected = 0;
            this.secondSelectedItem = {
                id: -1,
                label: ''
            };
            this.getSecondCategory(item.productcategory_id);
            this.$nextTick(() => {
                this.$refs.goodsList.getGoodsList(true);
            });
        },
        handleSecondCategoryAll() {                                 // 二级菜单点击事件-全部
            if (this.secondSelected == 0) return;
            this.secondSelected = 0;
            this.secondSelectedItem = {
                id: -1,
                label: ''
            };
            this.$nextTick(() => {
                this.$refs.goodsList.getGoodsList(true);
            });
        },
        handleSecondCategory(item, index) {                         // 二级菜单点击事件
            this.searchKeywords = this.searchText;
            if (this.secondSelected == index) return;
            this.secondSelected = index;
            this.secondSelectedItem = {
                id: item.productsubcategory_id,
                label: item.sv_psc_name
            };
            this.$nextTick(() => {
                this.$refs.goodsList.getGoodsList(true);
            });
        },
        firstAddBack() {                                            // 新增一级分类回调
            this.firstSelected++;
            this.getFirstCategory();
        },
        secondAddBack() {                                           // 新增二级分类回调
            this.getSecondCategory();
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
        getCateringRegionPageList() {                               // 获取消息数 totalCount
            stockApi.getCateringRegionPageList().then(res => {
                if (!this.$app.isNull(res)) {
                    this.tipsNum = res.totalCount;
                }
            });
        }
    }
};