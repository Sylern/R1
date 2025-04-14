import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    name: 'goodsMoreInfo',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        cateringInfo: {
            type: Object,
            default: () => {
                return {
                    id: 0,
                    number: 1,
                    remark: '',
                    waittingStatus: false
                }
            }
        },
        goodsId: {
            type: Number,
            default: 0
        },
        appraiseNumber: {
            type: Number,
            default: null
        },
        goodsNumber: {
            type: Number,
            default: 1
        },
        goodsRemark: {
            type: String,
            default: ''
        },
        cateringData: {
            type: Object,
            default: () => {
                return {
                    specs: [],
                    chargings: [],
                    tastes: []
                }
            }
        }
    },
    data() {
        return {
            numberText: 1,
            goodsInfo: {
                goodsName: '',                  // 商品名称
                producttype_id: 0,              // 商品类型  0-普通商品
                goodsImg: '',                   // 商品图片
                barcode: '',                    // 商品条码
                unitprice: 0,                   // 零售价
                storage: 0,                     // 库存
                remark: '',
                waittingStatus: false
            },
            needShowMoreInfo: false,            // 未添加口味及临时菜不展示口味加料
            specIds: [],                        // 已选规格
            specInfoList: [],                   // 规格列表
            chargingIds: [],                    // 已选加料
            chargingInfoList: [],               // 加料列表
            tasteIds: [],                       // 已选口味
            groupingTasteList: [],              // 口味数据带分组
        }
    },
    computed: {
        ...mapState(['carttingData', 'cashierJurisdiction', 'isLightMeal']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        noGoodsImg() {
            return base.frontImgBase + '/images/cashier/noGoodsImg.png'
        },
        requireTaste() {
            // 是否有必选口味未选
            let flag = false;
            this.groupingTasteList.forEach(e => {
                if (e.sv_is_mandatory && e.tasteList.filter(k => k.selected).length < 1) {
                    // 是必选分组 且 有未选择口味
                    flag = true;
                }
            })
            return flag
        },
        priceTotal() {
            let specPrice = 0;
            this.specIds.forEach(e => {
                specPrice = this.$app.addNumber(specPrice, e.price);
            });
            let chargingPrice = 0;
            this.chargingIds.forEach(e => {
                chargingPrice = this.$app.addNumber(chargingPrice, e.price);
            });
            let tastePrice = 0;
            this.tasteIds.forEach(e => {
                tastePrice = this.$app.addNumber(tastePrice, e.price);
            });
            let baseMoney = (specPrice > 0 ? specPrice : this.goodsInfo.unitprice) + chargingPrice + tastePrice;
            return this.$app.moneyFixed(this.$app.multiplyNumber(baseMoney, this.numberText))
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataInit();
                    this.getProductDetail_Charging();
                    this.$nextTick(() => {
                        this.$refs.cateringMore.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        dataInit() {                                                // 初始化数据
            this.numberText = this.cateringInfo.number;
            this.goodsInfo.remark = this.cateringInfo.remark;
            this.goodsInfo.waittingStatus = this.cateringInfo.waittingStatus;
            this.specIds = JSON.parse(JSON.stringify(this.cateringData.specs));
            this.chargingIds = JSON.parse(JSON.stringify(this.cateringData.chargings));
            this.tasteIds = JSON.parse(JSON.stringify(this.cateringData.tastes));

            this.specInfoList = [];
            this.chargingInfoList = [];
            this.groupingTasteList = [];
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('restaurant', 'cateringMore');
        },
        handleSure() {                                              // 确定按钮点击事件
            // let dataFilter = this.carttingData.productResults.filter(e => e.productId == this.goodsItem.product_id);
            // let pNumber = dataFilter.length > 0 ? parseInt(dataFilter[0].number) + parseInt(this.numberText) : parseInt(this.numberText);
            // let dealPrice = dataFilter.length > 0 ? dataFilter[0].dealPrice : this.goodsItem.sv_p_unitprice;
            if (this.requireTaste) return this.$message.warning('请选择必选口味');
            this.$root.$emit('showCatting');
            let goodsItem = {
                product_id: this.cateringInfo.id,
                sv_p_name: this.goodsInfo.goodsName,
                producttype_id: this.goodsInfo.producttype_id,
                sv_p_storage: this.goodsInfo.storage,
                sv_p_barcode: this.goodsInfo.barcode,
                number: this.numberText,
                remark: this.goodsInfo.remark,
                tastes: [...this.tasteIds.map(e => { return e.id })],
                tasteIds: this.tasteIds,
                chargings: [...this.chargingIds.map(e => { return e.id })],
                chargingIds: this.chargingIds,
                specs: [...this.specIds.map(e => { return e.id })],
                specIds: this.specIds,
                sv_p_unitprice: this.goodsInfo.unitprice,
                dealPrice: this.goodsInfo.unitprice,
                currentDealPrice: this.$app.divideNumber(parseFloat(this.priceTotal), this.numberText),
                couponMoney: 0,
                waittingStatus: this.goodsInfo.waittingStatus,
                appraiseNumber: this.appraiseNumber,
                dealMoney: this.$app.multiplyNumber(this.goodsInfo.unitprice, this.numberText)
            }
            this.$emit('handleSure', goodsItem);
            this.closeDialog();
        },
        handleNumberChange() {

        },
        handleSubtract() {                                          // 减数量
            if (this.numberText < 1) return;
            this.numberText--;
        },
        handleAdd() {                                               // 加数量
            // if (this.numberText > goodsInfo.storage - 1 && !this.cashierJurisdiction.ZeroInventorySales) return this.$message.warning('库存不足');
            this.numberText++;
        },
        handleChangeSpec(item) {                                    // 选择规格
            this.specIds = [];
            let data = {
                id: item.id,
                name: item.name,
                price: item.price
            }
            this.specIds.push(data);
        },
        handleChangecharging(item) {                                // 选择加料
            if (this.chargingIds.filter(e => e.id === item.id).length > 0) {
                this.chargingIds.removeByIndex(this.chargingIds.findIndex(e => e.id === item.id));
                return
            }
            this.chargingIds.push({ id: item.id, name: item.name, price: item.price });
        },
        handleChangleTaste(item, data) {                            // 选择口味
            // if (this.tasteIds.filter(e => e.id === item.id).length > 0) {
            //     this.tasteIds.removeByIndex(this.tasteIds.findIndex(e => e.id === item.id));
            //     return
            // }
            // this.tasteIds.push({ id: item.id, name: item.name, price: item.price });
            let hasSelected = item.tasteList.filter(e => e.selected).length;
            if (item.sv_max_options > 0 && item.sv_max_options === hasSelected && !data.selected) {
                // this.$message.warning(item.sv_tastegroup_name + '超过可选数');
                let firstId = this.tasteIds[0].id;
                item.tasteList.find(e => e.id === firstId).selected = false;
                this.tasteIds.removeByIndex(0);
            }
            data.selected = !data.selected;
            if (!data.selected) {
                this.tasteIds.removeByIndex(this.tasteIds.findIndex(e => e.id === data.id));
                return
            }
            this.tasteIds.push({ id: data.id, name: data.name, price: data.price });
        },
        getProductDetail_Charging() {                               // 获取菜品规格、口味
            if (this.cateringInfo.id === 0) return;
            let query = {
                id: this.cateringInfo.id
            }
            stockApi.getProductDetail_Charging(query).then(res => {
                if (res) {
                    this.goodsInfo.goodsName = res.sv_p_name;
                    this.goodsInfo.producttype_id = res.producttype_id;
                    let imgObj = this.$app.isNull(res.sv_p_images) ? '' : JSON.parse(res.sv_p_images);
                    this.goodsInfo.goodsImg = !this.$app.isNull(imgObj) ?this.$app.fmtImg(imgObj[0].code) : base.frontImgBase + '/images/cashier/noGoodsImg.png';
                    this.goodsInfo.barcode = res.sv_p_barcode;
                    this.goodsInfo.unitprice = res.sv_p_unitprice;
                    this.goodsInfo.storage = this.appraiseNumber || res.sv_p_storage;

                    this.specInfoList = res.specinfolist;                   // 规格列表
                    if (!this.$app.isNull(this.specInfoList)) {
                        // 默认选择第一个规格
                        this.handleChangeSpec(this.specInfoList[0])
                    }
                    this.needShowMoreInfo = res.is_open && !res.sv_is_temp;
                    this.chargingInfoList = res.charginginfolist;           // 加料列表
                    this.groupingTasteList = this.$app.isNull(res.groupingTasteList) ? [] : res.groupingTasteList.map(e => {
                        // 口味数据带分组
                        let tasteList = this.$app.isNull(e.tasteList) ? [] : e.tasteList.map(k => {
                            return {
                                ...k,
                                selected: this.tasteIds.find(t => t.id === k.id) ? true : false
                            }
                        });
                        return {
                            ...e,
                            tasteList: tasteList
                        }
                    });
                    this.$nextTick(() => {
                        !!this.$refs.scrollbar && this.$refs.scrollbar.update();
                    })
                }
            })
        },

    }
};