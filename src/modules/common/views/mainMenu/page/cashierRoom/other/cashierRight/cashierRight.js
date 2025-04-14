import { stockApi } from "@/api/index.js";
import { mapGetters, mapMutations } from "vuex";
import goodsList from '@/modules/common/views/common/base/goodsList/goodsList.vue';
import categoryFirstAdd from '@/modules/common/views/common/base/categoryFirstAdd/categoryFirstAdd.vue';
import categorySecondAdd from '@/modules/common/views/common/base/categorySecondAdd/categorySecondAdd.vue';
export default {
    components: { goodsList, categoryFirstAdd, categorySecondAdd },
    name: 'cashierRight',
    props: {
        propsProducttype: {
            type: String,
            default:  '-1'
        }
    },
    data() {
        return {
            categoryFirstStatus: false,                         // 新增一级分类弹窗
            categorySecondStatus: false,                        // 新增二级分类弹窗
            topBtnType: [                                       // 顶部按钮
                {
                    icon: 'icon-shangpinliebiao',
                    name: '卖品',
                    type: '0,2'
                },
                {
                    icon: 'icon-xiangmuliebiao',
                    name: '项目',
                    type: '1'
                },
                // {
                //     icon: 'icon-huiyuan1',
                //     name: '艺人',
                //     type: '5',
                // },
                // {
                //     icon: 'icon-goucika',
                //     name: '售卡',
                //     type: 'fn',
                //     url: '/cashier/cardRecharge'
                // },
                // {
                //     icon: 'icon-yuyue',
                //     name: '预约',
                //     type: 'fn',
                //     url: '/reservation/kanban'
                // },
            ],
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

            tipsNum: 0,                                         // 消息提示数量
            showPopStoreCard: false,
            updateRemarkVisible: false,
            updateRemark: ''
        }
    },
    computed: {
        ...mapGetters(['hasProgramAssistant']),
        imgBase() {
            return stockApi.imgBase()
        },
    },
    watch: {

    },
    mounted() {
        if (this.hasProgramAssistant) {
            this.topBtnType.push({
                icon: 'icon-huiyuan1',
                name: '艺人',
                type: '5',
            })
        }
        this.getFirstCategory();
    },
    methods: {
        ...mapMutations(['touchCarttingCursor']),
        //#endregion
        handleSearch() {
            this.firstSelected = 0;                                 // 一级菜单置为全部
            this.$refs.goodsList.searchGoodsList();
        },
        showCategoryFirst() {                                       // 显示新增一级分类
            this.categoryFirstStatus = true;
        },
        showCategorySecond() {                                      // 显示新增二级分类
            this.categorySecondStatus = true;
        },
        handleTopBtn(item) {
            if (this.propsProducttype === item.type) return
            if (item.type === 'fn') {
                this.$router.push(item.url);
            } else {
                this.propsProducttype = item.type;
                if (this.propsProducttype === '5') {
                    this.getGoodsList();
                    return
                }
                this.getFirstCategory();
                this.handleFirstCategoryAll();
            }
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
                this.$refs.goodsList && this.$refs.goodsList.searchGoodsList();
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
            this.getGoodsList();
        },
        getGoodsList() {
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
            this.getGoodsList();
        },
        handleSecondCategory(item, index) {                         // 二级菜单点击事件
            this.searchKeywords = this.searchText;
            if (this.secondSelected == index) return;
            this.secondSelected = index;
            this.secondSelectedItem = {
                id: item.productsubcategory_id,
                label: item.sv_psc_name
            };
            this.getGoodsList();
        },
        searchGoodsList(text) {
            this.$nextTick(() => {
                this.$refs.goodsList.searchGoodsList(text);
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
            stockApi.getFirstCategory({ is_cashier: true, producttype: this.propsProducttype }).then(res => {
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
    }
};