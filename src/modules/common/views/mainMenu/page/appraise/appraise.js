import base from "@/api/base";
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from "vuex";
import utils from '@/utils/utils';
import numberChange from '../../base/numberChange/numberChange.vue';
const { debounce, throttle } = utils;
export default {
    components: { numberChange },
    name: 'appraise',
    data() {
        return {
            isSubmitting: false,                            // 是否在提交挂单
            searchText: '',                                 // 搜索关键字输入框绑定
            searchKeywords: '',                             // 搜索关键字传组件
            query: {
                category: -1,                               // 一级分类id
                erjicategory: -1,                           // 二级分类id
                isn: '',
                pageSize: 18,
                pageIndex: 1,
                name: '',
                is_sell_clear: true,                                   
                read_morespec: true
            },
            firstSelected: 0,
            secondSelected: 0,
            goodsWrapHeight: '',
            goodsTotal: 0,                                  // 数据页码
            goodsList: [],

            firstCategory: [],
            secondCategory: [],
            appraiseList: [],                               // 估清列表
            numberChangeStatus: false,
            currentItem: {
                product_id: -1
            }
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingData', 'carttingSearchCursor', 'memberInfo', 'couponCountNumber', 'selectedInfo', 'pricingScaleData', 'user_local_data']),
        onlyNumber() {
            return this.currentItem.product_id !== -1 ? this.currentItem.sv_pricing_method !== 1 : true
        }
    },
    watch: {
        
    },
    mounted() {
        this.$refs.searchKeywords.focus();
        this.$root.$on('handleInputFocus', () => {
            this.$nextTick(() => {
                !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
            })
        })
        this.getSelectList();
        this.getFirstCategory();
        this.getGoodsList();
    },
    methods: {
        ...mapMutations(['update']),
        calcGoodsWrapHeight() {                                     // 计算商品列表的高度
            this.$nextTick(() => {
                // console.log(this.$refs.appraiseRight.offsetHeight, this.$refs.classification.offsetHeight);
                this.goodsWrapHeight = this.$refs.appraiseRight.offsetHeight - this.$refs.classification.offsetHeight + 'px';
            })
        },
        handleSearch() {
            this.firstSelected = 0;                                 // 一级菜单置为全部
            this.getGoodsList(true);
            this.calcGoodsWrapHeight();
        },
        handleFirstCategoryAll() {                                  // 一级菜单点击事件-全部
            this.firstSelected = 0;
            this.secondSelected = 0;
            this.query.category = -1;
            this.getGoodsList(true);
            this.calcGoodsWrapHeight();
        },
        handleFirstCategory(item, index) {                          // 一级菜单点击事件
            if (this.firstSelected == index && this.firstSelected != 0) return;
            this.firstSelected = index;
            this.secondSelected = 0;
            this.query.category = item.productcategory_id;
            this.getSecondCategory(item.productcategory_id);
            this.getGoodsList(true);
        },
        handleSecondCategoryAll() {                                 // 二级菜单点击事件-全部
            if (this.secondSelected == 0) return;
            this.secondSelected = 0;
            this.getGoodsList(true);
            this.calcGoodsWrapHeight();
        },
        handleSecondCategory(item, index) {                         // 二级菜单点击事件
            this.searchKeywords = this.searchText;
            if (this.secondSelected == index) return;
            this.secondSelected = index;
            this.getGoodsList(true);
        },
        handleGoodsItem(goodsItem) {
            this.numberChangeStatus = true;
            this.currentItem = goodsItem;
        },
        handleNumberChange(number) {                                // 估清数量
            stockApi.operateProductExtend({
                product_id: this.currentItem.product_id,
                // ...this.currentItem,
                sv_is_select: true,
                sv_select_remaining: parseFloat(number),
                sv_select_count: parseFloat(number),
            }).then(res => {
                if (res.succeed) {
                    this.currentItem.product_id = -1;
                    this.$message.success('操作成功')
                    this.$nextTick(() => {
                        !!this.$refs.cartList && this.$refs.cartList.update();
                    })
                    this.getSelectList();
                    this.getGoodsList();
                }
            });
        },
        handleCancel(item) {                                        // 取消估清
            this.$confirm('是否取消估清?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stockApi.operateProductExtend({
                    product_id: item.product_id,
                    // ...this.currentItem,
                    sv_is_select: false,
                    sv_select_remaining: 0,
                    sv_select_count: 0,
                }).then(res => {
                    if (res.succeed) {
                        this.$message.success('操作成功')
                        this.$nextTick(() => {
                            !!this.$refs.cartList && this.$refs.cartList.update();
                        })
                        this.getSelectList();
                        this.getGoodsList();
                    }
                });
            }).catch(() => {
                
            });
        },
        handleCancelAdd() {
            if (this.appraiseList.length < 1) return
            this.$confirm('是否取消全部估清?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stockApi.clearProductExtend().then(res => {
                    if (res) {
                        this.$message.success('操作成功')
                        this.$nextTick(() => {
                            !!this.$refs.cartList && this.$refs.cartList.update();
                        })
                        this.getSelectList();
                        this.getGoodsList();
                    }
                });
            }).catch(() => {
                
            });
        },
        //#region 
        getSelectList() {                                           // 获取估清列表
            stockApi.getSelectList().then(res => {
                if (res.succeed) {
                    this.appraiseList = this.$app.isNull(res.values) ? [] : res.values;
                }
            });
        },
        getFirstCategory() {                                        // 获取商品一级分类
            stockApi.getFirstCategory().then(res => {
                if (res) {
                    this.firstCategory = this.$app.isNull(res.values) ? [] : res.values;
                    this.calcGoodsWrapHeight();
                }
            });
        },
        getSecondCategory(_id) {                                    // 获取商品二级分类
            stockApi.getSecondCategory({ cid: _id }).then(res => {
                if (res.succeed) {
                    this.secondCategory = this.$app.isNull(res.values) ? [] : res.values;
                    this.calcGoodsWrapHeight();
                }
            });
        },
        getGoodsList(initSearch) {                                  //  获取商品数据
            if (initSearch) {
                this.query.pageIndex = 1;
                this.query.name = this.searchKeywords;
                this.query.isn = this.searchKeywords;
            }
            if (this.isCommon) {
                stockApi.getProductCashierList(this.query).then(res => {
                    if (res) {
                        this.goodsList = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                            let imgObj = JSON.parse(e.sv_p_images);
                            if (this.$app.isNull(imgObj) || imgObj[0].code){
                                e.goodsImg = base.frontImgBase + '/images/cashier/noGoodsImg.png'
                            }else{
                                e.goodsImg = this.$app.fmtImg(imgObj[0].code)
                            }
                            return e
                        });
                        this.goodsTotal = res.total;
                    }
                });
            } else {
                stockApi.getProductCashierCateringList(this.query).then(res => {
                    if (res) {
                        this.goodsList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                            let imgObj = JSON.parse(e.sv_p_images);
                            if (this.$app.isNull(imgObj) || imgObj[0].code){
                                e.goodsImg = base.frontImgBase + '/images/cashier/noGoodsImg.png'
                            }else{
                                e.goodsImg = this.$app.fmtImg(imgObj[0].code)
                            }
                            return e
                        });
                        this.goodsTotal = res.pageCount;
                        this.$nextTick(() => {
                            !!this.$refs.listWrap && this.$refs.listWrap.update();
                            this.searchKeywords = '';
                        })
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
    }
};