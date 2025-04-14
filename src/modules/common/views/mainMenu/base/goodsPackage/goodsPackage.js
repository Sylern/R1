import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
import numberChange from '../numberChange/numberChange.vue';
export default {
    name: 'goodsPackage',
    components: { numberChange },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        goodsId: {
            type: Number,
            default: 0
        },
        isCurrentPrice: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            mianMaxSelected: 3,
            selectedList: [],                       // 已选套餐内主商品
            packageTitle: '',
            goodsInfo: {
                unitprice: ''
            },
            dataList: [],
            showSelectedStatus: false,              // 选择口味弹窗
            currentChild: {                         // 当前选择子商品
                id: 0,
                showCancle: false,
                index: null,
                pos: null,
                goodsName: '',                      // 商品名称
                goodsImg: '',                       // 商品图片
                barcode: '',                        // 商品条码
            },
            specIds: [],                            // 已选规格
            specInfoList: [],                       // 规格列表
            chargingIds: [],                        // 已选加料
            chargingInfoList: [],                   // 加料列表
            tasteIds: [],                           // 已选口味
            groupingTasteList: [],                  // 口味数据带分组

            currentPriceStatus: false,              // 改时价弹窗
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
        requireSelected() {
            // 有必选未选
            let flag = false, tips = '';
            this.dataList.some(e => {
                e.packageproduct_list.some(k => {
                    if (k.is_required && !k.selected && !flag) {
                        flag = true;
                        tips = '必选菜品' + k.sv_p_name + '未选';
                    }
                })
                if (e.packageproduct_list.filter(k => k.selected).length < e.maxSelect && !flag) {
                    flag = true;
                    tips = e.name + '：' + e.count + '未选' + e.maxSelect;
                }
            })
            return {
                unSelected: flag,
                tips: tips
            }
        },
        requireTaste() {
            // 有必选口味未选
            let flag = false;
            this.groupingTasteList.forEach(e => {
                if (e.sv_is_mandatory && e.tasteList.filter(k => k.selected).length < 1) {
                    // 是必选分组 且 有未选择口味
                    flag = true;
                }
            })
            return flag
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataInit();
                    this.getProductPackageDetail();
                    this.$nextTick(() => {
                        this.$refs.goodsPackage.focus();
                    })
                }
            }
        },
        showSelectedStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataTasteInit();
                    this.getProductDetail_Charging();
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        dataInit() {                                                // 初始化数据
            this.selectedList = [];
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'goodsPackage');
            this.$root.$emit('restaurant', 'goodsPackage');
        },
        handleMain(item, index, data, pos) {                        // 选择主菜
            let currentSelectNum = item.packageproduct_list.filter(e => e.selected).length;        // 当前分组已选数量
            if (!data.selected && currentSelectNum === item.maxSelect) return this.$message.warning(item.name + '：已选' + currentSelectNum);
            if (data.is_open) {
                // 弹出选择口味
                this.currentChild = {
                    id: data.product_list_id,
                    showCancle: !data.is_required && data.selected,
                    index,
                    pos
                }
                this.specIds = JSON.parse(JSON.stringify(data.specIds));
                this.chargingIds = JSON.parse(JSON.stringify(data.chargingIds));
                this.tasteIds = JSON.parse(JSON.stringify(data.tasteIds));
                this.showSelectedStatus = true;
                return
            }
            if (data.is_required && data.selected) return this.$message.warning(data.sv_p_name + '为必选');
            data.selected = !data.selected;
        },
        dataTasteInit() {                                           // 初始化口味加料数据
            this.specInfoList = [];
            this.chargingInfoList = [];
            this.groupingTasteList = [];
        },
        handleChangeSpec(item) {                                    // 选择规格
            this.specIds = [];
            this.specIds.push(item.id);
        },
        handleChangecharging(item) {                                // 选择加料
            if (this.chargingIds.filter(e => e === item.id).length > 0) {
                this.chargingIds.removeByIndex(this.chargingIds.findIndex(e => e.id === item.id));
                return
            }
            // this.chargingIds.push({ id: item.id, name: item.name, price: item.price });
            this.chargingIds.push(item.id);
        },
        handleChangleTaste(item, data) {                            // 选择口味
            let hasSelected = item.tasteList.filter(e => e.selected).length;
            if (item.sv_max_options > 0 && item.sv_max_options === hasSelected && !data.selected) return this.$message.warning(item.sv_tastegroup_name + '超过可选数');
            data.selected = !data.selected;
            if (!data.selected) {
                this.tasteIds.removeByIndex(this.tasteIds.findIndex(e => e === data.id));
                return
            }
            this.tasteIds.push(data.id);
        },
        popHandleCancle() {                                         // 套餐加料取消选择
            this.showSelectedStatus = false;
            let index = this.currentChild.index, pos = this.currentChild.pos;
            this.dataList[index].packageproduct_list[pos].specIds = [];
            this.dataList[index].packageproduct_list[pos].chargingIds = [];
            this.dataList[index].packageproduct_list[pos].tasteIds = [];
            this.dataList[index].packageproduct_list[pos].selected = false;
        },
        popHandleSure() {                                           // 套餐加料确定
            if (this.requireTaste) return this.$message.warning('请选择必选口味');
            this.showSelectedStatus = false;
            let index = this.currentChild.index, pos = this.currentChild.pos;
            this.dataList[index].packageproduct_list[pos].specIds = JSON.parse(JSON.stringify(this.specIds));
            this.dataList[index].packageproduct_list[pos].chargingIds = JSON.parse(JSON.stringify(this.chargingIds));
            this.dataList[index].packageproduct_list[pos].tasteIds = JSON.parse(JSON.stringify(this.tasteIds));
            this.dataList[index].packageproduct_list[pos].selected = true;
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
        handleSure() {                                              // 确定按钮点击事件
            // let dataFilter = this.carttingData.productResults.filter(e => e.productId == this.goodsItem.product_id);
            // let pNumber = dataFilter.length > 0 ? parseInt(dataFilter[0].number) + parseInt(this.numberText) : parseInt(this.numberText);
            // let dealPrice = dataFilter.length > 0 ? dataFilter[0].dealPrice : this.goodsItem.sv_p_unitprice;
            if (this.requireSelected.unSelected) return this.$message.warning(this.requireSelected.tips);
            this.$root.$emit('showCatting');
            let packageGroups = [];
            this.dataList.forEach(e => {
                let item = {
                    id: e.id,
                    products: e.packageproduct_list.filter(e => e.selected).map(k => {
                        return {
                            productId: k.product_list_id,
                            specIds: k.specIds,
                            chargingIds: k.chargingIds,
                            tasteIds: k.tasteIds
                        }
                    })
                }
                packageGroups.push(item)
            });
            let goodsItem = {
                product_id: this.goodsInfo.id,
                sv_p_name: this.goodsInfo.sv_p_name,
                number: 1,
                isPackage: true,
                currentDealPrice: this.goodsInfo.sv_p_unitprice,
                packageGroups: packageGroups
            }
            if (this.isCurrentPrice) {
                this.currentPriceItem = goodsItem;
                return this.currentPriceStatus = true
            }
            this.$emit('handleSure', goodsItem);
            this.closeDialog();
        },
        moneyEdit(val) {                                        // 弹窗修改金额返回
            this.currentPriceItem.productChangePrice = val;
            this.$emit('handleSure', this.currentPriceItem);
            this.closeDialog();
        },
        getProductPackageDetail() {                                 // 获取商品套餐详情
            if (this.goodsId === 0) return;
            let query = {
                id: this.goodsId
            }
            // stockApi.getProductPackageDetail
            stockApi.GetCateringProductPackageDetail(query).then(res => {
                if (res) {
                    this.goodsInfo = res;
                    this.packageTitle = res.sv_p_name;
                    this.dataList = this.$app.isNull(res.packageproduct_title) ? [] : res.packageproduct_title.map(e => {
                        let list = e.packageproduct_list.map(data => {
                            let selected = (e.count === e.maxSelect && !data.is_open) || (!data.is_open && data.is_required)
                            return {
                                ...data,
                                specIds: [],
                                chargingIds: [],
                                tasteIds: [],
                                selected
                                // selected: this.userInfo.sv_uit_cache_name === 'cache_name_catering' ? false : data.is_required
                                // selected: false
                            }
                        })
                        return {
                            ...e,
                            packageproduct_list: list
                        }
                    })
                    this.$nextTick(() => {
                        !!this.$refs.mianGoods && this.$refs.mianGoods.update()
                    })
                }
            })
        },
        getProductDetail_Charging() {                               // 获取菜品规格、口味
            if (this.currentChild.id === 0) return;
            let query = {
                id: this.currentChild.id
            }
            stockApi.getProductDetail_Charging(query).then(res => {
                if (res) {
                    this.currentChild.goodsName = res.sv_p_name;
                    let imgObj = this.$app.isNull(res.sv_p_images) ? '' : JSON.parse(res.sv_p_images);
                    if(this.$app.isNull(imgObj) || !imgObj[0].code) {
                        this.currentChild.goodsImg = base.frontImgBase + '/images/cashier/noGoodsImg.png';
                    }else{
                        this.currentChild.goodsImg = this.$app.fmtImg(imgObj[0].code)
                    }
                    this.currentChild.barcode = res.sv_p_barcode;
                    this.currentChild.unitprice = res.sv_p_unitprice;
                    this.currentChild.storage = res.sv_p_storage;

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
                                selected: false
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