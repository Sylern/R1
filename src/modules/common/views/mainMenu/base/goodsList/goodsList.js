import { stockApi, basicApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
import utils from '@/utils/utils';
import popCashmoney from '../popCashmoney/popCashmoney.vue';
import goodsItem from '../goodsItem/goodsItem.vue';
import goodsAssistant from '../goodsAssistant/goodsAssistant.vue';
import moreFuncEntry from '../moreFuncEntry/moreFuncEntry.vue';
import memberRecharge from '../memberRecharge/memberRecharge.vue';
import numberChange from '../numberChange/numberChange.vue';
const { debounce, throttle } = utils;
export default {
    name: 'goodsList',
    components: { popCashmoney, goodsItem, goodsAssistant, moreFuncEntry, memberRecharge, numberChange },
    props: {
        categoryId: {                           // 一级分类id
            type: Number,
            default: -1
        },
        erjicategory: {                         // 二级分类id
            type: Number,
            default: -1
        },
        producttype: {                          // 分类类型 5-艺人技能
            type: String,
            default: '-1'
        },
        waittingStatus: {
            type: Boolean,
            default: false
        },
        darkModel: {
            type: Boolean,
            default: false
        },
    },
    data() {
        const showKouci = this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_pleasure_ground' || this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_cosmetology';
        return {
            imgBase: stockApi.imgBase(),
            s: null,                                        // 加入购物车计时器
            isShowCash: false,
            Cashier_Number_Cumulation_enable: true,         // 加入购物车是否叠加
            tempWrapVisible: false,
            query: {
                category: -1,                               // 一级分类id
                erjicategory: -1,                           // 二级分类id
                isn: '',
                pageSize: 12,
                pageIndex: 1,
                name: '',                                   // 查询条件
                read_morespec: true
            },
            goodsTotal: 0,                                  // 数据页码
            goodsList: [],
            groupList: [],
            state_count: {                                  // 艺人技能状态
                all_count: 0,
                free_count: 0,
                service_count: 0
            },
            stateText: {
                0: '空闲',
                1: '服务中'
            },
            stateSelectPos: -1,                             // -1-全部 0-空闲 1-服务中

            popAssistant: {},
            popGoodsAssistant: false,

            categoryIdList: [],                             // 临时菜商品分类
            queryAddCatering: {
                sv_p_barcode: '',
                sv_p_name: '',
                sv_p_unitprice: '',                         // 
                productcategory_id: 0,                      // 商品一级分类
                productsubcategory_id: 0,                   // 商品二级分类
                sv_printer_id: null,
                iscloundprint: null,
            },
            cascader: {
                options: [],
                props: {
                    checkStrictly: true
                },
                type: "cascaderLazy"
            },
            printerList: [],
            rules: {
                sv_p_barcode: [{
                    required: true,
                    message: '请输入商品条码',
                    trigger: ['blur']
                }],
                sv_p_name: [{
                    required: true,
                    message: '请输入商品名称',
                    trigger: ['blur']
                }]
            },

            ballAnimation: '',

            currentPriceStatus: false,                      // 时价弹窗
            currentPriceItem: {
                currentDealPrice: 0
            },

            systemInfo: {},
            animationImg: '',
            funcEntryStatus: false,
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
                    type: 3,
                    fnName: 82,
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
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingData', 'pricingScaleData', 'memberInfo', 'cashierJurisdiction', 'user_local_data']),
        ...mapState('permission', ['CashierManage']),
        goodsListShowType() {
            return this.user_local_data.goodsListShowType
        },
        hasTempBtn() {
            return this.userInfo.sv_us_industrytype == 27
        },
        tempBtnType() {
            let typeCss = ['small', 'big', 'noPic']
            return typeCss[this.goodsListShowType]
        },
        btnIconList() {
            this.iconList.forEach(item => {
                let keyIndex = this.user_local_data.iconCheckList.findIndex(e => e.keyName === item.name);
                if (keyIndex > -1) {
                    item.isChecked = this.user_local_data.iconCheckList[keyIndex].isChecked ? true : false;
                }
            })
            return this.iconList
        },
        isCatering() {
            // 6-棋牌茶楼 24-烘培行业 27-餐饮
            const excludedIndustry = [6, 24, 27]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype)
        },
        isMeiye() {
            return this.userInfo.sv_us_industrytype === 1
        },
    },
    watch: {
        tempWrapVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.categoryIdList = [];
                    this.getFirstCategory();
                    this.getAutomaticallyGenerateMemberId();
                    this.getKitchenPrinterList();
                    this.$nextTick(() => {
                        this.initForm();
                        this.$refs.sv_p_name.focus();
                    })
                } else {
                    this.$root.$emit('restaurant', 'cateringMore');
                }
            }
        },
        goodsListShowType: {
            handler(newVal, oldVal) {
                this.query.pageIndex = 1;
                this.query.name = '';
                this.query.isn = '';
                this.query.pageSize = newVal === 1 ? 24 : 45;
                this.getGoodsList();
            }
        },
        categoryId: {                                         // 一级分类id
            handler(newVal, oldVal) {
                this.query.category = this.categoryId;
                this.query.erjicategory = -1;
            }
        },
        erjicategory: {                                       // 二级分类id
            handler(newVal, oldVal) {
                this.query.erjicategory = this.erjicategory;
            }
        },
    },
    mounted() {
        this.query.pageSize = this.goodsListShowType === 1 ? 24 : 45;
        this.query.category = this.categoryId;
        this.query.erjicategory = this.erjicategory;
        this.getUserModuleConfigs();
        this.getUserCoutnt();
        this.getGoodsList();
        this.syncFuncIcon();
        this.$root.$on('refreshGoodsList', this.refreshGoodsList);
        this.$root.$on('refreshAssistant', this.getTutorGroupingList);
    },
    beforeDestroy() {
        this.$root.$off('refreshGoodsList', this.refreshGoodsList);
        this.$root.$off('refreshAssistant', this.getTutorGroupingList);
    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData', 'updateCashmoney', 'touchCarttingCursor']),
        ...mapActions(['addToCartting']),
        refreshGoodsList() {
            this.getGoodsList(true);
        },
        getUserModuleConfigs() {                            // 获取商品购物车是否叠加配置
            stockApi.getUserModuleConfigs(['ReceptionCashierSet']).then(res => {
                if (res) {
                    let data = res.find(e => e.sv_user_module_code === 'ReceptionCashierSet');
                    let Cashier_Number_Cumulation = data.childInfolist.find(e => e.sv_user_config_code === 'Cashier_Number_Cumulation');
                    let cashierHasDetail = this.$app.isNull(Cashier_Number_Cumulation.childDetailList) ? false : true;
                    this.Cashier_Number_Cumulation_enable = cashierHasDetail ? Cashier_Number_Cumulation.childDetailList[0].sv_detail_is_enable : true;
                }
            })
        },
        getUserCoutnt() {                                   // 获取备用金配置                   
            stockApi.getMemeberFilters().then(res => {
                if (res) {
                    this.isShowCash = res.sv_store_cashmoney_enable && this.userInfo.sv_cashmoney_state === 0;
                }
            });
        },
        setSalesclerkCash(val) {                            // 设置备用金
            if (this.$app.isNull(val)) { return this.$message.error('请输入备用金') }
            basicApi.setSalesclerkCash(val).then(res => {
                this.$message.success('保存成功');
                this.isShowCash = false;
                this.updateCashmoney(1)
                stockApi.getUserInfo().then(data => {
                    if (data) {
                        this.$app.setLocalStorage('user_Info', JSON.stringify(data));
                    }
                })
            })
        },
        initForm() {                                        // 初始化表格输入 
            this.queryAddCatering = {
                sv_p_barcode: '',
                sv_p_name: '',
                sv_p_unitprice: '',                         // 
                productcategory_id: 0,                      // 商品一级分类
                productsubcategory_id: 0,                   // 商品二级分类
                sv_printer_id: null,
                iscloundprint: null,
            }
        },
        syncFuncIcon() {                                            // 默认开启更多功能按键
            this.iconList.forEach(item => {
                let keyIndex = this.user_local_data.iconCheckList.findIndex(e => e.keyName === item.name);
                if (keyIndex > -1) {
                    item.isChecked = this.user_local_data.iconCheckList[keyIndex].isChecked ? true : false;
                } else {
                    if (item.name === '充值' || item.name === '无码收银' || item.name === '寄存/领取') {
                        item.isChecked = true;
                    }
                }
            })
            let checkIconList = this.iconList.map(e => {
                return {
                    keyName: e.name,
                    isChecked: e.isChecked
                }
            })
            this.updateUserLocalData({
                ...this.user_local_data,
                iconCheckList: checkIconList
            })
        },
        showGoodsAdd() {                                            // 显示新增商品弹窗 F2
            this.$root.$emit('keyCode', 113);
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
        closeCaterDialog() {
            this.tempWrapVisible = false;
        },
        handleInputAdd({ target }) {                                   // 输入框输入内容执行
            target.value = this.$app.verifyNumberDecimal(target.value);
        },
        handleAddCatering(type) {
            if (this.categoryIdList.length === 0) return this.$message({ message: '请选择商品分类', type: 'warning' });
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.queryAddCatering.sv_is_temp = type === 1 ? false : true;                                                // 是否临时菜品
                    this.queryAddCatering.productcategory_id = this.categoryIdList[0];                                           // 一级分类id

                    this.queryAddCatering.productsubcategory_id = this.categoryIdList.length > 1 ? this.categoryIdList[1] : 0;   // 二级分类id
                    if (this.$app.isNull(this.queryAddCatering.sv_printer_id)) this.queryAddCatering.sv_printer_id = 0;          // 后厨打印配置id
                    if (this.queryAddCatering.sv_printer_id > 0) {
                        this.queryAddCatering.iscloundprint = this.printerList.find(e => e.value === this.queryAddCatering.sv_printer_id).iscloundprint;
                    }
                    if (this.$app.isNull(this.queryAddCatering.sv_p_unitprice)) this.queryAddCatering.sv_p_unitprice = 0;        // 不输入金额默认0元
                    stockApi.addTempProduct(this.queryAddCatering).then(res => {
                        if (res.succeed) {
                            // this.$message({ message: '新增商品成功', type: 'success' });
                            this.closeCaterDialog();
                            this.$root.$emit('showCatting');
                            let goodsItem = {
                                productId: res.values,
                                waittingStatus: this.waittingStatus,
                                // productName: goodsItem.sv_p_name,
                                // barCode: goodsItem.sv_p_barcode,
                                number: 1,
                                // unitName: goodsItem.sv_p_unit,
                                tastes: null,
                                chargings: null,
                                specs: null,
                                // price: goodsItem.sv_p_unitprice,
                                // dealPrice: dealPrice,
                                // couponMoney: 0,
                                // dealMoney: goodsItem.sv_p_unitprice * pNumber
                            }
                            let dataArray = [];
                            dataArray.push(goodsItem);
                            dataArray = dataArray.concat(this.carttingData.productResults);
                            this.addToCartting(dataArray);
                            this.refreshGoodsList();
                        } else {
                            return this.$message({ message: res.errmsg, type: 'warning' });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        searchGoodsList(searchText) {
            if (this.producttype === '5') {
                return
            }
            this.query.pageIndex = 1;
            this.query.name = searchText;
            if (this.userInfo.sv_us_industrytype === 15 && searchText.length === 13 && !isNaN(searchText)) {
                this.query.isn = searchText.substring(2, 7)
            } else {
                this.query.isn = searchText;
            }
            this.query.category = -1;
            this.query.erjicategory = -1;
            this.getGoodsList();
        },
        handleEmployeeList(list) {
            if (this.stateSelectPos === -1) return list
            return list.filter(e => e.employee_state === this.stateSelectPos)
        },
        handleState(pos) {
            this.stateSelectPos = pos;
        },
        handleEmployee(data) {
            this.popAssistant = data || {};
            this.popGoodsAssistant = true;
        },
        getGoodsList(initSearch) {                                  //  获取商品数据
            if (this.producttype === '5') {
                this.getTutorGroupingList();
                return
            }
            if (initSearch) {
                this.query.pageIndex = 1;
                this.query.name = '';
                this.query.isn = '';
            }
            const queryData = {
                ...this.query,
                producttype: this.producttype
            }
            if (!this.isCatering) {
                stockApi.getProductCashierList(queryData).then(res => {
                    if (res) {
                        this.goodsList = this.$app.isNull(res.list) ? [] : res.list;
                        this.goodsTotal = res.total;
                        this.$nextTick(() => {
                            !!this.$refs.goodsListScroll && this.$refs.goodsListScroll.update();
                        })
                        if (this.query.name != '' && this.query.pageIndex == 1 && this.goodsList.length == 1) {
                            let searchCode = this.query.name;
                            let is_artno = searchCode ? this.goodsList[0].sv_p_artno === searchCode.substring(2, 7) : false;
                            if (this.userInfo.sv_us_industrytype === 15 && searchCode.length === 13 && is_artno) {
                                let weightNumber = searchCode.substring(7, 12) / 100 / this.goodsList[0].sv_p_unitprice;
                                let goodsItem = {
                                    ...this.goodsList[0],
                                    number: parseFloat(weightNumber).toFixed(3)
                                }
                                this.handleGoodsToCart(goodsItem);
                            } else {
                                this.$nextTick(() => {
                                    this.$refs.goodsItem[0].handleGoodsItem()
                                })
                            }
                        } else {
                            this.touchCarttingCursor();
                        }
                    }
                });
            } else {
                stockApi.getProductCashierCateringList(queryData).then(res => {
                    if (res) {
                        this.goodsList = this.$app.isNull(res.dataList) ? [] : res.dataList;
                        this.goodsTotal = res.pageCount;
                        this.$nextTick(() => {
                            !!this.$refs.goodsListScroll && this.$refs.goodsListScroll.update();
                        })
                        if (this.query.name != '' && this.query.pageIndex == 1 && this.goodsList.length == 1) {
                            this.$nextTick(() => {
                                this.$refs.goodsItem[0].handleGoodsItem()
                            })
                        } else {
                            this.touchCarttingCursor();
                        }
                    }
                });
            }
        },
        getTutorGroupingList() {
            stockApi.getTutorGroupingList().then(res => {
                if (res) {
                    this.groupList = this.$app.isNull(res.grouping_list) ? [] : res.grouping_list;
                    this.state_count = {
                        all_count: res.state_count.all_count,
                        free_count: res.state_count.free_count,
                        service_count: res.state_count.service_count
                    }
                    this.$nextTick(() => {
                        !!this.$refs.goodsListScroll && this.$refs.goodsListScroll.update();
                    })
                }
            });
        },
        pageLast() {
            if (this.query.pageIndex === 1) return;
            this.query.pageIndex--;
            this.pageChange();
        },
        pageNext() {
            if (this.query.pageIndex === this.goodsTotal) return;
            this.query.pageIndex++;
            this.pageChange();
        },
        pageChange: debounce('getGoodsList', 200),

        handleGoodsToCart(goodsItem) {                              // 添加商品数据到购物车
            // sv_product_type 0为普通商品，1为包装，2为套餐
            // producttype_id  产品类型 0为普通商品，1为服务商品，2为计时商品（游乐场之类）

            // let dataIndex = this.carttingData.productResults.findIndex(e => e.productId == goodsItem.product_id);
            // let pNumber = dataIndex < 0 ? 1 : parseInt(this.carttingData.productResults[dataIndex].number) + 1;
            // let dealPrice = dataIndex < 0 ? goodsItem.sv_p_unitprice : this.carttingData.productResults[dataIndex].dealPrice;
            let dataFilterItem;
            let specs = this.$app.isNull(goodsItem.specs) ? [] : goodsItem.specs;
            let tastes = this.$app.isNull(goodsItem.tastes) ? [] : goodsItem.tastes;
            let chargings = this.$app.isNull(goodsItem.chargings) ? [] : goodsItem.chargings;
            let isSame = goodsItem.product_id + specs + tastes + chargings;

            // 非套餐、开启商品叠加、非美业，过滤已在购物车的商品
            let dataArray = [];
            let product_Number_Cumulation_enable = true;
            // 商品类型是否支持叠加
            if (this.userInfo.sv_us_industrytype === 1 || this.userInfo.sv_us_industrytype === 6) {
                product_Number_Cumulation_enable = goodsItem.producttype_id !== 0 ? false : true;
            }
            if (!goodsItem.isPackage && this.Cashier_Number_Cumulation_enable && product_Number_Cumulation_enable) {
                // dataArray = this.carttingData.productResults.filter(e => (e.productId + [...e.specs.map(k => k.id)] + [...e.tastes.map(k => k.id)] + [...e.chargings.map(k => k.id)]) !== isSame);
                dataFilterItem = this.carttingData.productResults.find(e => (e.productId + [...e.specs.map(k => k.id)] + [...e.tastes.map(k => k.id)] + [...e.chargings.map(k => k.id)]) === isSame);
            }
            // }
            let goodsNumber = goodsItem.number || 1;
            let pNumber = goodsNumber;
            if (dataFilterItem) {
                dataFilterItem.number = this.$app.addNumber(pNumber, dataFilterItem.number);
                this.addToCartting(this.carttingData.productResults);
            } else {
                dataArray = JSON.parse(JSON.stringify(this.carttingData.productResults));
                // 加入购物车，后端验证库存
                let addItem = {
                    waittingStatus: goodsItem.waittingStatus || this.waittingStatus,
                    productId: goodsItem.product_id,
                    project_time: goodsItem.project_time || 0,
                    number: pNumber || 1,
                    tastes: tastes,
                    chargings: chargings,
                    specs: specs,
                    appraiseNumber: goodsItem.appraiseNumber,
                    productChangePrice: goodsItem.productChangePrice,
                    packageGroups: this.$app.isNull(goodsItem.packageGroups) ? null : goodsItem.packageGroups,
                    promotionType: 'clickAdd',
                    remark: goodsItem.remark
                }
                const concat_industry_List = [1, 6];                // 1-美业  6-棋牌  添加商品购物车顺序叠加
                if (concat_industry_List.includes(this.userInfo.sv_us_industrytype)) {
                    dataArray.push(addItem);
                } else {
                    dataArray.unshift(addItem);
                }
                this.addToCartting(dataArray);
            }
        },

        handleCurrentPriceBack(val) {
            const goodsItem = {
                ...this.currentPriceItem,
                productChangePrice: val
            }
            this.update({
                key: 'pricingScaleData',
                data: {
                    tare: this.pricingScaleData.tare,
                    weight: this.pricingScaleData.weight,
                    unit_price: val,
                    total_price: this.$app.moneyFixed(this.$app.multiplyNumber(this.pricingScaleData.weight, val), 3),
                    isStabilize: true
                }
            })
            this.handleGoodsToCart(goodsItem);
        },

        addCart(e, goodsItem) {                                     // 添加购物车
            if (goodsItem.sv_is_current_price) {
                this.currentPriceItem = goodsItem;
                return this.currentPriceStatus = true
            }
            this.handleGoodsToCart(goodsItem);
            if (this.$app.isNull(e)) return;
            // 加入购物车动画
            clearTimeout(this.s);
            let self = this,
                speed = 1000, //速度
                //点击的起点
                startY = e.clientY - 50,
                startX = e.clientX,
                //购物车坐标
                endX = 400,
                endY = 200;
            // 获取当前点击的商品图片
            self.animationImg = goodsItem.img;
            //计算不同位置的动画执行时间
            let m = Math.sqrt((Math.abs(startX - endX) ** 2) + (Math.abs(startY - endY) ** 2));
            let animationTime = (m * speed) / 4000;
            //给小球起点位置
            self.ballAnimation = `top:${startY}px;left:${startX}px;transition:all 0s;display:block;transform: scale(1);`
            setTimeout(() => {
                self.ballAnimation = `top:${endY}px;left:${endX}px;transition:all ${animationTime}ms ease-in,left ${animationTime}ms linear;display:block;transform: scale(0.4);`;
                //给小球终点坐标，并执行动画
                this.s = setTimeout(() => {
                    //动画完成之后，重置
                    self.animationImg = '';
                    self.ballAnimation = `left:0;right:0;transition:all 0s;display:none;transform: scale(1);`;
                    clearTimeout(this.s);
                }, animationTime);
            }, 50)
        },

        //#region 获取数据
        getFirstCategory() {                                        // 获取商品一级分类
            stockApi.getFirstCategory({ producttype_id: this.producttype_id }).then(res => {
                if (res) {
                    this.cascader.options = this.$app.isNull(res) ? [] : res.map(e => {
                        return {
                            children: [],
                            label: e.sv_pc_name,
                            value: e.productcategory_id
                        }
                    });
                    this.categoryIdList = this.categoryId === -1 ? (this.cascader.options.length > 0 ? [this.cascader.options[0].value] : []) : [this.categoryId]
                }
            });
        },
        handleExpand(obj) {                                         // 点击cascader联级选择器
            let { item, value } = obj;
            let num = item.options.findIndex(e => e.value === value);
            if (this.$app.isNull(item.options[num].children)) {
                // 获取二级分类数据
                stockApi.getSecondCategory({ cid: value }).then(res => {
                    if (res.succeed) {
                        let children = this.$app.isNull(res.values) ? [] : res.values.map(e => { return { label: e.sv_psc_name, value: e.productsubcategory_id, leaf: true } });
                        if (num > -1) {
                            item.options[num].children = children;
                        }
                    }
                });
            }
        },
        getAutomaticallyGenerateMemberId() {                        // 获取新增临时菜条码
            stockApi.getAutomaticallyGenerateMemberId({ plusone: true }).then(res => {
                if (res.succeed) {
                    this.queryAddCatering.sv_p_barcode = res.values;
                }
            });
        },
        getKitchenPrinterList() {                                   // 获取打印机列表
            stockApi.getKitchenPrinterListV2().then(res => {
                if (this.$app.isNull(res)) return;
                this.printerList = this.$app.isNull(res) ? [] : res.map(e => {
                    return {
                        label: e.sv_printer_name,
                        value: e.sv_printer_id,
                        iscloundprint: e.iscloundprint
                    }
                });
                this.queryAddCatering.sv_printer_id = this.printerList.length > 0 ? this.printerList[0].value : '';
            })
        },
    }
};