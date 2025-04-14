import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import cateringMore from '../cateringMore/cateringMore.vue';
import goodsWeight from '../goodsWeight/goodsWeight.vue';
import goodsPackage from '../goodsPackage/goodsPackage.vue';
import priceChange from '../priceChange/priceChange.vue';
import numberChange from '../numberChange/numberChange.vue';
import servicerSetting from '../servicerSetting/servicerSetting.vue';
import servicerWorkstation from '../servicerWorkstation/servicerWorkstation.vue';
export default {
    name: 'carttingCater',
    components: { cateringMore, goodsWeight, goodsPackage, servicerSetting, servicerWorkstation, priceChange, numberChange },
    props: {
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    sv_table_id: null
                }
            }
        },
        popOrderData: {
            type: Object,
            default: () => {
                return {
                    productResults: []
                }
            }
        },
        isOrderList: {
            type: Boolean,
            default: false
        },
        waittingStatus: {
            type: Boolean,
            default: false
        },
        listPos: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            imgBase: stockApi.imgBase(),
            isServicerSingle: false,                        // 是否单选员工，普通商品时
            workerTextList: ['一', '二', '三', '四'],        // 
            servicerSettingStatus: false,                   // 设置服务人员弹窗
            servicerWorkstationStatus: false,               // 设置多工位工位
            timer: null,
            currentPos: -1,
            priceChangeMenuPos: 0,                          // 改价弹窗菜单 0 改价 1 改折
            numberChangeStatus: false,                      // 退菜数量弹窗
            priceChangeStatus: false,
            currentPriceStatus: false,                      // 改时价弹窗

            clickGoodsId: null,
            clickGoodsNumber: null,
            cateringInfo: {
                id: null,
                number: null,
                remark: '',
                waittingStatus: false
            },
            cateringData: {                                 // 规格 口味 加料
                specs: [],
                tastes: [],
                chargings: []
            },
            orderItemHandleStatus: false,                   // 已下单菜品点击弹窗
            cateringMoreStatus: false,                      // 菜品更多编辑
            goodsWeightStatus: false,                       // 称重商品编辑
            goodsWeightItem: {
                isEdit: true,
                id: null,
                number: null,
                remark: ''
            },
            goodsPackageStatus: false,                      // 套餐编辑
            goodsPackageItem: {
                id: null
            },
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData', 'memberInfo']),
        ...mapState('permission', ['CashierManage']),
        orderData: {
            get() { return this.popOrderData; }, set(value) {
                this.$emit('update:popOrderData', JSON.parse(JSON.stringify(value)));
            }
        },
        carttingList() {
            return this.isOrderList ? this.orderData.productResults.filter(e => e.sv_table_id_old === this.tableInfo.sv_table_id) : this.carttingData.productResults
        },
        popCurrentEmployee() {
            if (this.currentPos === -1) {
                return []
            }
            if (this.isOrderList) {
                return this.orderData.productResults[this.currentPos].multCommissions[0]
            }
            return this.carttingData.productResults[this.currentPos].multCommissions[0]
        },
        improtMoney() {
            if (this.currentPos < 0) return '0'
            if (this.isOrderList) {
                if (this.$app.isNull(this.popOrderData.productResults)) return '0'
                return this.popOrderData.productResults[this.currentPos].price
            }
            if (this.$app.isNull(this.carttingData.productResults)) return '0'
            return this.carttingData.productResults[this.currentPos].price
        },
    },
    watch: {
        isOrderList: {
            immediate: true,
            handler(newVal, oldVal) {
                this.currentPos = -1;
                if (newVal) this.takeASingle()
            }
        },
        waittingStatus: {
            handler(newVal, oldVal) {
                this.carttingData.productResults = this.carttingData.productResults.map(e => {
                    return {
                        ...e,
                        waittingStatus: newVal
                    }
                })
            }
        },
        carttingList: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal.length === 0) {
                    this.currentPos = -1;
                    return
                }
                this.$nextTick(() => {
                    if (!!this.$refs.scrollList) {
                        let height = newVal[0].productId === 0 && newVal[0].productId !== oldVal[0].productId ? 0 : this.$refs.scrollList.wrap.scrollHeight;
                        this.$refs.scrollList.update();
                        if (newVal.length > oldVal.length) this.$refs.scrollList.wrap.scrollTop = height
                    }
                })
            }
        },
    },
    mounted() {
        // console.log('orderData, this.orderData);
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'syncCarttingData', 'setGoodsMultCommissions']),
        ...mapActions(['updateCartting', 'requsetMemberInfo']),
        getOrderListPos() {                                     // 获取订单列表选中状态
            return this.isOrderList ? this.currentPos : -1
        },
        orderItemHandleEvent(pos) {                             // 已下单菜单列表，弹窗点击事件
            this.orderItemHandleStatus = false;
            let goodsList = JSON.parse(JSON.stringify(this.orderData.productResults));
            switch (pos) {
                case 1:             // 赠菜
                    goodsList[this.currentPos].productChangePrice = 0;
                    goodsList = goodsList.map((e, i) => {
                        let multiple_provider = [];
                        (e.multiple_provider || []).forEach(ep => {
                            let emArray = []
                            ep.forEach(em => {
                                emArray.push({
                                    e_id: em.e_id,
                                    percent: em.percent
                                })
                            })
                            multiple_provider.push(emArray)
                        })
                        return {
                            ...e,
                            multiple_provider,
                            sv_without_list_id: this.tableInfo.sv_without_list_id,
                            without_project_status: e.without_project_status,
                            without_project_time: e.without_project_time,
                        }
                    })
                    this.takeASingleUpdateCatering(goodsList, '赠送成功');
                    return;
                case 2:             // 移菜
                    this.$emit('caterCallback', 1)
                    return;
                case 3:             // 改价
                    this.handlePriceChange(goodsList[this.currentPos], this.currentPos)
                    return;
                case 4:             // 起菜
                    this.$emit('caterCallback', 2)
                    return;
                case 5:             // 退菜
                    this.$emit('caterCallback', 3)
                    return;
                default:
                    return;
            }
        },
        handleServiceShow(index, goodsType) {                   // 打开员工选择
            this.currentPos = index;
            this.isServicerSingle = goodsType === 1 ? true : false;
            // this.isServicerSingle = true;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.servicerSettingStatus = true;
        },
        handleWorkstationShow(index) {                          // 打开多工位选择
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.servicerWorkstationStatus = true;
        },
        handleWorkstationSubmit(list) {                         // 多工位员工确定回调
            if (this.isOrderList) {
                const productArray = this.orderData.productResults.map((e, i) => {
                    return {
                        ...e,
                        multiple_provider: this.currentPos !== i ? e.multiple_provider : list.map(workerItem => {
                            return workerItem.map(em => {
                                return {
                                    selectedType: em.selectedType,
                                    isAppoint: em.isAppoint,
                                    e_id: em.sv_employee_id,
                                    percent: em.percent
                                }
                            })
                        }),
                        sv_without_list_id: this.tableInfo.sv_without_list_id,
                        without_project_status: e.without_project_status || 0,
                        without_project_start_time: e.without_project_start_time || '',
                        without_project_end_time: e.without_project_end_time || '',
                    }
                })
                this.takeASingleUpdateCatering(productArray);
                return
            }
        },
        handleUpdateStatus(emItem, index, item) {
            if (this.isOrderList) {
                let query = {
                    sv_without_list_id: this.tableInfo.sv_without_list_id,
                    sv_without_product_id: this.orderData.productResults[index].sv_without_product_id,
                    without_project_status: emItem.status + 1,
                    without_project_time: this.$app.currentTime(new Date(), 'HH:mm')
                }
                stockApi.updateWithoutProjectStatus(query).then(res => {
                    emItem.status = emItem.status + 1;
                    emItem.start_time = this.$app.currentTime(new Date(), 'HH:mm');
                    emItem.end_time = res;
                    this.orderData.productResults[index].without_project_status = emItem.status;
                    this.orderData.productResults[index].without_project_start_time = emItem.start_time;
                    this.orderData.productResults[index].without_project_end_time = emItem.end_time;
                })
            } else {
                if (emItem.status === 0) {
                    emItem.status = 1;
                    emItem.start_time = this.$app.currentTime(new Date(), 'HH:mm');
                    emItem.end_time = this.$app.currentTime(new Date(new Date().getTime() + (item.project_time || 60) * 60 * 1000), 'HH:mm');
                } else if (emItem.status === 1) {
                    emItem.status = 2;
                    emItem.end_time = this.$app.currentTime(new Date(), 'HH:mm');
                }
            }
        },
        handleServicerSetting(list) {                           // 选择员工回调
            this.servicerSettingStatus = false;
            if (this.isOrderList) {
                const productArray = this.orderData.productResults.map((e, i) => {
                    return {
                        ...e,
                        multiple_provider: this.currentPos !== i ? e.multiple_provider : [list.map(em => {
                            return {
                                e_id: em.sv_employee_id,
                                percent: em.percent
                            }
                        })],
                        sv_without_list_id: this.tableInfo.sv_without_list_id,
                        without_project_status: e.without_project_status || 0,
                        without_project_start_time: e.without_project_start_time || '',
                        without_project_end_time: e.without_project_end_time || '',
                    }
                })
                this.takeASingleUpdateCatering(productArray);
                return
            }

            this.setGoodsMultCommissions({
                index: this.currentPos,
                list: [list]
            })
        },
        handleServiceDelete(index, item, emIndex) {             // 普通商品移除所选员工
            let currentList = item.multCommissions[0];
            currentList.removeByIndex(emIndex);
            currentList = currentList.map((e, i) => {
                const itemPercent = currentList.length === 1 ? 100 : parseInt(100 / currentList.length);
                const setPercent = i !== currentList.length - 1 ? itemPercent : (100 - itemPercent * (currentList.length - 1));
                return {
                    ...e,
                    percent: setPercent
                }
            })
            if (this.isOrderList) {
                const productArray = this.orderData.productResults.map((e, i) => {
                    return {
                        ...e,
                        multiple_provider: index !== i ? e.multiple_provider : [currentList.map(em => {
                            return {
                                e_id: em.sv_employee_id,
                                percent: em.percent
                            }
                        })],
                        sv_without_list_id: this.tableInfo.sv_without_list_id,
                        without_project_status: e.without_project_status || 0,
                        without_project_start_time: e.without_project_start_time || '',
                        without_project_end_time: e.without_project_end_time || '',
                    }
                })
                this.takeASingleUpdateCatering(productArray);
            }
        },

        takeASingle() {                                         // 取单
            let query = {
                tableId: this.tableInfo.sv_table_id
            }
            stockApi.takeASingle(query).then(res => {
                if (res) {
                    this.$emit('returnWithout_list_id', res.sv_without_list_id);
                    if (this.tableInfo.sv_table_using_state === 4) {
                        // 待接单
                        this.syncCarttingData(res);
                    } else {
                        this.orderData = {
                            ...res,
                            productResults: (res.productResults || []).map((e, i) => {
                                let multCommissions = [];
                                (e.multiple_provider || []).forEach((workerItem) => {
                                    let emArray = [];
                                    workerItem.forEach(em => {
                                        emArray.push({
                                            selectedType: em.selectedType || '',
                                            isAppoint: em.isAppoint || false,
                                            sv_employee_id: em.e_id,
                                            sv_employee_name: em.e_name,
                                            sv_employee_number: em.e_number,
                                            sv_employee_photo: em.e_photo,
                                            grouping_name: em.g_name,
                                            percent: em.percent,
                                            status: e.without_project_status,
                                            start_time: e.without_project_start_time,
                                            end_time: e.without_project_end_time,
                                        })
                                    })
                                    multCommissions.push(emArray)
                                })
                                return {
                                    ...e,
                                    multCommissions: multCommissions.length === 0 ? [[]] : multCommissions
                                }
                            })
                        }
                        this.update({
                            key: 'takeASingleCale3',
                            data: {
                                sv_isbeforehand: res.sv_isbeforehand,
                                tableId: this.tableInfo.sv_table_id,
                                member_id: res.member_id,
                                sv_integral: res.sv_integral,
                                sv_coupon_record_ids: res.sv_coupon_record_ids,
                                sv_employee_ids: res.sv_employee_ids,
                                sv_order_receivable: res.sv_order_receivable,
                                sv_order_actual_money: res.sv_order_actual_money
                            }
                        });
                        if (!this.$app.isNull(res.member_id)) this.requsetMemberInfo(res.member_id);
                    }
                }
            });
        },
        handleItemSelcet(index) {
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
        },
        handleItemSelected(item, index) {                       // 点击商品
            this.currentPos = index;
            if (item.isPricingMethod) {
                // 称重商品
                this.goodsWeightItem = {
                    isEdit: true,
                    id: item.productId,
                    number: item.number,
                    remark: item.remark
                };
                this.goodsWeightStatus = true;
                return
            }
            if (item.isPackage) {
                this.goodsPackageItem = {
                    id: item.productId
                };
                this.goodsPackageStatus = true;
                return
            };
            this.cateringInfo = {
                id: item.productId,
                number: item.number,
                remark: item.remark,
                waittingStatus: item.waittingStatus
            }
            this.clickGoodsId = item.productId;
            this.clickGoodsNumber = item.number;
            this.cateringData = {
                specs: item.specs,
                tastes: item.tastes,
                chargings: item.chargings
            }
            this.cateringMoreStatus = true;
        },
        showkouciFlag(item) {                                   // 是否是扣次
            return this.$app.isNull(item.buyStepPromotion) ? false : item.buyStepPromotion.type === 15
        },
        handleClearKouci(index) {                               // 移除扣次
            let localData = JSON.parse(JSON.stringify(this.carttingData));
            let currentItem = localData.productResults[index];
            let promotionId = currentItem.buyStepPromotion.promotionId;
            currentItem.buyStepPromotion = null;
            if (!this.$app.isNull(promotionId)) {
                this.memberInfo.cardPackageList.forEach(e => {
                    let item = e.list.find(l => l.userecord_id == promotionId);
                    if (item) {
                        item.sv_mcc_leftcount += currentItem.number;
                    }
                })
            }
            this.updateCartting(localData);
        },
        returnGoodsInfo(dataInfo) {                             // 编辑口味回调
            let data = JSON.parse(JSON.stringify(this.carttingData));
            data.productResults[this.currentPos].waittingStatus = dataInfo.waittingStatus;
            data.productResults[this.currentPos].number = dataInfo.number;
            data.productResults[this.currentPos].remark = dataInfo.remark;
            data.productResults[this.currentPos].specs = dataInfo.specs.map(e => {
                return {
                    id: e
                }
            });
            data.productResults[this.currentPos].chargings = dataInfo.chargings.map(e => {
                return {
                    id: e
                }
            });
            data.productResults[this.currentPos].tastes = dataInfo.tastes.map(e => {
                return {
                    id: e
                }
            });
            this.updateCartting(data);
        },
        returnGoodsPackage(goodsInfo) {
            let data = JSON.parse(JSON.stringify(this.carttingData));
            data.productResults[this.currentPos].packageGroups = goodsInfo.packageGroups;
            this.updateCartting(data);
        },
        handleNumberChange(index) {                             // 改数量弹窗
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.$root.$emit('keyCode', 106);
        },
        handleOrderReturnBtn(index) {
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.$emit('caterCallback', 3)
        },
        handleSubtract(item, index) {                           // 数量 减1
            if (item.number <= 1) return this.handleDel(index);
            item.number = this.$app.subtractNumber(item.number, 1);
            if (this.timer) {
                clearTimeout(this.timer);
            };
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.timer = null;
                this.updateCartting();
            }, 500);
        },
        handleAdd(item) {                                       // 数量 加1
            let addNumber = this.$app.addNumber(item.number, 1);
            if (item.appraiseNumber && addNumber > item.appraiseNumber) {
                this.$confirm('此商品已估清，最多只能点' + item.appraiseNumber, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false
                }).then(() => {

                }).catch(() => {

                });
                return
            }
            item.number = addNumber;
            if (this.timer) {
                clearTimeout(this.timer);
            };
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.timer = null;
                this.updateCartting();
            }, 500);
        },
        handleDel(dataPos) {                                    // 删除
            this.currentPos = -1;
            this.update({
                key: 'carttingSelectedPos',
                data: -1
            });
            this.carttingData.productResults.removeByIndex(dataPos);
            this.updateCartting();
        },
        handleOrderItemSelected(item, index) {                  // 改变选中的商品
            if (!this.isOrderList) return this.handleItemSelected(item, index);
            this.currentPos = index;
            // 全部退菜品 不弹出退菜
            if (this.orderData.productResults[this.currentPos].sv_return_status === 2) return
            this.orderItemHandleStatus = true;
        },
        closeOrderItemHandle() {
            this.orderItemHandleStatus = false;
        },
        moneyEdit(val) {                                        // 弹窗修改金额返回
            if (this.currentPos < 0) return;
            if (this.isOrderList) {
                let goodsList = JSON.parse(JSON.stringify(this.orderData.productResults));
                goodsList[this.currentPos].productChangePrice = parseFloat(val);
                goodsList = goodsList.map((e, i) => {
                    let multiple_provider = [];
                    (e.multiple_provider || []).forEach(ep => {
                        ep.forEach(em => {
                            let emArray = []
                            emArray.push({
                                e_id: em.e_id,
                                percent: em.percent
                            })
                            multiple_provider.push(emArray)
                        })
                    })
                    return {
                        ...e,
                        multiple_provider,
                        sv_without_list_id: this.tableInfo.sv_without_list_id,
                        without_project_status: e.without_project_status,
                        without_project_time: e.without_project_time,
                    }
                })
                this.takeASingleUpdateCatering(goodsList, '修改成功');
            } else {
                let carttingData = JSON.parse(JSON.stringify(this.carttingData));
                carttingData.productResults[this.currentPos].productChangePrice = parseFloat(val);
                this.updateCartting(carttingData);
            }
        },
        handlePriceChange(item, index) {                        // 改价弹窗
            if (index < 0 || item.sv_return_status === 2) return;
            this.currentPos = index;
            if (item.isCurrentPrice) {
                this.currentPriceStatus = true
            } else {
                this.priceChangeStatus = true;
            }
        },
        takeASingleUpdateCatering(dataList, tips) {             // 修改挂单 
            if (dataList.length < 1) return;
            let prlist = dataList.map(e => {
                let sv_preferential = {
                    type: 1,                // 1无改价无次卡抵扣  2有改价  3有次卡，value存次卡id
                    value: e.dealMoney
                };
                if (e.productChangePrice !== null) {
                    sv_preferential = {
                        type: 2,
                        value: e.productChangePrice
                    }
                }
                let promotionId = this.$app.isNull(e.buyStepPromotion) ? null : (e.buyStepPromotion.type === 15 ? e.buyStepPromotion.promotionId : null);
                if (promotionId !== null) {
                    sv_preferential = {
                        type: 3,
                        value: promotionId
                    }
                }
                return {
                    product_id: e.productId,
                    product_price: e.price,
                    product_name: e.productName,
                    multiple_provider_list: e.multiple_provider || [],
                    sv_table_id_old: e.sv_table_id_old,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    sv_is_rouse: e.sv_is_rouse,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    sv_preferential: JSON.stringify(sv_preferential),
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: e.totalMoney,
                    without_project_status: e.without_project_status || 0,
                    without_project_start_time: e.without_project_start_time || '',
                    without_project_end_time: e.without_project_end_time || '',
                }
            });

            let query = {
                sv_order_source: 0,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.carttingData.dealMoney,
                sv_order_receivable: this.carttingData.dealMoney,
                sv_person_num: this.tableInfo.sv_person_num,
                sv_remark: this.tableInfo.sv_remark,
                sv_table_id: this.tableInfo.sv_table_id,
                sv_without_list_id: this.tableInfo.sv_without_list_id,
                without_project_status: e.without_project_status || 0,
                without_project_time: e.without_project_time || '',
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id,
                sv_table_is_together: false,                        // 是否拼桌
                sv_order_data_type: 0
            }
            stockApi.takeASingleUpdateCatering(query).then(res => {
                if (res) {
                    this.isOrderList = true;
                    this.clearCartting();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.update({
                        key: 'takeASingleCale3',
                        data: {
                            sv_isbeforehand: res.sv_isbeforehand,
                            tableId: this.tableInfo.sv_table_id,
                            member_id: res.member_id,
                            sv_integral: res.sv_integral,
                            sv_coupon_record_ids: res.sv_coupon_record_ids,
                            sv_employee_ids: res.sv_employee_ids,
                            sv_order_receivable: res.sv_order_receivable,
                            sv_order_actual_money: res.sv_order_actual_money
                        }
                    });
                    this.orderData = {
                        ...res,
                        productResults: (res.productResults || []).map((e, i) => {
                            let multCommissions = [];
                            (e.multiple_provider || []).forEach((workerItem) => {
                                let emArray = [];
                                workerItem.forEach(em => {
                                    emArray.push({
                                        selectedType: em.selectedType || '',
                                        isAppoint: em.isAppoint || false,
                                        sv_employee_id: em.e_id,
                                        sv_employee_name: em.e_name,
                                        sv_employee_number: em.e_number,
                                        sv_employee_photo: em.e_photo,
                                        grouping_name: em.g_name,
                                        percent: em.percent,
                                        status: e.without_project_status,
                                        start_time: e.without_project_start_time,
                                        end_time: e.without_project_end_time,
                                    });
                                })
                                multCommissions.push(emArray);
                            })
                            return {
                                ...e,
                                multCommissions: multCommissions.length === 0 ? [[]] : multCommissions
                            }
                        })
                    }
                    if (tips) {
                        return this.$message.success(tips)
                    }
                }
            });
        },
        handleCartering(item) {                                 // 购物车点击商品名字
            let catering = '';
            if (!this.$app.isNull(item.specs)) {
                item.specs.forEach(e => {
                    if (e.name) catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(item.tastes)) {
                item.tastes.forEach(e => {
                    if (e.name) catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(item.chargings)) {
                item.chargings.forEach(e => {
                    if (e.name) catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(catering)) {
                return `<span class="vipFlag">` + catering.substring(0, catering.length - 1) + `</span>`
            }
            return ''
        },
        handleCarteringSub(item) {
            let catering = '';
            if (!this.$app.isNull(item.specs)) {
                item.specs.forEach(e => {
                    if (e.name) catering += e.name + '、'
                });
            }
            if (!this.$app.isNull(item.tastes)) {
                item.tastes.forEach(e => {
                    if (e.name) catering += e.name + '、'
                });
            }
            if (!this.$app.isNull(item.chargings)) {
                item.chargings.forEach(e => {
                    if (e.name) catering += e.name + '、'
                });
            }
            if (!this.$app.isNull(catering)) {
                return `<span class="vipFlag">` + catering.substring(0, catering.length - 1) + `</span>`
            }
            return ''
        },
        handleProductCouponDesc(item) {                         // 计算商品优惠描述
            let productCouponDesc = '';
            if (!this.$app.isNull(item.buyStepPromotion)) {
                productCouponDesc = item.buyStepPromotion.promotionDescription.s;
            }
            if (!this.$app.isNull(item.orderPromotions)) {
                let orderPromotions = item.orderPromotions.filter(e => e.type === 6);
                orderPromotions.length > 0 && (productCouponDesc += ' ' + orderPromotions[0].promotionDescription.s);
            }
            let temp = '';
            if (!this.$app.isNull(productCouponDesc)) {
                temp = `<div class="vipFlag">${item.isCurrentPrice ? '时' : '促'}</div>
                    <span>` + productCouponDesc + `</span>`
            }
            return temp
        },
        handleProductCouponMoney(item) {                        // 计算商品优惠金额
            let productCouponMoney = 0;
            if (!this.$app.isNull(item.buyStepPromotion)) {
                productCouponMoney = this.$app.moneyFixed(item.buyStepPromotion.promotionDescription.m);
            }
            if (!this.$app.isNull(item.orderPromotions)) {
                let orderPromotions = item.orderPromotions.filter(e => e.type === 6);
                orderPromotions.length > 0 && (productCouponMoney = this.$app.moneyFixed(orderPromotions[0].promotionDescription.m));
            }
            if (parseFloat(productCouponMoney) <= 0) return ''
            let temp = '';
            if (!this.$app.isNull(item.buyStepPromotion)) {
                temp = `<div class="discount">
                    <span>原：` + this.$app.moneyFixed(item.totalMoney) + `</span>
                    <span class="pl-10">惠：</span>
                    <span class="highlight">`+ productCouponMoney + `</span>
                    <span class="highlight"></span>
                </div>`
            }
            return temp
        },
    }
}