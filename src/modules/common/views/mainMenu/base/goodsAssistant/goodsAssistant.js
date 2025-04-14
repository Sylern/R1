import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    name: 'goodsAssistant',
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        popAssistant: {
            type: Object,
            default: () => {
                return {
                    sv_employee_id: 0,
                    sv_employee_name: '',
                    sv_employee_number: '',
                    sv_employee_photo: '',
                    sv_grouping_id: null
                }
            }
        },
    },
    data() {
        return {
            isShowMutiPrice: false,             // 是否展示多价格
            isShowMultiSpec: false,             // 是否展示多规格
            mainIndex: -1,                      // 技能序号
            subIndex: -1,                       // 模式序号
            defaultGoodsImg: '',                // 默认商品图
            specGoodsList: [],                  // 规格商品列表
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingData', 'cashierJurisdiction']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        goodsImg() {
            return this.$app.isNull(this.popAssistant.sv_employee_photo) ? '' : (stockApi.imgBase() + this.popAssistant.sv_employee_photo)
        },
        currentPrice() {
            if (this.priceList.length === 0) {
                return {
                    name: '',
                    value: ''
                }
            }
            return this.priceList[this.multiPricePos]
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataInit();
                    this.getTutorProductByEmployeeId();
                    this.$nextTick(() => {
                        this.$refs.goodsAssistant.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        ...mapActions(['addToCartting']),
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                default:
                    console.log('goodsAssistant key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
        },
        handlePrevent(e) {                                          // 事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleEnter();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        dataInit() {                                                // 初始化数据
            this.mainIndex = -1;
            this.subIndex = -1;
            this.specGoodsList = [];
        },
        handleMain(item, index) {
            if (this.mainIndex === index) return
            this.mainIndex = index;
            if (this.specGoodsList[this.mainIndex].pr_list.length > 0) this.subIndex = 0;
        },
        handleSub(item, index) {
            if (this.subIndex === index) return
            this.subIndex = index;
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
        handleSure() {                                              // 确定按钮点击事件
            if (this.subIndex === -1) return
            const goodsItem = this.specGoodsList[this.mainIndex].pr_list[this.subIndex];
            let dataArray = JSON.parse(JSON.stringify(this.carttingData.productResults));
            let addItem = {
                productId: goodsItem.product_id,
                number: 1,
                // billabletime: {
                //     dateTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                //     duration: 0,
                //     code: goodsItem.billable_id
                // },
                attachData: {
                    sv_employee_photo: this.popAssistant.sv_employee_photo,
                    sv_employee_id: this.popAssistant.sv_employee_id,
                    sv_employee_name: this.popAssistant.sv_employee_name,
                    sv_employee_number: this.popAssistant.sv_employee_number,
                    billable_id: goodsItem.billable_id,
                    sv_p_name: this.specGoodsList[this.mainIndex].sv_p_name +'  '+ goodsItem.sv_p_name,
                },
                tastes: [],
                chargings: [],
                specs: [],
                appraiseNumber: null,
                productChangePrice: 0,
                packageGroups: null,
                promotionType: 'clickAdd',
                remark: ''
            }
            const concat_industry_List = [1, 6];                // 1-美业  6-棋牌  添加商品购物车顺序叠加
            if (concat_industry_List.includes(this.userInfo.sv_us_industrytype)) {
                dataArray.push(addItem);
            } else {
                dataArray.unshift(addItem);
            }
            this.$root.$emit('showCatting');
            this.addToCartting(dataArray);
            this.closeDialog();
        },
        getTutorProductByEmployeeId() {                             // 获取艺人技能详情
            if (this.popAssistant.employee_id === 0) return;
            let query = {
                employee_id: this.popAssistant.sv_employee_id,
            }
            stockApi.getTutorProductByEmployeeId(query).then(res => {
                if (res) {
                    this.specGoodsList = res;
                    if (this.specGoodsList.length > 0) {
                        this.mainIndex = 0;
                        if (this.specGoodsList[this.mainIndex].pr_list.length > 0) this.subIndex = 0;
                    }
                    this.$nextTick(() => {
                        !!this.$refs.multiSpecWrap && this.$refs.multiSpecWrap.update();
                    })
                }
            })
        },
    }
};