import resetMessage from '@/utils/resetMessage.js';
import utils from '@/utils/utils';
import { stockApi } from "@/api/index.js";
export default {
    getUserModuleConfigs(mine) {                    // 获取销售配置
        // 结账时是否必选导购员, 负库存销售，交接班开关，打印开关，打印设置，繁体
        let configArray = [
            'CashierMode',                          // 收银模式
            'SelectCommissionRequired',             // 结账时是否必选导购员
            'RechargeSelectCommissionRequired',     // 次卡购买、充值时是否必选导购员
            'ZeroInventorySales',                   // 负库存销售
            'succession',                           // 交接班开关
            'ReceptionCashierSet',                  // 前台收银常用配置
            'Print',                                // 打印开关
            'PrintSeting',                          // 打印设置
            'PrintingComplexFont',                  // 繁体
            'MbilePhoneMhow_Switch',                // 是否不显示完整手机号
            // 设置-会员设置相关
            'crossShopRecharge',                    // 是否禁用跨店充值
            'crossShopIntegralOperation',           // 是否禁用跨店积分变更
            'AutomaticallyGenerateMemberId',        // 是否自动生成会员卡号
            'DisableManualInput',                   // 是否禁用手动输入会员卡卡号
        ]
        stockApi.getUserModuleConfigs(configArray).then(res => {
            if (res) {
                let CashierMode, SelectCommissionRequired, RechargeSelectCommissionRequired, ZeroInventorySales, succession, ReceptionCashierSet, Desk_Cashier_Is_ShowCode_Switch;
                let sv_branchrelation = mine.state.userInfo.sv_branchrelation;
                let memberSetting = {
                    isRechargeInitial: false,
                    isChangeIntegralInitial: false,
                    autoCardInitial: false,
                    keyCardInitial: false,
                    isMemberEdit: false,
                    isMemberConsume: false
                }
                sv_branchrelation === 0 && (memberSetting.isMemberEdit = false, memberSetting.isMemberConsume = false);
                sv_branchrelation == 2 && (memberSetting.isMemberEdit = true, memberSetting.isMemberConsume = true);
                sv_branchrelation == 3 && (memberSetting.isMemberEdit = false, memberSetting.isMemberConsume = true);
                res.forEach(item => {
                    switch (item.sv_user_module_code) {
                        case 'CashierMode':                 // 收银模式
                            CashierMode = item;
                            break;
                        case 'SelectCommissionRequired':    // 收银时需选择导购员
                            SelectCommissionRequired = item;
                            break;
                        case 'RechargeSelectCommissionRequired':    // 次卡购买、充值时是否必选导购员
                            RechargeSelectCommissionRequired = item;
                            break;
                        case 'ZeroInventorySales':          // 负库存销售
                            ZeroInventorySales = item;
                            break;
                        case 'succession':                  // 交接班开关
                            succession = item;
                            break;
                        case 'ReceptionCashierSet':         // 前台收银常用配置
                            ReceptionCashierSet = item;
                            Desk_Cashier_Is_ShowCode_Switch = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Desk_Cashier_Is_ShowCode_Switch');
                            let showCodeHasDetail = utils.isNull(Desk_Cashier_Is_ShowCode_Switch) ? 0 : utils.isNull(Desk_Cashier_Is_ShowCode_Switch.childDetailList) ? 0 : Desk_Cashier_Is_ShowCode_Switch.childDetailList.length;
                            mine.state.cashierJurisdiction.showCode = showCodeHasDetail ? Desk_Cashier_Is_ShowCode_Switch.childDetailList[0].sv_detail_is_enable : true;

                            let Cashier_Number_Cumulation = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Cashier_Number_Cumulation');
                            let cashierHasDetail = utils.isNull(Cashier_Number_Cumulation) ? 0 : utils.isNull(Cashier_Number_Cumulation.childDetailList) ? 0 : Cashier_Number_Cumulation.childDetailList.length;
                            mine.state.cashierJurisdiction.Cashier_Number_Cumulation_enable = cashierHasDetail ? Cashier_Number_Cumulation.childDetailList[0].sv_detail_is_enable : true;

                            let Set_Not_Image_sell = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Set_Not_Image_sell');
                            let Set_Not_Image_sell_hasDetail = utils.isNull(Set_Not_Image_sell) ? 0 : utils.isNull(Set_Not_Image_sell.childDetailList) ? 0 : Set_Not_Image_sell.childDetailList.length;
                            mine.state.user_local_data.goodsListShowType = Set_Not_Image_sell_hasDetail ? (Set_Not_Image_sell.childDetailList[0].sv_detail_is_enable ? '2' : Set_Not_Image_sell.childDetailList[0].sv_detail_value) : '2';
                            break;
                        case 'Print':
                            let PrintReceipts = item.childInfolist.find(e => e.sv_user_config_code === 'PrintReceipts');
                            mine.state.cashierJurisdiction.printEnable = utils.isNull(PrintReceipts.childDetailList) ? false : PrintReceipts.childDetailList[0].sv_detail_is_enable;


                            let PrintQR = item.childInfolist.find(e => e.sv_user_config_code === 'PrintQR');
                            mine.state.user_local_data.printQR = utils.isNull(PrintQR.childDetailList) ? PrintQR.sv_config_is_enable : PrintQR.childDetailList[0].sv_detail_is_enable;
                            break;
                        case 'PrintSeting':
                            let PrintSet_default = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_default');
                            mine.state.cashierJurisdiction.printSum = utils.isNull(PrintSet_default.childDetailList) ? 1 : PrintSet_default.childDetailList[0].sv_detail_value;

                            let PrintSet_default_device = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_default_device');
                            mine.state.cashierJurisdiction.printName = utils.isNull(PrintSet_default_device.childDetailList) ? '' : PrintSet_default_device.childDetailList[0].sv_detail_value;
                            mine.state.cashierJurisdiction.cloundPrintId = utils.isNull(PrintSet_default_device.childDetailList) ? '' : PrintSet_default_device.childDetailList[0].cloundprint_id;
                            mine.state.cashierJurisdiction.printCloudType = utils.isNull(PrintSet_default_device.childDetailList) ? '' : PrintSet_default_device.childDetailList[0].iscloundprint;
                            let PrintSet_cash_opencashbox = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_cash_opencashbox');
                            mine.state.cashierJurisdiction.opencashbox = utils.isNull(PrintSet_cash_opencashbox.childDetailList) ? true : PrintSet_cash_opencashbox.childDetailList[0].sv_detail_value;

                            let PrintSet_guestorderprint = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_guestorderprint');
                            mine.state.cashierJurisdiction.PrintSet_guestorderprint = utils.isNull(PrintSet_guestorderprint.childDetailList) ? true : PrintSet_guestorderprint.childDetailList[0].sv_detail_is_enable;
                            break;
                        case 'PrintingComplexFont':
                            let PrintingComplexFont = item;
                            mine.state.cashierJurisdiction.isComplexFont = utils.isNull(PrintingComplexFont.childInfolist[0].childDetailList) ? false : PrintingComplexFont.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                            break;
                        case 'MbilePhoneMhow_Switch':
                            let MbilePhoneMhowSwitch = item;
                            mine.state.JurisdictionObj.MbilePhoneMhow_Switch = utils.isNull(MbilePhoneMhowSwitch.childInfolist[0].childDetailList) ? false : MbilePhoneMhowSwitch.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                            break;
                        // 会员设置相关
                        case 'crossShopRecharge':
                            memberSetting.isRechargeInitial = utils.isNull(item.childInfolist[0].childDetailList) ? false : item.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                            break;
                        case 'crossShopIntegralOperation':
                            memberSetting.isChangeIntegralInitial = utils.isNull(item.childInfolist[0].childDetailList) ? false : item.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                            break;
                        case 'AutomaticallyGenerateMemberId':
                            memberSetting.autoCardInitial = utils.isNull(item.childInfolist[0].childDetailList) ? false : item.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                            break;
                        case 'DisableManualInput':
                            memberSetting.keyCardInitial = utils.isNull(item.childInfolist[0].childDetailList) ? false : item.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                            break;
                        default:
                            break;
                    }
                });

                let cashierModeHasDetail = utils.isNull(CashierMode.childInfolist[0].childDetailList) ? 0 : CashierMode.childInfolist[0].childDetailList.length;
                mine.state.cashierJurisdiction.cashierModel = cashierModeHasDetail ? CashierMode.childInfolist[0].childDetailList[0].sv_detail_value : '0';

                mine.state.memberSetting = memberSetting;

                let selectCommissionRequired = utils.isNull(SelectCommissionRequired.childInfolist[0].childDetailList) ? false : true;
                mine.state.cashierJurisdiction.SelectCommissionRequired = selectCommissionRequired ? SelectCommissionRequired.childInfolist[0].childDetailList[0].sv_detail_is_enable : false;

                let rechargeSelectCommissionRequired = utils.isNull(RechargeSelectCommissionRequired.childInfolist[0].childDetailList) ? false : true;
                mine.state.cashierJurisdiction.RechargeSelectCommissionRequired = rechargeSelectCommissionRequired ? RechargeSelectCommissionRequired.childInfolist[0].childDetailList[0].sv_detail_is_enable : false;

                let zeroHasDetail = utils.isNull(ZeroInventorySales.childInfolist[0].childDetailList) ? 0 : ZeroInventorySales.childInfolist[0].childDetailList.length;
                mine.state.cashierJurisdiction.ZeroInventorySales = zeroHasDetail ? ZeroInventorySales.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                let successionHasDetail = utils.isNull(succession.childInfolist[0].childDetailList) ? 0 : succession.childInfolist[0].childDetailList.length;
                mine.state.cashierJurisdiction.succession = successionHasDetail ? succession.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;
            }
        });

        stockApi.GetUserModuleList({ code: 'Set_Hardware_CusDisplay' }).then(res => {
            if (res) {
                const { enable, list } = res
                const data = {
                    enable,
                    port: list.find(e => e.code === 'Set_Hardware_CusDisplay_Port').value,
                    baud: list.find(e => e.code === 'Set_Hardware_CusDisplay_Baud').value,
                }
                this.commit('update', {
                    key: 'customerDisplayData',
                    data,
                });
            }
        })
    },
    getPrintTemplate(mine) {                        // 获取打印配置
        ticketApi.getCustomTemplates().then(res => {
            if (res) {
                res = res.filter(e => e.industryIds.includes(mine.state.userInfo.sv_us_industrytype));
                let salesItem = res.find(e => e.templateName === '销售小票');
                if (!utils.isNull(salesItem)) {
                    mine.state.printTemplate.salesData = {
                        templateId: salesItem.templateId,
                        industryIds: salesItem.industryIds,
                        width: salesItem.width,
                        ticketItemGroups: salesItem.ticketItemGroups,
                        ticketItemGroups210: salesItem.ticketItemGroups210
                    }
                }

                let changeItem = res.find(e => e.templateName === '换货小票');
                if (!utils.isNull(changeItem)) {
                    mine.state.printTemplate.changeData = {
                        templateId: changeItem.templateId,
                        industryIds: changeItem.industryIds,
                        width: changeItem.width,
                        ticketItemGroups: changeItem.ticketItemGroups,
                        ticketItemGroups210: changeItem.ticketItemGroups210
                    }
                }

                let returnsData = res.find(e => e.templateName === '退货小票');
                if (!utils.isNull(returnsData)) {
                    mine.state.printTemplate.returnsData = {
                        templateId: returnsData.templateId,
                        industryIds: returnsData.industryIds,
                        width: returnsData.width,
                        ticketItemGroups: returnsData.ticketItemGroups,
                        ticketItemGroups210: returnsData.ticketItemGroups210
                    }
                }
            }
        });
    },
    getPrintTotalList(mine) {                       // 获取开启总单打印机数据
        stockApi.getKitchenPrinterTotal().then(res => {
            mine.state.printTotalList = utils.isNull(res) ? [] : res;
        });
    },
    getUiGroupingEmployeeList(mine) {               // 获取岗位员工列表
        stockApi.getUiGroupingEmployeeList().then(res => {
            if (res !== false) {
                mine.state.storeEmployeeList = utils.isNull(res) ? [] : res;
            }
        });
    },
    requsetMemberInfo(mine, requsetInfo) {             // 获取会员内容
        const memberId = requsetInfo.id ? requsetInfo.id : requsetInfo;
        if (utils.isNull(memberId) || memberId === '0') {
            this.commit('clearMember');
            return
        }
        stockApi.getMemberInfo({ m_id: memberId }).then(res => {
            if (res) {
                let memberInfo = {
                    ...res,
                    member_id: memberId,
                    sv_mr_platenumber: res.sv_mr_platenumber,
                    sv_wallet_id: res.wallets_list.length === 1 ? res.wallets_list[0].sv_wallet_id : '',
                    cardPackageList: mine.state.memberInfo.cardPackageList
                }
                mine.state.carttingData.orderChangeMoney = null;
                this.commit('update', {
                    key: 'memberInfo',
                    data: {
                        ...memberInfo,
                        afterMemberCard: false
                    }
                });
                // 美业获取次卡数据
                if (mine.state.userInfo.sv_us_industrytype === 1) {
                    this.dispatch('requestMemberCard', memberId);
                } else {
                    if (utils.isNull(requsetInfo.id) || requsetInfo.needUpdateCartting) {
                        let carttingData = JSON.parse(JSON.stringify(mine.state.carttingData));
                        carttingData.member_id = memberId;
                        if (carttingData.productResults.length > 0) {
                            carttingData.productResults.map(item => {
                                return {
                                    ...item,
                                    productChangePrice: item.isCurrentPrice ? item.productChangePrice : null,
                                    buyStepPromotion: null
                                }
                            });
                            this.dispatch('memberCardUpdateCartting', carttingData);
                        }
                    }
                };

                stockApi.getCouponList({ MemberId: memberId }).then(dataList => {
                    if (dataList) {
                        let memberInfo = {
                            ...mine.state.memberInfo,
                            couponCountList: dataList,
                            couponCountNumber: dataList.length
                        }
                        mine.state.carttingData.orderChangeMoney = null;
                        this.commit('update', {
                            key: 'memberInfo',
                            data: memberInfo
                        });
                    }
                });
            }
        });
    },
    requestMemberCard(mine, memberId) {             // 获取会员计次卡
        if (utils.isNull(memberId) || memberId === '0') return;
        stockApi.getCardSetmealProductInfoByLoginShop({ MemberId: memberId }).then(res => {
            if (res) {
                let cardPackageTotal = 0;
                let cardPackageList = utils.isNull(res) ? [] : res.map((item, index) => {
                    let list = utils.isNull(item.combination_new) ? [] : JSON.parse(item.combination_new).map(k => {
                        let number = k.sv_mcc_leftcount > 0 ? 0 : (k.sv_package_type === 1 ? 0 : null);          // 可选套餐默认0
                        const sv_mcc_leftcount = k.sv_package_detailed_type === 1 ? item.available_usage : k.sv_mcc_leftcount;
                        cardPackageTotal = cardPackageTotal + sv_mcc_leftcount;

                        return {
                            ...k,
                            packagePos: index,
                            product_id: k.ShopProductId,                // 跨店商品，本店对应商品id
                            sv_p_name: k.ShopProductName,               // 跨店商品，本店对应商品名称
                            available_usage: item.available_usage,
                            sv_mcc_leftcount,
                            number
                        }
                    });

                    return {
                        ...item,
                        list: list.filter(e => !e.getvalidity),
                        validityList: list.filter(e => e.getvalidity),
                        currTimes: 0,     // 当前次卡选择次数
                        showValidity: false,
                        validity_date: utils.currentTime(new Date(item.setmeal_validity_date), 'yyyy-MM-dd')
                    }
                });

                if (!utils.isNull(mine.state.carttingData.productResults) && mine.state.caleStep === 3) {
                    // 结算窗口切换会员直接计算是否有次卡抵扣
                    let dataArray = mine.state.carttingData.productResults.map(cart => {
                        let hasItem;
                        cardPackageList.forEach(item => {
                            item.list.forEach(listItem => {
                                if (listItem.product_id === cart.productId && listItem.sv_mcc_leftcount > 0) {
                                    listItem.sv_mcc_leftcount--;
                                    hasItem = listItem;
                                }
                            })
                        });
                        return {
                            ...cart,
                            productChangePrice: (cart.isCurrentPrice || cart.productId === 0) ? cart.productChangePrice : null,
                            buyStepPromotion: null,
                            setmealId: utils.isNull(hasItem) ? null : hasItem.userecord_id
                        }
                    });
                    if (mine.state.caleStep === 3) {
                        let dataObj = JSON.parse(JSON.stringify(mine.state.carttingData))
                        dataObj.productResults = dataArray;
                        this.dispatch('updateCartting', dataObj);
                    }
                }

                let dataObj = {
                    ...mine.state.memberInfo,
                    afterMemberCard: true,
                    cardPackageList: cardPackageTotal > 0 ? cardPackageList : []
                }
                this.commit('update', {
                    key: 'memberInfo',
                    data: dataObj
                });
            }
        });
    },
    getMemeberFilters(mine) {                       // 获取会员配置相关信息
        if (mine.state.userPoint.maxValue) return
        stockApi.getMemeberFilters().then(res => {
            if (res) {
                let jsonData = JSON.parse(res.values.sv_uc_dixian);
                mine.state.userPoint.switch = jsonData.whether;
                mine.state.userPoint.proportion = jsonData.auto;
                let value = mine.state.memberInfo.sv_mw_availablepoint > 0 ? mine.state.memberInfo.sv_mw_availablepoint : 0;
                let pointToMoney = parseInt(value / mine.state.userPoint.proportion);
                let maxValue = parseInt(mine.state.carttingData.lastOrderCouponMoney) * mine.state.userPoint.proportion;
                mine.state.userPoint.inputValue = value < maxValue ? pointToMoney * mine.state.userPoint.proportion : maxValue;
                mine.state.userPoint.maxValue = mine.state.userPoint.inputValue;
            }
        })
    },
    updateMemberListSendCoupon(mine, data) {        // 更新发放优惠券选择的会员
        this.commit('update', {
            key: 'memberListSendCoupon',
            data: utils.isNull(data) ? [] : data
        });
    },
    meiyeTakeOrder(mine, obj) {                     // 美业取单
        if (utils.isNull(obj.member_id) || obj.member_id === '0') {
            this.dispatch('batchAddToCartting', obj.list);
            return
        }

        stockApi.getCardSetmealProductInfoByLoginShop({ MemberId: obj.member_id }).then(res => {
            if (res) {
                let cardPackageTotal = 0;
                let cardPackageList = utils.isNull(res) ? [] : res.map(e => {
                    if (e.sv_package_type === 1) {
                        cardPackageTotal = cardPackageTotal + e.available_usage;
                    }
                    let list = utils.isNull(e.combination_new) ? [] : JSON.parse(e.combination_new).map(k => {
                        let number = k.sv_mcc_leftcount > 0 ? 0 : (k.sv_package_type === 1 ? 0 : null);          // 可选套餐默认0
                        cardPackageTotal = cardPackageTotal + k.sv_mcc_leftcount;
                        return {
                            ...k,
                            product_id: k.ShopProductId,                // 跨店商品，本店对应商品id
                            sv_p_name: k.ShopProductName,               // 跨店商品，本店对应商品名称
                            available_usage: e.available_usage,
                            sv_mcc_leftcount: k.sv_package_detailed_type === 1 ? e.available_usage : k.sv_mcc_leftcount,
                            number: number
                        }
                    });
                    return {
                        ...e,
                        list: list,
                        validity_date: utils.currentTime(new Date(e.setmeal_validity_date), 'yyyy-MM-dd')
                    }
                });

                let dataObj = {
                    ...mine.state.memberInfo,
                    cardPackageList: cardPackageTotal > 0 ? cardPackageList : []
                }
                this.commit('update', {
                    key: 'memberInfo',
                    data: dataObj
                });
                this.dispatch('batchAddToCartting', obj.list);
            }
        });

        stockApi.getMemberInfo({ m_id: obj.member_id }).then(res => {
            // stockApi.getMemberInfo({ Id: obj.member_id, is_pc: true }).then(res => {
            if (res) {
                let dataObj = {
                    ...res,
                    member_id: obj.member_id,
                    cardPackageList: mine.state.memberInfo.cardPackageList
                }
                mine.state.carttingData.orderChangeMoney = null;
                this.commit('update', {
                    key: 'memberInfo',
                    data: dataObj
                });
                stockApi.getCouponList({ MemberId: obj.member_id }).then(dataList => {
                    if (dataList) {
                        let dataObj = {
                            ...res,
                            cardPackageList: mine.state.memberInfo.cardPackageList,
                            couponCountList: dataList,
                            couponCountNumber: dataList.length
                        }
                        this.commit('update', {
                            key: 'memberInfo',
                            data: dataObj
                        });
                    }
                });
            }
        });
    },
    //#region 购物车相关操作
    updateCarttingByArray(mine, carttingUpdate) {        // 通过列表数据，更新购物车
        if (location.href.indexOf('cashier') === -1 && location.href.indexOf('reservationMain') === -1) return
        if (mine.state.isOffline) return;
        let buySteps = carttingUpdate.list.map((e, i) => {
            let specs = utils.isNull(e.specs) ? [] : e.specs.map(e => {
                return e.id ? e.id : e
            })
            let tastes = utils.isNull(e.tastes) ? [] : e.tastes.map(e => {
                return e.id ? e.id : e
            })
            let chargings = utils.isNull(e.chargings) ? [] : e.chargings.map(e => {
                return e.id ? e.id : e
            })
            let packageGroups = [];
            if (!utils.isNull(e.packageGroups)) {
                e.packageGroups.forEach(e => {
                    packageGroups.push({
                        groupId: e.id,
                        products: e.products.map(k => {
                            return {
                                productId: k.productId,
                                specIds: utils.isNull(k.specIds) ? utils.isNull(k.specs) ? [] : [...k.specs.map(eki => { return eki.id })] : k.specIds,
                                chargingIds: utils.isNull(k.chargingIds) ? utils.isNull(k.chargings) ? [] : [...k.chargings.map(eki => { return eki.id })] : k.chargingIds,
                                tasteIds: utils.isNull(k.tasteIds) ? utils.isNull(k.tastes) ? [] : [...k.tastes.map(eki => { return eki.id })] : k.tasteIds,
                            }
                        })
                    })
                })
            }
            let setmealId = null;
            // 促销id  
            let promotionId = utils.isNull(e.buyStepPromotion) ? null : (e.buyStepPromotion.type === 15 ? e.buyStepPromotion.promotionId : null);
            if (mine.state.userInfo.sv_us_industrytype === 1) {
                // 美业次卡逻辑
                if (utils.isNull(e.setmealId) && utils.isNull(promotionId)) {
                    // 是否是清除选中的次卡抵扣
                    if (e.promotionType === 'clickAdd') {
                        // 非次卡弹窗商品加入购物车
                        mine.state.memberInfo.cardPackageList.forEach(item => {
                            item.list.forEach(list => {
                                if (list.product_id === e.productId && list.sv_mcc_leftcount > 0) {
                                    setmealId = list.userecord_id;
                                    list.sv_mcc_leftcount--;
                                }
                            });
                        })
                    }
                } else {
                    setmealId = e.setmealId;
                }
            }
            let booking = utils.isNull(e.bookingTime) ? utils.isNull(e.bookingResult) ? null : {
                bookingPrice: e.dealPrice,
                bookingDate: e.bookingResult.bookingTimeDateString,
                bookingTime: e.bookingResult.bookingTimeStartString + '-' + e.bookingResult.bookingTimeEndString,
                packageGuid: e.bookingResult.packageId
            } : {
                bookingPrice: e.bookingPrice,
                bookingDate: e.bookingDate,
                bookingTime: e.bookingTime,
                packageGuid: null
            }
            // let multCommissions = utils.isNull(e.multiple_provider) || mine.state.caleStep !== 3 ? (e.multCommissions || []) : e.multiple_provider.map(provider => {
            //     return provider.map(em => {
            //         return {
            //             employeeId: em.e_id,
            //             assign: false,
            //             percent: em.percent,
            //             sex: 0
            //         }
            //     })
            // });
            // if (multCommissions.length === 0 && mine.state.carttingData.calcDto) {
            //     if (mine.state.carttingData.calcDto.buySteps[i]) {
            //         multCommissions = mine.state.carttingData.calcDto.buySteps[i].multCommissions || []
            //     }
            // }
            // const multCommissions = (e.multCommissions || []).map(workerItem => {
            //     return (workerItem || []).map(em => {
            //         return {
            //             employeeId: em.sv_employee_id,
            //             assign: false,
            //             percent: em.percent,
            //             sex: 0
            //         }
            //     })
            // })
            const multCommissions = !utils.isNull(e.attachData) ? [[{
                employeeId: e.attachData.sv_employee_id,
                billable_id: e.attachData.billable_id,
                assign: false,
                percent: 100,
                sex: 0,
            }]] : e.multCommissions ? e.multCommissions.map(workerItem => {
                return workerItem.map(em => {
                    return {
                        ...em,
                        employeeId: em.sv_employee_id || em.employeeId,
                        billable_id: em.billable_id,
                        assign: utils.isNull(em.assign) ? em.isAppoint : em.assign,
                        percent: em.percent,
                        sex: 0
                    }
                })
            }) : null;
            return {
                index: i + 1,
                productId: e.productId,
                withoutProductId: e.sv_without_product_id || null,
                multCommissions,
                setmealId: utils.isNull(e.productChangePrice) ? (setmealId || promotionId) : null,
                serviceName: e.productId === 0 && !utils.isNull(e.productName) ? e.productName : '',
                // billabletime: mine.state.caleStep === 3 ? e.billabletime : null,
                billabletime: e.billabletime || null,
                attachData: utils.isNull(e.attachData) ? null : JSON.stringify(e.attachData),
                number: e.number,
                booking: booking || e.booking,
                tradePrice: e.tradePrice || null,
                remark: e.remark || null,
                tasteIds: tastes,
                chargingIds: chargings,
                specIds: specs,
                waittingStatus: e.waittingStatus || false,
                appraiseNumber: e.appraiseNumber,
                packageGroups: utils.isNull(e.packageGroups) ? null : packageGroups,
                productChangePrice: e.productChangePrice,
                productChangeMoney: e.productChangeMoney
            }
        })
        if (utils.isNull(buySteps)) {
            // 购买环节没有商品时触发（删除了购物车商品，或者清空购物车时）
            this.commit('clearCartting');
            this.commit('touchCarttingCursor');
            return
        }

        const takeASingleCale3 = mine.state.takeASingleCale3;
        const selectedInfo = mine.state.selectedInfo;
        let memberPoint = mine.state.queryUpdateCartting.point || null;
        let couponRecordIds = mine.state.queryUpdateCartting.couponRecordIds || null;
        let orderChangeMoney = utils.isNull(mine.state.carttingData.orderChangeMoney) ? null : mine.state.carttingData.orderChangeMoney;
        if (mine.state.caleStep === 3 && takeASingleCale3.sv_isbeforehand && takeASingleCale3.tableId === selectedInfo.sv_table_id) {
            if (takeASingleCale3.sv_integral) memberPoint = takeASingleCale3.sv_integral;
            if (takeASingleCale3.sv_coupon_record_ids.length > 0) couponRecordIds = takeASingleCale3.sv_coupon_record_ids;
            if (takeASingleCale3.sv_order_actual_money) orderChangeMoney = takeASingleCale3.sv_order_actual_money;
        }
        let query = {                               // 后端购物车计算数据
            buySteps,
            bookingClassId: mine.state.carttingData.bookingClassId,
            giveSteps: mine.state.carttingGiveData || [],
            memberId: mine.state.memberInfo.member_id || mine.state.carttingData.memberId || null,
            walletId: utils.isNull(mine.state.memberInfo.member_id) ? null : mine.state.memberInfo.sv_wallet_id,
            memberPoint,
            couponRecordIds,
            orderChangeMoney,
            currentStep: mine.state.caleStep
        };
        mine.state.hasGoodsActivity = false;
        mine.state.carttingSearchCursor = false;
        // console.log(carttingUpdate.type);
        stockApi.getCarttingCale(query).then(res => {
            if (res) {
                this.commit('update', {
                    key: 'carttingSelectedPos',
                    data: -1
                });
                res.productResults = res.productResults.map((e, i) => {
                    const multCommissions = buySteps[i].multCommissions ? buySteps[i].multCommissions : utils.isNull(mine.state.selectedEmployee.sv_employee_id) ? [[]] : [
                        [{ ...mine.state.selectedEmployee, selectedType: 'type1', percentValue: e.dealMoney, percent: 100, max: 100, isLocked: false, inputLocked: false, isAppoint: false }]
                    ]
                    return {
                        ...e,
                        isAssistant: utils.isNull(e.buyStep.attachData) ? false : true,
                        attachData: utils.isNull(e.buyStep.attachData) ? null : JSON.parse(e.buyStep.attachData),
                        multCommissions,
                        waittingStatus: buySteps[i].waittingStatus || false,
                        appraiseNumber: buySteps[i].appraiseNumber || null,
                    }
                })
                this.commit('syncCarttingData', { ...res, bookingClassId: query.bookingClassId });
                if (!utils.isNull(res.messages)) {
                    res.messages.forEach(e => {
                        resetMessage({ showClose: true, message: e, type: 'warning', duration: 5000 });
                    })
                }
                if (!utils.isNull(mine.state.memberInfo.member_id) && mine.state.caleStep === 3) {
                    this.dispatch('getMemeberFilters');
                }
                if (mine.state.caleStep === 3) {
                    mine.state.isInShowCheckin = true;
                    if (res.givePromotions.length > 0) mine.state.hasGoodsActivity = true;
                }
            }
        }).then(_ => {
            if (mine.state.caleStep === 1) {
                mine.state.carttingSearchCursor = true;
            }
        }).catch(_ => {
            if (!mine.state.isInShowCheckin) mine.state.caleStep = 1;
            if (mine.state.carttingData.bookingClassId) {
                // 待预约取单，失败清空购物车
                this.commit('clearCartting');
            } else {
                mine.state.carttingData.productResults = mine.state.carttingData.productResults.map(e => {
                    return {
                        ...e,
                        number: e.actualNumber
                    }
                });
            }
        });
    },
    addToCartting(mine, dataList) {                 // 加入购物车
        if (mine.state.isOffline) return;
        let dataArray = [];
        if (mine.state.userInfo.sv_us_industrytype === 15 && dataList[0].productName === '无码收银') {
            // 零售支持多个无码收银
            dataArray = dataList.concat(mine.state.carttingData.productResults);
        } else {
            if (dataList.length === 1 && dataList[0].productId === 0 && dataList[0].productName === '无码收银') {
                // 无码收银过滤已经存在的无码收银
                dataArray = mine.state.carttingData.productResults.filter(e => e.productId !== 0);
                dataArray = dataList.concat(dataArray);
            } else {
                dataArray = dataList;
            }
        }
        this.dispatch('updateCarttingByArray', { list: dataArray, type: 'addToCartting' });
    },
    batchAddToCartting(mine, dataInfo) {            // 批量加入购物车
        let dataArray = dataInfo.dataArray || dataInfo;
        this.dispatch('updateCarttingByArray', { list: dataArray, type: 'batchAddToCartting' });
        return
    },
    syncCloseCheckin(mine, needClearCartting) {     // 关闭结算窗口，同步数据
        mine.state.caleStep = 1;
        mine.state.carttingGiveData = [];
        if (needClearCartting) {
            // 结算窗口carttingData来自OrderData，关闭结算窗口，需要清理购物车数据
            this.commit('clearSelectedInfo');
            this.commit('clearCartting');
            return
        }
        mine.state.carttingData.orderChangeMoney = null;
        mine.state.queryUpdateCartting = {
            couponRecordIds: null,
            point: null
        }
        this.dispatch('updateCartting');
    },
    updateCartting(mine, dataInfo) {                // 更新购物车内容
        let localChangeData = utils.isNull(dataInfo) ? mine.state.carttingData : dataInfo;
        this.dispatch('updateCarttingByArray', { list: localChangeData.productResults, type: 'updateCartting' });
    },
    checkInUpdateCatting(mine) {                    // 结算窗修改购物车内容
        let localChangeData = mine.state.carttingData;
        if (mine.state.caleStep !== 3 || localChangeData.productResults.length === 0) return
        const updateArray = localChangeData.productResults.map((e, i) => {
            const billabletime = e.billabletime || (localChangeData.calcDto ? localChangeData.calcDto.buySteps[i].billabletime : null);
            return {
                ...e,
                billabletime,
                multCommissions: localChangeData.calcDto ? localChangeData.calcDto.buySteps[i].multCommissions : e.multCommissions
            }
        })
        this.dispatch('updateCarttingByArray', { list: updateArray, type: 'checkInUpdateCatting' });
    },
    memberCardUpdateCartting(mine, dataInfo) {      // 选择会员后更新购物车内容
        let localChangeData = utils.isNull(dataInfo) ? mine.state.carttingData : dataInfo;
        const updateArray = localChangeData.productResults.map((e, i) => {
            const billabletime = e.billabletime || (localChangeData.calcDto && localChangeData.calcDto.buySteps[i] ? localChangeData.calcDto.buySteps[i].billabletime : null);
            return {
                ...e,
                billabletime,
                multCommissions: localChangeData.calcDto && localChangeData.calcDto.buySteps[i] ? localChangeData.calcDto.buySteps[i].multCommissions : e.multCommissions
            }
        })
        this.dispatch('updateCarttingByArray', { list: updateArray, type: 'memberCardUpdateCartting' });
        return
    },
    caleCarttingGiveData(mine) {                    // 计算购物车 满减、加价购
        if (utils.isNull(mine.state.carttingData.productResults)) return;
        this.dispatch('updateCarttingByArray', { list: mine.state.carttingData.productResults, type: 'caleCarttingGiveData' });
        return
    },
    reOrderAction(mine, dataInfo) {                 // 反结账加入购物车
        let memberId = dataInfo.memberId ? dataInfo.memberId : mine.state.memberInfo.member_id;
        if (mine.state.isOffline) return;
        mine.state.memberInfo.member_id = memberId;
        let query = {
            buySteps: dataInfo.buySteps,
            giveSteps: [],
            memberId,
            couponRecordIds: null,
            orderChangeMoney: null,
            memberPoint: null
        };
        mine.state.carttingSearchCursor = false;
        stockApi.getCarttingCale(query).then(res => {
            if (res) {
                this.commit('update', {
                    key: 'carttingSelectedPos',
                    data: -1
                });
                const reOrderData = JSON.parse(JSON.stringify(res));
                reOrderData.productResults = res.productResults.map((e, i) => {
                    return {
                        ...e,
                        multCommissions: query.buySteps[i].multCommissions ? query.buySteps[i].multCommissions : utils.isNull(mine.state.selectedEmployee.sv_employee_id) ? [[]] : [
                            [{ ...mine.state.selectedEmployee, selectedType: 'type1', percentValue: e.dealMoney, percent: 100, max: 100, isLocked: false, inputLocked: false, isAppoint: false }]
                        ],
                        waittingStatus: query.buySteps[i].waittingStatus || false,
                        appraiseNumber: query.buySteps[i].appraiseNumber || null,
                    }
                })
                // mine.state.goodsEmployeeList = dataInfo.goodsEmployeeList;
                this.commit('syncCarttingData', { ...reOrderData, bookingClassId: query.bookingClassId });
                if (!utils.isNull(res.messages)) {
                    res.messages.forEach(e => {
                        resetMessage({ showClose: true, message: e, type: 'warning', duration: 5000 });
                    })
                }
                const em_industryIds = [1, 6];              // 1-美业 6-棋牌  加入购物车添加员工
                if (em_industryIds.includes(mine.state.userInfo.sv_us_industrytype)) {
                    // this.dispatch('queryEmployeeProductCommissions', dataArray);
                }
                if (!utils.isNull(mine.state.memberInfo.member_id)) {
                    this.dispatch('requsetMemberInfo', memberId);
                }
            }
        }).then(_ => {
            mine.state.carttingSearchCursor = true;
        }).catch(_ => {
            if (!mine.state.isInShowCheckin) mine.state.caleStep = 1;
            mine.state.carttingData.productResults = mine.state.carttingData.productResults.map(e => {
                return {
                    ...e,
                    number: e.actualNumber
                }
            });
        });
    },
    batchAddToCartting(mine, dataInfo) {            // 批量加入购物车
        let dataArray = dataInfo.dataArray || dataInfo;
        this.dispatch('updateCarttingByArray', { list: dataArray, type: 'addToCartting' });
        return
    },
    checkInUpdateCatting(mine) {                    // 结算窗修改购物车内容
        let localChangeData = mine.state.carttingData;
        if (mine.state.caleStep !== 3 || localChangeData.productResults.length === 0) return
        const updateArray = localChangeData.productResults.map((e, i) => {
            const billabletime = e.billabletime || (localChangeData.calcDto ? localChangeData.calcDto.buySteps[i].billabletime : null);
            return {
                ...e,
                billabletime,
                multCommissions: localChangeData.calcDto ? localChangeData.calcDto.buySteps[i].multCommissions : e.multCommissions
            }
        })
        this.dispatch('updateCarttingByArray', { list: updateArray, type: 'checkInUpdateCatting' });
    },
    caleCarttingGiveData(mine) {                    // 计算购物车 满减、加价购
        if (utils.isNull(mine.state.carttingData.productResults)) return;
        this.dispatch('updateCarttingByArray', { list: mine.state.carttingData.productResults, type: 'caleCarttingGiveData' });
        return
    },
    //#endregion
}
