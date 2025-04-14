import { stockApi } from "@/api/index.js";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import selectOrder from '../../../base/selectOrder/selectOrder.vue';
import checkReturn from '../../../base/checkReturn/checkReturn.vue';
import orderWiped from '../../../base/orderWiped/orderWiped.vue';
import memberList from '../../../base/memberList/memberList.vue';
import cartting from '../../../base/carttingReturn/cartting.vue';
import goodsList from '../../../base/goodsListReturn/goodsList.vue';
import memberAdd from '../../../base/memberAdd/memberAdd.vue';
import memberRecharge from '../../../base/memberRecharge/memberRecharge.vue';
import categoryFirstAdd from '../../../base/categoryFirstAdd/categoryFirstAdd.vue';
import categorySecondAdd from '../../../base/categorySecondAdd/categorySecondAdd.vue';
export default {
    components: { selectOrder, checkReturn, orderWiped, memberList, cartting, goodsList, memberAdd, memberRecharge, categoryFirstAdd, categorySecondAdd },
    name: 'return-cashier',
    data() {
        return {
            orderNumber: null,
            orderDataList: [],                                  // 选择订单列表数据
            returnCarttingData: [],
            searchText: '',                                     // 搜索关键字输入框绑定
            searchKeywords: '',                                 // 搜索关键字传组件
            selectOrderStatus: false,                           // 选择订单弹窗
            orderWipedStatus: false,                            // 订单核销弹窗
            memberListStatus: false,                            // 选择会员弹窗
            memberAddImport: null,
            memberAddStatus: false,                             // 新增会员弹窗
            memberRechargeStatus: false,                        // 会员充值弹窗
            categoryFirstStatus: false,                         // 新增一级分类弹窗
            categorySecondStatus: false,                        // 新增二级分类弹窗
            checkReturnStatus: false,                           // 确认退货弹窗
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
            tipsNum: 0                                          // 消息提示数量
        }
    },
    computed: {
        ...mapGetters(['hasReturnOrExchange']),
        ...mapState(['memberInfo', 'couponCountNumber']),
        ...mapState('permission', ['CashierManage']),
        orderTotalInfo() {
            let number = 0, money = 0;
            this.orderDataList.forEach(e => {
                number += e.number;
                money = this.$app.addNumber(money, e.dealMoney)
            });
            return {
                number: number,
                money: this.$app.moneyFixed(money)
            }
        },
        addTotalInfo() {
            let number = 0, money = 0;
            this.returnCarttingData.forEach(e => {
                number += e.number;
                money = this.$app.addNumber(money, e.dealMoney)
            });
            return {
                number: number,
                money: this.$app.moneyFixed(money)
            }
        },
        totalMoney() {
            return this.$app.subtractNumber(this.addTotalInfo.money, this.orderTotalInfo.money)
        },
        importMoneyInfo() {
            return {
                orderMoney: this.orderTotalInfo.money,
                addGoodsMoney: this.addTotalInfo.money,
                payMoney: this.totalMoney
            }
        },
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
        imgBase() {
            return stockApi.imgBase()
        }
    },
    watch: {
        'orderTotalInfo.number': {
            handler(newVal, oldVal) {
                if (newVal === 0) {
                    this.orderNumber = null;
                }
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.returnCarttingData.length > 0) {
            this.$confirm('您有退换货商品待处理! 离开当前页面将会清空商品，是否确定？', '提示', {
                confirmButtonText: '确定',
                cancleButtonText: '取消',
                callback: action => {
                    if (action === 'confirm') {
                        this.update({
                            key: 'selectedInfo',
                            data: {
                                ...this.selectedInfo,
                                sv_remark: ''
                            }
                        });
                        next()
                    }
                }
            });
        } else {
            this.update({
                key: 'selectedInfo',
                data: {
                    ...this.selectedInfo,
                    sv_remark: ''
                }
            });
            next()
        }
    },
    mounted() {
        this.$refs.searchKeywords.focus();
        this.getFirstCategory();
        // this.calcGoodsWrapHeight();
        this.getCateringRegionPageList()                            // 获取消息提示数
        this.$root.$on('batchAddToList', (dataArray) => {
            let list = JSON.parse(JSON.stringify(this.returnCarttingData));
            dataArray.forEach(e => {
                list = list.filter(item => item.productId !== e.product_id);
            })
            this.returnCarttingData = list.concat(dataArray);
        });
        this.$root.$on('showMemberAdd', (dataObj) => {
            this.memberAddImport = dataObj;
            this.showMemberAdd(dataObj);
        });
    },
    methods: {
        ...mapMutations(['update', 'clearMember']),
        ...mapActions(['requsetMemberInfo']),
        handleCloseMember() {
            this.memberListStatus = false;
        },
        handleHexiao() {                                            // 点击核销图标
            this.orderWipedStatus = true;
        },
        handleMessage() {                                           // 点击消息图标
            this.$router.push({
                path: '/messageManagemen/priceChange'
            })
        },
        showStoreCard() {
            this.$root.$emit('keyCode', 80);
        },
        showEquityCard() {
            this.$root.$emit('keyCode', 85);
        },
        //#endregion
        handleSearch() {
            this.firstSelected = 0;                                 // 一级菜单置为全部
            this.$refs.goodsList.searchGoodsList(this.searchKeywords);
            this.$nextTick(() => {
                this.searchKeywords = '';
            });
        },
        calcGoodsWrapHeight() {                                     // 计算商品列表的高度
            this.$nextTick(() => {
                this.goodsWrapHeight = this.$refs.returnRight.offsetHeight - this.$refs.classification.offsetHeight - 16 + 'px';
            })
        },
        handleGoodsList(goodsItem) {
            let specs = this.$app.isNull(goodsItem.specIds) ? [] : goodsItem.specIds;
            let tastes = this.$app.isNull(goodsItem.tasteIds) ? [] : goodsItem.tasteIds;
            let chargings = this.$app.isNull(goodsItem.chargingIds) ? [] : goodsItem.chargingIds;
            let isSame = goodsItem.product_id + specs + tastes + chargings;

            let dataFilter = this.returnCarttingData.filter(e => (e.productId + [...e.specs.map(k => k.id)] + [...e.tastes.map(k => k.id)] + [...e.chargings.map(k => k.id)]) === isSame);
            let goodsNumber = goodsItem.number || 1;
            let pNumber = dataFilter.length > 0 ? parseInt(dataFilter[0].number) + goodsNumber : goodsNumber;
            let addItem = {
                productId: goodsItem.product_id,
                productName: goodsItem.sv_p_name,
                barCode: goodsItem.sv_p_barcode,
                number: pNumber || 1,
                unitName: goodsItem.sv_p_unit,
                tastes: tastes,
                chargings: chargings,
                specs: specs,
                price: goodsItem.sv_p_unitprice,
                dealPrice: goodsItem.dealPrice,
                couponMoney: 0,
                remark: goodsItem.remark,
                isPricingMethod: goodsItem.isPricingMethod || false,
                dealMoney: goodsItem.dealPrice * pNumber
            }

            let dataArray = [];
            dataArray.push(addItem);
            dataArray = dataArray.concat(this.returnCarttingData.filter(e => (e.productId + [...e.specs.map(k => k.id)] + [...e.tastes.map(k => k.id)] + [...e.chargings.map(k => k.id)]) !== isSame));
            this.returnCarttingData = dataArray;
        },
        handleOrderList() {
            let menuJson = this.$app.getLocalStorage('menuJson') || [];
            if (menuJson.findIndex(e => e.menu_path === '/cashier/2return') > -1) {
                this.selectOrderStatus = true;
            } else {
                this.$router.push('orderList');
            }
        },
        handleReturnData(dataContent) {
            this.orderDataList = this.$app.isNull(dataContent.list) ? [] : dataContent.list.map(e => {
                // let product_price = this.$app.addNumber(e.product_price, e.product_taste_total_money);
                let sv_preferential_data = this.$app.isNull(e.sv_preferential_data) ? [] : JSON.parse(e.sv_preferential_data);
                // let discountLocal = sv_preferential_data.length > 0 ? '优惠' + this.$app.moneyFixed(sv_preferential_data[0].m) + '元' : '无折扣';
                let discountLocal = sv_preferential_data.length > 0 ? '' : '无折扣';
                const product_total = this.$app.multiplyNumber(e.product_unitprice, e.product_num)
                return {
                    ...e,
                    productName: e.product_name,
                    barCode: e.sv_p_barcode,
                    number: e.product_num,
                    currentNumber: e.product_num,
                    dealPrice: e.product_unitprice,
                    unitName: e.sv_p_unit,
                    dealMoney: e.record_type === 2 ? (-1 * product_total) : product_total,
                    discountLocal: discountLocal,
                    sv_preferential_data,
                    sv_preferential_data_text: sv_preferential_data.length > 0 ? sv_preferential_data[0].s : '',
                    sv_combination_new: this.$app.isNull(e.sv_combination_new) ? [] : JSON.parse(e.sv_combination_new)
                }
            }).filter(e => e.currentNumber > 0);
            this.orderNumber = dataContent.id;
            if (this.$app.isNull(dataContent.member_id)) {
                this.clearMember();
            } else {
                this.requsetMemberInfo(dataContent.member_id);
            }
        },
        handleSuccess() {
            this.orderDataList = [];
            this.returnCarttingData = [];
            this.clearMember();
            this.update({
                key: 'selectedInfo',
                data: {
                    ...this.selectedInfo,
                    sv_remark: ''
                }
            });
        },
        clearCartting() {
            this.returnCarttingData = [];
            this.orderDataList = [];
            this.orderNumber = null;
        },
        showCategoryFirst() {                                       // 显示新增一级分类
            this.categoryFirstStatus = true;
        },
        showCategorySecond() {                                      // 显示新增二级分类
            this.categorySecondStatus = true;
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
            this.calcGoodsWrapHeight();
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
            stockApi.getFirstCategory({ is_cashier: true, is_noorder_return: true }).then(res => {
                if (res) {
                    this.firstCategory = this.$app.isNull(res) ? [] : res;
                    this.calcGoodsWrapHeight();
                }
            });
        },
        getSecondCategory() {                                       // 获取商品二级分类
            stockApi.getSecondCategory({ cid: this.firstSelectedItem.id }).then(res => {
                if (res.succeed) {
                    this.secondCategory = this.$app.isNull(res.values) ? [] : res.values;
                    this.calcGoodsWrapHeight();
                }
            });
        },
        showMemberList() {                                          // 显示会员选择列表
            this.memberListStatus = true;
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
        handleClearMember() {                                       // 清除选中会员
            this.clearMember();
        },
        showMemberRecharge() {                                      // 显示会员充值弹窗
            this.memberRechargeStatus = true;
        },

        updateGoodsNumber(type) {                                   // 修改选中商品数量
            if (type == 'add') {
                this.$root.$emit('keyCode', 107);
            } else if (type == 'subtract') {
                this.$root.$emit('keyCode', 109);
            }
        },
        getRemark(remark) {
            this.update({
                key: 'selectedInfo',
                data: {
                    ...this.selectedInfo,
                    sv_remark: remark
                }
            });
        },
        showCheckReturn() {                                         // 显示订单结算弹窗 Enter
            if (this.returnCarttingData.length < 1 && this.checkReturnStatus.length < 1) return;
            this.checkReturnStatus = true;
        },
        getCateringRegionPageList() {         // 获取消息数 totalCount
            stockApi.getCateringRegionPageList().then(res => {
                if (!this.$app.isNull(res)) {
                    this.tipsNum = res.totalCount;
                }
            });
        }
    }
};