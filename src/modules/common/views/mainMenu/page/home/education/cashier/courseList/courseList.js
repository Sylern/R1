import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    name: 'packageList',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            goodsWrapHeight: '',                                // 商品列表的高度
            categoryFirstStatus: false,                         // 新增一级分类弹窗
            firstSelected: 0,                                   // 一级菜单选中
            firstCategory: [],
            queryCourse: {
                keywards: '',
                pc_id: -1,
                pageIndex: 1,                                   // 页码
                pageSize: 20                                    // 每页条数
            },
            courseTotalPage: 0,
            courseList: [],                                     // 课程列表
            iconList: [
                {
                    icon: 'icon-chongzhi',
                    name: '充值',
                    isShow: true,
                    isChecked: true,
                    type: 3,
                    fnName: 82,
                    permission: 'Recharge'
                },
            ],
        }
    },
    computed: {
        ...mapState(['memberInfo'])
    },
    mounted() {
        this.getUserCategorySelects();
        this.getCommonNewAnalysis();
    },
    methods: {
        calcGoodsWrapHeight() {                                     // 计算商品列表的高度
            this.$nextTick(() => {
                this.goodsWrapHeight = this.$refs.courseWrap.offsetHeight - this.$refs.classification.offsetHeight - 8 + 'px';
            })
        },
        handleFirstCategoryAll() {                                  // 一级菜单点击事件-全部
            this.firstSelected = 0;
            this.queryCourse.pc_id = -1;
            this.calcGoodsWrapHeight();
            this.handleReGetCourse();
        },
        handleFirstCategory(item, index) {                          // 分类菜单点击事件
            if (this.firstSelected === index && this.firstSelected !== 0) return;
            this.firstSelected = index;
            this.queryCourse.pc_id = item.id;
            this.handleReGetCourse();
        },
        handleSearch(searchText) {
            this.firstSelected = 0;
            this.handleReGetCourse(searchText);
        },
        firstAddBack() {                                            // 新增分类回调
            this.firstSelected++;
            this.getFirstCategory();
        },
        coursePageLast() {
            if (this.queryCourse.pageIndex === 1) return;
            this.queryCourse.pageIndex--;
            this.getCommonNewAnalysis();
        },
        coursePageNext() {
            if (this.queryCourse.pageIndex === this.courseTotalPage) return;
            this.queryCourse.pageIndex++;
            this.getCommonNewAnalysis();
        },
        handleReGetCourse(searchText) {
            this.queryCourse.pageIndex = 1;
            this.getCommonNewAnalysis(searchText);
        },
        addCart(event, courseItem) {                                // 添加购物车
            this.$emit('handleToCart', { event, courseItem });
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
        //#region 数据请求
        getCommonNewAnalysis(searchText) {                          // 获取课程列表
            const query = {
                ...this.queryCourse,
                keywards: this.$app.isNull(searchText) ? this.queryCourse.keywards : searchText
            }
            stockApi.getCommonNewAnalysis(query).then(res => {
                if (res) {
                    this.courseList = this.$app.isNull(res.list) ? [] : res.list;
                    this.courseTotalPage = res.total;
                    this.$nextTick(() => {
                        !!this.$refs.listWrap && this.$refs.listWrap.update();
                    });
                }
            });
        },
        getUserCategorySelects() {                                  // 获取商品分类
            stockApi.getUserCategorySelects({ sv_is_cashier: true }).then(res => {
                if (res) {
                    this.firstCategory = this.$app.isNull(res) ? [] : res;
                    this.calcGoodsWrapHeight();
                }
            });
        },
        //#endregion
    }
};