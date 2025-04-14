import { stockApi, basicApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
import utils from '@/utils/utils';
import popCashmoney from '../popCashmoney/popCashmoney.vue';
import goodsItem from '../goodsItem/goodsItem.vue';
import moreFuncEntry from '../moreFuncEntry/moreFuncEntry.vue';
import memberRecharge from '..//../base/memberRecharge/memberRecharge.vue';
const { debounce, throttle } = utils;
export default {
    name: 'goodsList',
    components: { popCashmoney, goodsItem, moreFuncEntry, memberRecharge },
    props: {
        categoryId: {                           // 一级分类id
            type: Number,
            default: -1
        },
        erjicategory: {                       // 二级分类id
            type: Number,
            default: -1
        },
        isReturn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const showKouci = this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_pleasure_ground' || this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_cosmetology';
        return {
            s: null,                            // 加入购物车计时器
            isShowCash: false,
            query: {
                category: -1,                   // 一级分类id
                erjicategory: -1,               // 二级分类id
                producttype_id: -1,             // 旧版非餐饮二级分类
                isn: '',
                pageSize: 12,
                pageIndex: 1,
                name: '',
                is_mp: false,
                read_morespec: true
            },
            goodsTotal: 0,                      // 数据页码
            goodsList: [],

            categoryIdList: [],                             // 临时菜商品分类
            queryAddCatering: {
                sv_p_barcode: '',
                sv_p_name: '',
                sv_p_unitprice: '',                         // 
                productcategory_id: 0,                      // 商品一级分类
                productsubcategory_id: 0,                   // 商品二级分类
                sv_printer_id: null
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
                }],
                sv_p_unitprice: [{
                    required: true,
                    message: '请输入销售价格',
                    trigger: ['blur']
                }]
            },

            ballAnimation: '',
            systemInfo: {},
            animationImg: '',
            funcEntryStatus: false,
            memberRechargeStatus: false,
            iconList: [
                {
                    icon: 'icon-tuihuo',
                    name: '退货',
                    isShow: false,
                    isChecked: false,
                    type: 3,
                    fnName: ''
                },
                {
                    icon: 'icon-huanhuo',
                    name: '换货',
                    isShow: false,
                    isChecked: false,
                    type: 3,
                    fnName: ''
                },
                {
                    icon: 'icon-hexiao',
                    name: '核销',
                    isShow: false,
                    isChecked: false,
                    type: 3,
                    fnName: ''
                },
                {
                    icon: 'icon-chongzhi',
                    name: '充值',
                    isShow: true,
                    isChecked: false,
                    type: 0,
                    fnName: 'showMemberRecharge'
                },
                {
                    icon: 'icon-shoukuan',
                    name: '无码收银',
                    isShow: true,
                    isChecked: false,
                    type: 3,
                    fnName: 75                              // K键值
                },
                {
                    icon: 'icon-goucika',
                    name: '购买次卡',
                    isShow: true,
                    isChecked: showKouci ? true : false,
                    type: 1,
                    fnName: '/memberCenter/card/purchaseTimesCard',
                },
                {
                    icon: 'icon-kehujicun',
                    name: '寄存/领取',
                    isShow: true,
                    isChecked: false,
                    type: 1,
                    fnName: '/cashier/deposit',
                },
                {
                    icon: 'icon-kuaijiejian',
                    name: '快捷键',
                    isShow: true,
                    isChecked: false,
                    noCheckIcon: true,
                    type: 3,
                    fnName: 122                             // F11
                },
                {
                    icon: 'icon-daohang',
                    name: '自定义菜单',
                    isShow: false,
                    isChecked: false,
                    noCheckIcon: true,
                    type: 1,
                    fnName: 'moreFunc',
                }
            ],
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingData', 'memberInfo', 'cashierJurisdiction', 'user_local_data']),
        goodsListShowType() {
            return this.user_local_data.goodsListShowType
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
        isCommon() {
            // 27 餐饮 
            return this.userInfo.sv_us_industrytype != 27
        }
    },
    watch: {
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
                this.query.producttype_id = -1;
                this.query.erjicategory = -1;
            }
        },
        erjicategory: {                                       // 二级分类id
            handler(newVal, oldVal) {
                if (this.isCommon) {
                    this.query.producttype_id = this.erjicategory;
                } else {
                    this.query.erjicategory = this.erjicategory;
                }
            }
        },
    },
    mounted() {
        this.query.pageSize = this.goodsListShowType === 1 ? 24 : 45;
        this.query.category = this.categoryId;
        if (this.isCommon) {
            this.query.producttype_id = this.erjicategory;
        } else {
            this.query.erjicategory = this.erjicategory;
        }
        // this.getUserCoutnt();
        this.getGoodsList();
        this.syncFuncIcon();
        this.$root.$on('refreshGoodsList', this.refreshGoodsList);
    },
    beforeDestroy() {
        this.$root.$off('refreshGoodsList', this.refreshGoodsList);
    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData', 'updateCashmoney']),
        refreshGoodsList() {
            this.getGoodsList(true);
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
                        this.$app.setLocalStorage('user_Info', JSON.stringify(data));           // 用户信息
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
                sv_printer_id: null
            }
        },
        syncFuncIcon() {                                            // 默认开启更多功能按键
            this.iconList.forEach(item => {
                let keyIndex = this.user_local_data.iconCheckList.findIndex(e => e.keyName === item.name);
                if (keyIndex > -1) {
                    item.isChecked = this.user_local_data.iconCheckList[keyIndex].isChecked ? true : false;
                } else {
                    if (item.name === '充值' || item.name === '无码收银') {
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
        handleOrderList() {
            this.$router.push('orderList');
        },
        showGoodsAdd() {                                            // 显示新增商品弹窗 F2
            this.$root.$emit('keyCode', 113);
        },
        showMemberRecharge() {
            this.memberRechargeStatus = true;
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
                this.$root.$emit('keyCode', item.fnName);
                return
            }
        },
        handleInputAdd({ target }) {                                   // 输入框输入内容执行
            target.value = this.$app.verifyNumberDecimal(target.value);
        },
        searchGoodsList(searchText) {
            this.query.pageIndex = 1;
            this.query.name = searchText;
            this.query.isn = searchText;
            this.query.category = -1;
            this.query.erjicategory = -1;
            this.getGoodsList();
        },
        getGoodsList(initSearch) {                                  //  获取商品数据
            if (initSearch) {
                this.query.pageIndex = 1;
                this.query.name = '';
                this.query.isn = '';
            }
            if (this.isCommon) {
                stockApi.getProductPcCashierList(this.query).then(res => {
                    if (res.succeed && !this.$app.isNull(res.values)) {
                        this.goodsList = this.$app.isNull(res.values.list) ? [] : res.values.list;
                        this.goodsTotal = res.values.total;
                        if (this.query.name != '' && this.query.pageIndex == 1 && this.goodsList.length == 1) {
                            this.$nextTick(() => {
                                this.$refs.goodsItem[0].handleGoodsItem()
                            })
                        }
                    }
                });
            } else {
                stockApi.getProductCashierCateringList(this.query).then(res => {
                    if (res) {
                        this.goodsList = this.$app.isNull(res.dataList) ? [] : res.dataList;
                        this.goodsTotal = res.pageCount;
                        if (this.query.name != '' && this.query.pageIndex == 1 && this.goodsList.length == 1) {
                            this.$nextTick(() => {
                                this.$refs.goodsItem[0].handleGoodsItem()
                            })
                        }
                    }
                });
            }
        },
        pageLast() {
            if (this.query.pageIndex === 1) return;
            this.query.pageIndex--;
            this.pageChange();
        },
        pageNext() {
            if (this.query.pageIndex === this.goodsTotal) return;
            this.query.pageIndex++;
            // this.getGoodsList();
            this.pageChange();
        },
        pageChange: debounce('getGoodsList', 200),

        handleGoodsToCart(goodsItem) {                              // 添加商品数据到购物车
            let dataObj = {
                ...goodsItem,
                dealPrice: this.$app.moneyFixed(goodsItem.currentDealPrice, 2),
                dealMoney: this.$app.moneyFixed(goodsItem.currentDealPrice, 2)
            }
            this.$emit('handleGoodsList', dataObj)
        },
        addCart(e, goodsItem) {                                     // 添加购物车
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

    }
};