import base from '@/api/base';
import $app from '@/utils/utils.js';
import $store from "../modules/common/store";

// 打印机类型对应打印类型，宽度
let isDriverType = $store.state.cashierJurisdiction.printName.indexOf('免驱动') < 0;
let defaultLineHeight = 14;
if (typeof Cef !== 'undefined') {
    if (typeof Cef.getVersion === 'function') {
        defaultLineHeight = 9;
    }
} else {
    if (typeof LODOP !== 'undefined') {
        defaultLineHeight = 9;
    }
}
let PageTypeObj = {
    58: {
        printType: 0,
        width: 29,
        rwidth: 24
    },
    76: {
        printType: 5,
        width: 41,
        rwidth: 32
    },
    80: {
        printType: 1,
        width: 42,
        rwidth: 32
    },
    110: {
        printType: 6,
        width: 63,
        rwidth: 50
    },
    210: {
        printType: 2,
        width: 120,
        rwidth: 102
    },
}
//#region 销售小票 自定义销售小票
const sales = (args, printName = $store.state.cashierJurisdiction.printName) => {
    if (typeof Cef === 'undefined' && typeof LODOP === 'undefined') return;
    let salesItem = $store.state.printTemplate.salesData;
    if (salesItem.width === 210) return alert('暂不支持210打印')
    return handlePrintWork(args, $store.state.cashierJurisdiction.printSum || 1, 80, printName);
}
const customSales = (args, isCloudPrint = false) => {
    //自定义销售小票
    if (typeof Cef === 'undefined' && !isCloudPrint && typeof LODOP === 'undefined') return;
    let salesItem = $store.state.printTemplate.salesData;
    if ($app.isNull(salesItem.templateId) || salesItem.industryIds.indexOf($store.state.userInfo.sv_us_industrytype) < 0) {
        // 未取到模版id 或者 当前行业不在模版行业范围中
        return
    }
    if (salesItem.width === 210) return alert('暂不支持210打印')
    let waitPrintData = salesItem.width === 210 ? salesItem.ticketItemGroups210 : salesItem.ticketItemGroups;
    if (salesItem.width === 80 && $store.state.userInfo.user_id === '65212326') {
        fixedSales(args)
        return
    }

    let basicInfo = waitPrintData.find(e => e.groupName === '基本信息');
    let goodsInfo = waitPrintData.find(e => e.groupName === '商品信息');
    let payInfo = waitPrintData.find(e => e.groupName === '支付信息');
    let memberInfo = waitPrintData.find(e => e.groupName === '客户信息');
    let signingInfo = waitPrintData.find(e => e.groupName === '签名信息');
    let moreInfo = waitPrintData.find(e => e.groupName === '其他信息');
    let printDataList = [], logoSize = 80;

    if (!$app.isNull(basicInfo)) {
        let shopLogoItem = basicInfo.items.find(e => e.name === '店铺LOGO') || {};
        let printTypeItem = basicInfo.items.find(e => e.name === '单据类型') || {};
        let shopNameItem = basicInfo.items.find(e => e.name === '店铺名称') || {};
        let orderNumberItem = basicInfo.items.find(e => e.name === '单号' || e.name === '销售单号') || {};
        let orderBarcodeItem = basicInfo.items.find(e => e.name === '单号条码') || {};
        let saleTimeItem = basicInfo.items.find(e => e.name === '销售时间') || {};
        let controlNameItem = basicInfo.items.find(e => e.name === '操作员') || {};
        let salesNameItem = basicInfo.items.find(e => e.name === '销售人员') || {};
        let tableNameItem = basicInfo.items.find(e => e.name === '房台号') || {};
        let mealNumberItem = basicInfo.items.find(e => e.name === '取餐号') || {};
        let peopleNumberItem = basicInfo.items.find(e => e.name === '就餐人数') || {};

        if (shopLogoItem.required || shopLogoItem.checked) {
            // 店铺logo
            !$app.isNull(shopLogoItem.logoSize) && (logoSize = parseInt(shopLogoItem.logoSize));
            let logoUrl = $app.isNull(shopLogoItem.data) ? args.shopLogo : shopLogoItem.data;
            if (!$app.isNull(logoUrl)) {
                let printUrl = (base.imgUrl.indexOf('http') > -1 ? '' : 'http:') + $app.fmtImg(logoUrl);
                printDataList.push(
                    {
                        type: 'logo',
                        url: printUrl,
                        size: 1,
                        align: 1,
                        spaceLine: 1
                    }
                );
            };
        }
        if (shopNameItem.required || shopNameItem.checked) {
            // 店铺名称
            let shopName = $app.isNull(shopNameItem.data) ? args.shopName : shopNameItem.data;
            let lineHeight = 25
            shopNameItem.fontSize == 17 && (lineHeight = 30);
            shopNameItem.fontSize == 23 && (lineHeight = 40);
            printDataList.push(
                {
                    type: 'line',
                    text: shopName,
                    size: shopNameItem.fontSize,
                    lineHeight: lineHeight,
                    align: shopNameItem.alignment
                }
            );
        }
        if (printTypeItem.required || printTypeItem.checked || args.printType !== 1 || args.isRepeat) {
            // 单据类型
            let printSubText = '';
            if (!$app.isNull(args.customTitle)) {
                printSubText = args.customTitle;
            } else {
                printSubText = args.printType === 1 ? '销售小票' : (!$app.isNull(args.printTitleSymbol) ? '预打小票' : (args.printTitleSymbol + '小票'));
            }
            printDataList.push(
                {
                    type: 'line',
                    text: printSubText,
                    align: 1,
                    spaceLine: 1
                }
            );
        }
        if (!$app.isNull(tableNameItem) && args.sv_catering_grade && (tableNameItem.required || tableNameItem.checked)) {
            // 房台号
            printDataList.push(
                {
                    type: 'line',
                    text: '房台：' + args.sv_catering_grade,
                    size: 20,
                    lineHeight: 24
                }
            );
        }
        if (!$app.isNull(mealNumberItem) && args.sv_table_id === 0 && args.sv_catering_grade && (mealNumberItem.required || mealNumberItem.checked)) {
            // 取餐号
            printDataList.push(
                {
                    type: 'line',
                    text: '取餐号：' + args.sv_catering_grade,
                    size: 20,
                    lineHeight: 24
                }
            );
        }
        if (args.sv_person_num && args.sv_person_num > 0 && !$app.isNull(peopleNumberItem) && (peopleNumberItem.required || peopleNumberItem.checked)) {
            // 人数
            printDataList.push(
                {
                    type: 'line',
                    text: '人数：' + args.sv_person_num
                }
            );
        }

        if (!$app.isNull(args.brandNum)) {
            // 牌号
            printDataList.push(
                {
                    type: 'line',
                    text: '牌号：' + args.brandNum,
                    size: 16,
                    lineHeight: 22
                }
            );
        }
        if (!$app.isNull(args.dailySerialNumber)) {
            // 取餐号
            printDataList.push(
                {
                    type: 'line',
                    text: '取餐号：' + args.dailySerialNumber,
                    size: 16,
                    lineHeight: 22
                }
            );
        }
        if (!$app.isNull(args.orderNumber)) {
            if (orderNumberItem.required || orderNumberItem.checked) {
                // 单号
                printDataList.push(
                    {
                        type: 'line',
                        text: '单号：' + args.orderNumber
                    }
                );
            }
        }
        if (orderBarcodeItem.required || orderBarcodeItem.checked) {
            // 单号条码
            printDataList.push(
                {
                    type: 'barcode',
                    text: args.orderNumber,
                    align: 1,
                    spaceLine: 1
                },
            );
        }
        if (saleTimeItem.required || saleTimeItem.checked) {
            if (!$app.isNull(args.salePrintTime)) {
                printDataList.push(
                    {
                        type: 'line',
                        text: '销售时间：' + args.salePrintTime
                    }
                );
            }
        }
        if (controlNameItem.required || controlNameItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '操作员：' + args.controlName
                }
            );
        }

        if (!$app.isNull(salesNameItem) && !$app.isNull(args.salesName) && (salesNameItem.required || salesNameItem.checked)) {
            // 销售人员
            printDataList.push(
                {
                    type: 'line',
                    text: '销售人员：' + args.salesName
                }
            );
        }
    }
    if (!$app.isNull(goodsInfo)) {
        if (!$app.isNull(args.cardList)) {
            let cardTableData = {
                header: ['项目', '次数/剩', '有效期'],
                list: [],
                footer: []
            }
            let cardNumber = 0;
            cardTableData.list = args.cardList.map(e => {
                cardNumber += e.number;
                let leftcount = e.sv_mcc_leftcount - e.product_num
                return {
                    name: e.productName,
                    number: e.number + '/' + e.leftcount,
                    time: e.validity_date
                }
            });
            cardTableData.footer = ['合计', cardNumber + '', ''];
            printDataList = printDataList.concat($app.printMemberCardTable(cardTableData, isDriverType, salesItem.width));
        }

        if (!$app.isNull(args.tableList)) {
            // let goodsNameItem = goodsInfo.items.find(e => e.name === '商品');
            let goodsCodeItem = goodsInfo.items.find(e => e.name === '货号') || {};                 // 服装行业--商品条码  其他行业--货号
            let goodsBarCodeItem = goodsInfo.items.find(e => e.name === '编码') || {};              // 服装行业--款号  其他行业--商品条码
            let goodsNumberItem = goodsInfo.items.find(e => e.name === '数量');
            let goodsPriceItem = goodsInfo.items.find(e => e.name === '单价') || {};
            let goodsDiscountItem = goodsInfo.items.find(e => e.name === '优惠金额') || {};
            // let goodsTotalItem = goodsInfo.items.find(e => e.name === '小计');
            let orderTotalTimeItem = goodsInfo.items.find(e => e.name === '合计') || {};
            // 服装行业：款号，其他行业：条码
            let hasGoodsCode = goodsBarCodeItem.required || goodsBarCodeItem.checked ? true : false;
            // 服装行业：货号（商品条码），其他行业：货号
            let hasGoodsArtCode = goodsCodeItem.required || goodsCodeItem.checked ? true : false;
            let hasGoodsPrice = goodsPriceItem.required || goodsPriceItem.checked ? true : false;
            let showCode = hasGoodsArtCode || hasGoodsCode;
            let tableData = {
                header: [],
                list: [],
                footer: []
            }
            tableData.header.push(showCode ? '商品/编码' : '商品');
            tableData.header.push('数量');
            hasGoodsPrice ? tableData.header.push('单价') : tableData.header.push('');
            tableData.header.push('小计');
            let goodsTotal = 0;
            tableData.list = args.tableList.map(e => {
                let specs = '', tastes = '', chargings = ''
                !!e.specs && e.specs.forEach(e => {
                    specs += '[' + e.name + e.price + '元]'
                })
                !!e.tastes && e.tastes.forEach(e => {
                    tastes += '[' + e.name + e.price + '元]'
                })
                !!e.chargings && e.chargings.forEach(e => {
                    chargings += '[' + e.name + e.price + '元]'
                })
                let productName = e.productName + specs + tastes + chargings;
                if (!$app.isNull(e.cateringText)) productName += '[' + e.cateringText + ']';
                if (e.isNewSpec) productName += '[' + e.sepcs + ']';
                goodsTotal = $app.addNumber(goodsTotal, e.number);

                let goodsCode = hasGoodsCode && e.barCode ? e.barCode : '';
                let goodsArtCode = hasGoodsArtCode && e.artNo ? e.artNo : '';
                let code = goodsCode || goodsArtCode;
                if ($store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    code = goodsArtCode || goodsCode;
                }
                return {
                    name: e.isPackage ? '※' + productName : productName,
                    code: code,
                    tableName: e.tableName,
                    number: e.number + '',
                    duration: e.duration,
                    showUnit: goodsNumberItem.showUnit ? true : false,
                    unitName: e.unitName,
                    showDisCount: goodsDiscountItem.checked ? true : false,
                    couponMoney: $app.moneyFixed(e.productCouponMoney),
                    price: e.price ? $app.moneyFixed(e.price) : '',
                    dealPrice: args.sv_catering_grade ? e.dealPrice : '',         // 餐饮需要带回成交价，展示赠送
                    total: $app.moneyFixed(e.dealMoney),
                    packageGroups: e.isPackage ? e.packageGroups : ''
                }
            });
            if (orderTotalTimeItem.required || orderTotalTimeItem.checked) {
                tableData.footer = tableData.header.length === 3 ? ['合计', goodsTotal + '', args.dealTotalMoney] : ['合计', goodsTotal + '', '', args.dealTotalMoney + ''];
            }
            let tableArray = $app.printTableDate(tableData, isDriverType, salesItem.width);
            if ($store.state.userInfo.sv_us_industrytype === 27) {
                // 餐饮行业
                tableArray = $app.printTableDateCater(tableData, isDriverType, salesItem.width);
            }
            // 合并打印数组-表格
            printDataList = printDataList.concat(tableArray);
        }
    }
    if (!$app.isNull(payInfo)) {
        let totalMoneyItem = payInfo.items.find(e => e.name === '原价') || {};
        let dealMoneyItem = payInfo.items.find(e => e.name === '应收') || {};
        let payMoneyItem = payInfo.items.find(e => e.name === '实收') || {};
        let payNumberItem = payInfo.items.find(e => e.name === '支付单号') || {};
        let payNumberCodeItem = payInfo.items.find(e => e.name === '支付单号条码') || {};

        if (totalMoneyItem.required || totalMoneyItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '原价：' + args.totalMoney
                }
            );
        }

        if (!$app.isNull(args.discountMoney) && parseFloat(args.discountMoney) > 0) {
            printDataList.push(
                {
                    type: 'line',
                    text: '优惠：' + args.discountMoney
                }
            );
        }

        if (dealMoneyItem.required || dealMoneyItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '应收：' + args.receivableMoney
                }
            );
        }

        if (payMoneyItem.required || payMoneyItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '实收：' + args.collectionsMoney
                }
            );
        }

        if (payMoneyItem.required || payMoneyItem.checked) {
            if (args.exchangeMoney > 0) {
                printDataList.push(
                    {
                        type: 'line',
                        text: '找零：' + $app.moneyFixed(args.exchangeMoney)
                    }
                );
            }
        }

        if (!$app.isNull(args.payTypeList) && args.printType === 1) {
            if (args.payTypeList.length === 1) {
                printDataList.push(
                    {
                        type: 'line',
                        text: '支付方式：' + args.payTypeList[0].name
                    }
                );
            } else {
                let printTypeName = '';
                args.payTypeList.forEach(e => {
                    printTypeName += e.name + '：' + $app.moneyFixed(e.money) + '   '
                })
                printDataList.push(
                    {
                        type: 'line',
                        text: printTypeName
                    }
                );
            }
        }

        if (payNumberItem.required || payNumberItem.checked) {
            // printDataList.push(
            //     {
            //         type: 'line',
            //         text: '支付单号：' + args.orderNumber
            //     }
            // );
        }

        if (payNumberCodeItem.required || payNumberCodeItem.checked) {
            // printDataList.push(
            //     {
            //         type: 'barcode',
            //         text: args.orderNumber,
            //         align: 1,
            //         spaceLine: 1
            //     }
            // );
        }
    }

    if (!$app.isNull(memberInfo) && !$app.isNull(args.memberInfo.member_id)) {
        let memberNameItem = memberInfo.items.find(e => e.name === '会员姓名') || {};
        let cardNumberItem = memberInfo.items.find(e => e.name === '会员卡号') || {};
        let memberPhoneNumberItem = memberInfo.items.find(e => e.name === '会员电话') || {};
        let memberAddressItem = memberInfo.items.find(e => e.name === '客户地址') || {};
        let availableAmountItem = memberInfo.items.find(e => e.name === '储值余额') || {};
        let availablePointItem = memberInfo.items.find(e => e.name === '积分（本次/可用）') || {};
        let platenumberItem = memberInfo.items.find(e => e.name === '车牌号码') || {};

        if (memberNameItem.required || memberNameItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '会员姓名：' + args.memberInfo.sv_mr_name,
                    topLine: true
                }
            );
        }

        if (cardNumberItem.required || cardNumberItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '会员卡号：' + args.memberInfo.sv_mr_cardno
                }
            );
        }

        if (memberPhoneNumberItem.required || memberPhoneNumberItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '会员电话：' + args.memberInfo.sv_mr_mobile
                }
            );
        }


        if (memberAddressItem.required || memberAddressItem.checked) {
            if (args.memberInfo.sv_mr_address) {
                printDataList.push(
                    {
                        type: 'line',
                        text: '客户地址：' + args.memberInfo.sv_mr_address
                    }
                );
            }
        }

        if (availableAmountItem.required || availableAmountItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '储值余额：' + args.memberInfo.availableamount
                }
            );
        }

        if (availablePointItem.required || availablePointItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '积分（本次/可用）：' + args.memberInfo.integral
                }
            );
        }
        if (platenumberItem.required || platenumberItem.checked) {
            if (args.memberInfo.sv_mr_platenumber) {
                printDataList.push(
                    {
                        type: 'line',
                        text: '车牌号码：' + args.memberInfo.sv_mr_platenumber
                    }
                );
            }
        }
    }
    if (!$app.isNull(signingInfo)) {
        let shopownerItem = signingInfo.items.find(e => e.name === '店长签名') || {};
        let customerItem = signingInfo.items.find(e => e.name === '顾客签名') || {};

        if (shopownerItem.required || shopownerItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '店长签名：'
                }
            );
        }

        if (customerItem.required || customerItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '顾客签名：'
                }
            );
        }
    }
    if (!$app.isNull(moreInfo)) {
        let shopTelNumberItem = moreInfo.items.find(e => e.name === '店铺电话') || {};
        let shopAddressItem = moreInfo.items.find(e => e.name === '店铺地址') || {};
        let remarkItem = moreInfo.items.find(e => e.name === '备注') || {};
        let printTimeItem = moreInfo.items.find(e => e.name === '打印时间') || {};
        let customWordsItem = moreInfo.items.find(e => e.name === '自定义文字') || {};
        let customImgItem = moreInfo.items.find(e => e.name === '自定义图片') || {};
        let receiverItem = moreInfo.items.find(e => e.name === '收货人') || {};
        let receivingPhoneItem = moreInfo.items.find(e => e.name === '收货电话') || {};
        let receivingAddressItem = moreInfo.items.find(e => e.name === '收货地址') || {};

        if (shopTelNumberItem.required || shopTelNumberItem.checked) {
            let text = $app.isNull(shopTelNumberItem.data) ? $store.state.userInfo.sv_us_phone : shopTelNumberItem.data;
            printDataList.push(
                {
                    type: 'line',
                    text: '门店电话：' + text,
                    topLine: true
                }
            );
        }

        if (shopAddressItem.required || shopAddressItem.checked) {
            let text = $app.isNull(shopAddressItem.data) ? $store.state.userInfo.sv_us_address : shopAddressItem.data;
            printDataList.push(
                {
                    type: 'line',
                    text: '门店地址：' + text
                }
            );
        }

        // 外卖单 收货人 收货电话 收货地址
        if (args.sv_shipping_methods && args.sv_shipping_methods == 1) {
            if (!$app.isNull(receiverItem) && (receiverItem.required || receiverItem.checked)) {
                printDataList.push(
                    { type: 'line', text: '收货人：' + args.recipient_name },
                )
            }
            if (!$app.isNull(receivingPhoneItem) && (receivingPhoneItem.required || receivingPhoneItem.checked)) {
                printDataList.push(
                    { type: 'line', text: '收货电话：' + args.recipient_phone },
                )
            }
            if (!$app.isNull(receivingAddressItem) && (receivingAddressItem.required || receivingAddressItem.checked) && !$app.isNull(args.recipient_address)) {
                let addressArr = $app.strWrap('收货地址：' + args.recipient_address, 29);
                let addressList = addressArr.map(aItem => ({ type: 'line', text: aItem }));
                printDataList.push(...addressList);
            }
        }

        if (printTimeItem.required || printTimeItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '打印时间：' + args.printTime
                }
            );
        }
        if (remarkItem.required || remarkItem.checked) {
            printDataList.push(
                {
                    type: 'line',
                    text: '备注：' + ($app.isNull(args.remark) ? '' : args.remark),
                    size: 14,
                    lineHeight: 24,
                    spaceLine: 1
                }
            );
        }

        if (customWordsItem.required || customWordsItem.checked) {
            // 自定义文字
            let text = $app.isNull(customWordsItem.data) ? '谢谢惠顾，欢迎下次光临' : customWordsItem.data;
            printDataList.push(
                {
                    type: 'line',
                    text: text,
                    align: 1
                }
            );
        }

        if (customImgItem.required || customImgItem.checked) {
            // 自定义图片
            let imgUrl = $app.isNull(customImgItem.data) ? '' : customImgItem.data;
            if (!$app.isNull(imgUrl)) {
                let printUrl = (base.imgUrl.indexOf('http') > -1 ? '' : 'http:') + $app.fmtImg(imgUrl);
                printDataList.push(
                    {
                        type: 'photo',
                        url: printUrl,
                        align: 1,
                        spaceLine: 10
                    }
                );
            };

        }
    }

    // console.log(printDataList);

    if (isCloudPrint) {
        return {
            printData: printDataList,
            printSum: args.printSum
        }
    }
    handlePrintWork(printDataList, args.printSum, logoSize);
    if ($app.isNull(args.qrCodeList)) return
    args.qrCodeList.forEach(qrItem => {
        let list = [
            {
                type: 'line',
                text: '单号：' + qrItem.orderId,
                align: 1,
                spaceLine: 1
            },
            {
                type: 'photo',
                // url: that.$app.urlToQrcodeUrl(e.sv_bar_code),
                url: qrItem.qrcode
            },

            {
                type: 'line',
                text: qrItem.code,
                align: 1,
                spaceLine: 1
            },
            {
                type: 'line',
                text: qrItem.name + 'x' + qrItem.number + '   ' + qrItem.price,
                align: 1,
                spaceLine: 1
            },
            {
                type: 'line',
                text: '打印时间：' + args.printTime,
                align: 1,
                spaceLine: 1,
                bottomLine: true
            },
        ]
        handlePrintWork(list, 1);
    })
}
const fixedSales = (args) => {
    //指定模版销售小票
    $store.state.userInfo.user_id == '65212326' && (defaultLineHeight = 8);
    if (typeof Cef === 'undefined' && typeof LODOP === 'undefined') return;
    let salesItem = $store.state.printTemplate.salesData;
    if ($app.isNull(salesItem.templateId) || salesItem.industryIds.indexOf($store.state.userInfo.sv_us_industrytype) < 0) {
        // 未取到模版id 或者 当前行业不在模版行业范围中
        return
    }
    if (salesItem.width === 210) return alert('暂不支持210打印')
    let waitPrintData = salesItem.width === 210 ? salesItem.ticketItemGroups210 : salesItem.ticketItemGroups;

    let basicInfo = waitPrintData.find(e => e.groupName === '基本信息');
    let goodsInfo = waitPrintData.find(e => e.groupName === '商品信息');
    let payInfo = waitPrintData.find(e => e.groupName === '支付信息');
    let memberInfo = waitPrintData.find(e => e.groupName === '客户信息');
    let signingInfo = waitPrintData.find(e => e.groupName === '签名信息');
    let moreInfo = waitPrintData.find(e => e.groupName === '其他信息');
    let printDataList = [], logoSize = 150;

    let shopLogoItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '店铺LOGO') || {} : {};
    let shopNameItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '店铺名称') || {} : {};
    let shopTelNumberItem = !$app.isNull(moreInfo) ? moreInfo.items.find(e => e.name === '店铺电话') || {} : {};
    let shopAddressItem = !$app.isNull(moreInfo) ? moreInfo.items.find(e => e.name === '店铺地址') || {} : {};
    let orderBarcodeItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '单号条码') || {} : {};
    let orderNumberItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '单号' || e.name === '销售单号') || {} : {};

    let controlNameItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '操作员') || {} : {};
    let salesNameItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '销售人员') || {} : {};
    let memberNameItem = !$app.isNull(memberInfo) ? memberInfo.items.find(e => e.name === '会员姓名') || {} : {};
    let printTypeItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '单据类型') || {} : {};
    let memberPhoneNumberItem = !$app.isNull(memberInfo) ? memberInfo.items.find(e => e.name === '会员电话') || {} : {};
    let availablePointItem = !$app.isNull(memberInfo) ? memberInfo.items.find(e => e.name === '积分（本次/可用）') || {} : {};

    let saleTimeItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '销售时间') || {} : {};

    let tableNameItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '房台号') || {} : {};
    let mealNumberItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '取餐号') || {} : {};
    let peopleNumberItem = !$app.isNull(basicInfo) ? basicInfo.items.find(e => e.name === '就餐人数') || {} : {};

    if (shopLogoItem.required || shopLogoItem.checked) {
        // 店铺logo
        !$app.isNull(shopLogoItem.logoSize) && (logoSize = parseInt(shopLogoItem.logoSize));
        let logoUrl = $app.isNull(shopLogoItem.data) ? args.shopLogo : shopLogoItem.data;
        if (!$app.isNull(logoUrl)) {
            let printUrl = (base.imgUrl.indexOf('http') > -1 ? '' : 'http:') + $app.fmtImg(logoUrl);
            printDataList.push(
                {
                    type: 'logo',
                    url: printUrl,
                    align: 1,
                    spaceTopLine: 1,
                    spaceLine: 1
                }
            );
        };
    }

    if (shopNameItem.required || shopNameItem.checked) {
        // 店铺名称
        let shopName = $app.isNull(shopNameItem.data) ? args.shopName : shopNameItem.data;
        let lineHeight = 25
        shopNameItem.fontSize == 17 && (lineHeight = 30);
        shopNameItem.fontSize == 23 && (lineHeight = 40);
        printDataList.push(
            {
                type: 'line',
                text: 'Guangzhou Wanguo Plaza Outlef',
                size: shopNameItem.fontSize,
                lineHeight: lineHeight,
                align: shopNameItem.alignment
            }
        );
    }

    if (shopAddressItem.required || shopAddressItem.checked) {
        // 门店地址
        let text = $app.isNull(shopAddressItem.data) ? $store.state.userInfo.sv_us_address : shopAddressItem.data;
        printDataList.push(
            {
                type: 'line',
                text: '广东省广州市海珠区江湾路285号',
                align: 1,
            }
        );
        printDataList.push(
            {
                type: 'line',
                text: '万国广场负一层FE11商铺',
                align: 1,
            }
        );
    }

    if (shopTelNumberItem.required || shopTelNumberItem.checked) {
        // 门店电话
        let text = $app.isNull(shopTelNumberItem.data) ? $store.state.userInfo.sv_us_phone : shopTelNumberItem.data;
        printDataList.push(
            {
                type: 'line',
                text: text,
                align: 1,
                spaceLine: 1
            }
        );
    }


    if (!$app.isNull(args.orderNumber)) {
        if (orderBarcodeItem.required || orderBarcodeItem.checked) {
            // 单号条码
            printDataList.push(
                {
                    type: 'barcode',
                    text: args.orderNumber,
                    align: 1
                },
            );
        }
        if (orderNumberItem.required || orderNumberItem.checked) {
            // 单号
            printDataList.push(
                {
                    type: 'line',
                    text: args.orderNumber + $app.addSpaceChar(2),
                    align: 1,
                    spaceLine: 1
                }
            );
        }
    }


    if (controlNameItem.required || controlNameItem.checked) {
        printDataList.push(
            {
                type: 'lineTable',
                text1: '收银员：' + args.controlName,
                text2: '销售员：' + (args.salesName || '--'),
                spaceTopLine: 1
            }
        );

        printDataList.push(
            {
                type: 'lineTable',
                text1: '收银机：3',
                text2: '交易号：' + args.orderNumber.substring(args.orderNumber.length - 5, args.orderNumber.length)
            }
        );
    }
    // if (!$app.isNull(salesNameItem) && !$app.isNull(args.salesName) && (salesNameItem.required || salesNameItem.checked)) {
    //     printDataList.push(
    //         {
    //             type: 'line',
    //             text: '销售员：' + args.salesName
    //         }
    //     );
    // }

    if (memberNameItem.required || memberNameItem.checked) {
        let printSubText = '';
        if (!$app.isNull(args.customTitle)) {
            printSubText = args.customTitle;
        } else {
            printSubText = args.printType === 1 ? '销售' : (!$app.isNull(args.printTitleSymbol) ? '预打' : args.printTitleSymbol);
        }
        printDataList.push(
            {
                type: 'lineTable',
                text1: '顾客姓名：' + ($app.isNull(args.memberInfo.member_id) ? '散客' : args.memberInfo.sv_mr_name),
                text2: '收据类型：' + printSubText,
            }
        );
    }

    // if (printTypeItem.required || printTypeItem.checked || args.printType !== 1 || args.isRepeat) {
    //     // 单据类型
    //     let printSubText = '';
    //     if (!$app.isNull(args.customTitle)) {
    //         printSubText = args.customTitle;
    //     } else {
    //         printSubText = args.printType === 1 ? '销售' : (!$app.isNull(args.printTitleSymbol) ? '预打' : args.printTitleSymbol);
    //     }
    //     printDataList.push(
    //         {
    //             type: 'line',
    //             text: '单据类型：' + printSubText,
    //         }
    //     );
    // }

    if (memberPhoneNumberItem.required || memberPhoneNumberItem.checked) {
        if (!$app.isNull(args.memberInfo.member_id)) {
            let mobileText = args.memberInfo.sv_mr_mobile.length === 11 ? $app.phoneNumberHiding(args.memberInfo.sv_mr_mobile) : args.memberInfo.sv_mr_mobile;
            printDataList.push(
                {
                    type: 'lineTable',
                    text1: '手机：' + mobileText,
                    text2: '当前积分：' + (args.memberInfo.effective_integral || '')
                }
            );
        }
    }

    // if (availablePointItem.required || availablePointItem.checked) {
    //     printDataList.push(
    //         {
    //             type: 'line',
    //             text: '当前积分：' + args.memberInfo.integral
    //         }
    //     );
    // }

    printDataList.push(
        {
            type: 'line',
            text: '具体积分信息及相关规则可至微信运动俱乐部小程序查看',
            size: 7,
            align: 1,
            spaceTopLine: 1
        }
    );


    if (saleTimeItem.required || saleTimeItem.checked) {
        if (!$app.isNull(args.salePrintTime)) {
            printDataList.push(
                {
                    type: 'line',
                    text: '单据时间：' + args.salePrintTime,
                    // bottomLineSolid2: true
                }
            );
        }
    }

    if (!$app.isNull(tableNameItem) && args.sv_catering_grade && (tableNameItem.required || tableNameItem.checked)) {
        // 房台号
        // printDataList.push(
        //     {
        //         type: 'line',
        //         text: '房台：' + args.sv_catering_grade,
        //         size: 20,
        //         lineHeight: 24
        //     }
        // );
    }
    if (!$app.isNull(mealNumberItem) && args.sv_table_id === 0 && args.sv_catering_grade && (mealNumberItem.required || mealNumberItem.checked)) {
        // 取餐号
        // printDataList.push(
        //     {
        //         type: 'line',
        //         text: '取餐号：' + args.sv_catering_grade,
        //         size: 20,
        //         lineHeight: 24
        //     }
        // );
    }
    if (!$app.isNull(args.dailySerialNumber)) {
        // 取餐号
        // printDataList.push(
        //     {
        //         type: 'line',
        //         text: '取餐号：' + args.dailySerialNumber,
        //         size: 16,
        //         lineHeight: 22
        //     }
        // );
    }
    if (args.sv_person_num && args.sv_person_num > 0 && !$app.isNull(peopleNumberItem) && (peopleNumberItem.required || peopleNumberItem.checked)) {
        // 人数
        // printDataList.push(
        //     {
        //         type: 'line',
        //         text: '人数：' + args.sv_person_num
        //     }
        // );
    }

    if (!$app.isNull(goodsInfo)) {
        if (!$app.isNull(args.cardList)) {
            let cardTableData = {
                header: ['项目', '次数/剩', '有效期'],
                list: [],
                footer: []
            }
            let cardNumber = 0;
            cardTableData.list = args.cardList.map(e => {
                cardNumber += e.number;
                let leftcount = e.sv_mcc_leftcount - e.product_num
                return {
                    name: e.productName,
                    number: e.number + '/' + e.leftcount,
                    time: e.validity_date
                }
            });
            cardTableData.footer = ['合计', cardNumber + '', ''];
            printDataList = printDataList.concat($app.printMemberCardTable(cardTableData, isDriverType, salesItem.width));
        }

        if (!$app.isNull(args.tableList)) {
            // let goodsNameItem = goodsInfo.items.find(e => e.name === '商品');
            let goodsCodeItem = goodsInfo.items.find(e => e.name === '货号') || {};                 // 服装行业--商品条码  其他行业--货号
            let goodsBarCodeItem = goodsInfo.items.find(e => e.name === '编码') || {};              // 服装行业--款号  其他行业--商品条码
            let goodsNumberItem = goodsInfo.items.find(e => e.name === '数量');
            let goodsPriceItem = goodsInfo.items.find(e => e.name === '单价') || {};
            let goodsDiscountItem = goodsInfo.items.find(e => e.name === '优惠金额') || {};
            // let goodsTotalItem = goodsInfo.items.find(e => e.name === '小计');
            let orderTotalTimeItem = goodsInfo.items.find(e => e.name === '合计') || {};
            // 服装行业：款号，其他行业：条码
            let hasGoodsCode = goodsBarCodeItem.required || goodsBarCodeItem.checked ? true : false;
            // 服装行业：货号（商品条码），其他行业：货号
            let hasGoodsArtCode = goodsCodeItem.required || goodsCodeItem.checked ? true : false;
            let hasGoodsPrice = goodsPriceItem.required || goodsPriceItem.checked ? true : false;
            let showCode = hasGoodsArtCode || hasGoodsCode;
            let tableData = {
                header: [],
                list: [],
                footer: []
            }
            tableData.header.push('描述');
            tableData.header.push('数量');
            hasGoodsPrice ? tableData.header.push('单价') : tableData.header.push('');
            tableData.header.push('小计');
            let goodsTotal = 0;
            tableData.list = args.tableList.map(e => {
                let specs = '', tastes = '', chargings = ''
                !!e.specs && e.specs.forEach(e => {
                    specs += '[' + e.name + e.price + '元]'
                })
                !!e.tastes && e.tastes.forEach(e => {
                    tastes += '[' + e.name + e.price + '元]'
                })
                !!e.chargings && e.chargings.forEach(e => {
                    chargings += '[' + e.name + e.price + '元]'
                })
                let productName = e.productName + specs + tastes + chargings;
                if (!$app.isNull(e.cateringText)) productName += '[' + e.cateringText + ']';
                goodsTotal = $app.addNumber(goodsTotal, e.number);

                let goodsCode = hasGoodsCode && e.barCode ? e.barCode : '';
                let goodsArtCode = hasGoodsArtCode && e.artNo ? e.artNo : '';
                let code = goodsCode || goodsArtCode;
                if ($store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    code = e.barCode;
                }
                if (!$app.isNull(e.sepcs)) {
                    code += ',' + e.sepcs
                }
                return {
                    name: e.isPackage ? '※' + productName : productName,
                    code: code.replaceAll(',', '-'),
                    number: e.number + '',
                    showUnit: goodsNumberItem.showUnit ? true : false,
                    unitName: e.unitName,
                    showDisCount: goodsDiscountItem.required || goodsPriceItem.checked ? true : false,
                    couponMoney: $app.moneyFixed(e.productCouponMoney),
                    price: $app.moneyFixed(e.price),
                    dealPrice: $app.moneyFixed(e.dealPrice),
                    total: $app.moneyFixed(e.dealMoney),
                    packageGroups: e.isPackage ? e.packageGroups : ''
                }
            });
            // if (orderTotalTimeItem.required || orderTotalTimeItem.checked) {
            //     tableData.footer = tableData.header.length === 3 ? ['合计', goodsTotal + '', args.dealTotalMoney] : ['合计', goodsTotal + '', '', args.dealTotalMoney + ''];
            // }

            let tableArray = $app.printTableDate3(tableData, isDriverType, salesItem.width);
            if ($store.state.userInfo.sv_us_industrytype === 27) {
                // 餐饮行业
                tableArray = $app.printTableDateCater(tableData, isDriverType, salesItem.width);
            }
            // 合并打印数组-表格
            printDataList = printDataList.concat(tableArray);

            if (orderTotalTimeItem.required || orderTotalTimeItem.checked) {
                printDataList.push(
                    {
                        type: 'lineKeyValue',
                        key: '销售数：',
                        value: goodsTotal,
                        valueLength: 10,
                        valueBottom: true,
                        alignRight: true
                    }
                );
            }

            // if (!$app.isNull(args.discountMoney) && parseFloat(args.discountMoney) > 0) {
            if (!$app.isNull(args.discountMoney)) {
                printDataList.push(
                    {
                        type: 'lineKeyValue',
                        key: '整单折扣金额：',
                        value: args.discountMoney,
                        valueLength: 10,
                        valueBottom: true,
                        alignRight: true
                    }
                );
            }

            // if (!$app.isNull(args.freeZeroMoney) && parseFloat(args.freeZeroMoney) > 0) {
            if (!$app.isNull(args.freeZeroMoney)) {
                printDataList.push(
                    {
                        type: 'lineKeyValue',
                        key: '抹零：',
                        value: args.freeZeroMoney,
                        valueLength: 10,
                        valueBottom: true,
                        alignRight: true
                    }
                );
            }

            printDataList.push(
                {
                    type: 'lineKeyValue',
                    key: '总计：',
                    value: args.dealTotalMoney,
                    valueLength: 10,
                    valueBottom: true,
                    alignRight: true
                }
            );
        }
    }

    printDataList.push(
        {
            type: 'line',
            text: '支付明细',
            size: 14,
            lineHeight: 9,
            spaceTopLine: 1,
            bottomLineSolid: true
        }
    );

    printDataList.push(
        {
            type: 'betw',
            text1: '支付方式',
            text2: '金额'
        }
    );
    if (!$app.isNull(args.payTypeList) && args.printType === 1) {
        // 支付方式
        args.payTypeList.forEach(e => {
            printDataList.push(
                {
                    type: 'betw',
                    text1: e.name,
                    text2: $app.moneyFixed(e.money)
                }
            );
        })
    }

    if (!$app.isNull(moreInfo)) {
        let remarkItem = moreInfo.items.find(e => e.name === '备注') || {};
        let printTimeItem = moreInfo.items.find(e => e.name === '打印时间') || {};
        let customWordsItem = moreInfo.items.find(e => e.name === '自定义文字') || {};
        let customImgItem = moreInfo.items.find(e => e.name === '自定义图片') || {};
        let receiverItem = moreInfo.items.find(e => e.name === '收货人') || {};
        let receivingPhoneItem = moreInfo.items.find(e => e.name === '收货电话') || {};
        let receivingAddressItem = moreInfo.items.find(e => e.name === '收货地址') || {};

        // 外卖单 收货人 收货电话 收货地址
        // if (args.sv_shipping_methods && args.sv_shipping_methods == 1) {
        //     if (!$app.isNull(receiverItem) && (receiverItem.required || receiverItem.checked)) {
        //         printDataList.push(
        //             { type: 'line', text: '收货人：' + args.recipient_name },
        //         )
        //     }
        //     if (!$app.isNull(receivingPhoneItem) && (receivingPhoneItem.required || receivingPhoneItem.checked)) {
        //         printDataList.push(
        //             { type: 'line', text: '收货电话：' + args.recipient_phone },
        //         )
        //     }
        //     if (!$app.isNull(receivingAddressItem) && (receivingAddressItem.required || receivingAddressItem.checked) && !$app.isNull(args.recipient_address)) {
        //         let addressArr = $app.strWrap('收货地址：' + args.recipient_address, 29);
        //         let addressList = addressArr.map(aItem => ({ type: 'line', text: aItem }));
        //         printDataList.push(...addressList);
        //     }
        // }

        if (remarkItem.required || remarkItem.checked) {
            if (!$app.isNull(args.remark)) {
                printDataList.push(
                    {
                        type: 'line',
                        text: '备注：' + args.remark,
                        size: 14,
                        lineHeight: 24,
                        spaceTopLine: 1,
                        spaceLine: 1
                    }
                );
            }
        }

        if (customWordsItem.required || customWordsItem.checked) {
            // 自定义文字
            // let text = $app.isNull(customWordsItem.data) ? '谢谢惠顾，欢迎下次光临' : customWordsItem.data;
            // printDataList.push(
            //     {
            //         type: 'line',
            //         text: text,
            //         align: 1,
            //         spaceTopLine: 1,
            //         spaceLine: 1
            //     }
            // );
            printDataList.push(
                {
                    type: 'line',
                    text: '',
                    spaceTopLine: 1,
                    spaceLine: 1
                }
            );

            printDataList.push(
                {
                    type: 'line',
                    text: '谢谢您的来Under Armour 购物',
                    align: 1,
                    lineHeight: 18
                }
            );
            printDataList.push(
                {
                    type: 'line',
                    text: 'THANK YOU FOR SHOPPING',
                    align: 1,
                    sapceHeight: 16,
                    spaceLine: 1
                }
            );

            printDataList.push(
                {
                    type: 'remark',
                    text: '祝您购物愉快，请妥曾保管您的购物小票，以便我们更高效的为您服务！如商品无质量问题只需退换，请保证商品及包装完好且不影响二次销售，请在七天内持购物小票前来，如服装及配件遇质量问题，请在三十天内持购物小费前来。如鞋类遇质量问题，请在九十天内持购物小票前来，已开发票的顾客，需将发票一并带来。刷卡结账顾客需同时带好原银行卡及刷卡单，到门店发起退款操作后，实际退款到账时间以各银行处理为准。',
                    align: 1,
                    spaceLine: 1
                }
            );

            printDataList.push(
                {
                    type: 'line',
                    text: 'https://www.underarmour.cn',
                    align: 1,
                    sapceHeight: 8,
                    spaceLine: 1
                }
            );

            printDataList.push(
                {
                    type: 'line',
                    text: '用激情、设计和不断创新，让运动者更强',
                    align: 1,
                    sapceHeight: 8,
                    spaceLine: 1
                }
            );
        }

        if (customImgItem.required || customImgItem.checked) {
            // 自定义图片
            let imgUrl = $app.isNull(customImgItem.data) ? '' : customImgItem.data;
            if (!$app.isNull(imgUrl)) {
                printDataList.push(
                    {
                        type: 'line',
                        text: '扫码二维码加入我们',
                        align: 1
                    }
                );
                printDataList.push(
                    {
                        type: 'photo',
                        url: $app.fmtImg(imgUrl),
                        align: 1
                    }
                );
            };
        }
    }

    // console.log(printDataList);
    handlePrintWork(printDataList, args.printSum, logoSize);
    if ($app.isNull(args.qrCodeList)) return
    args.qrCodeList.forEach(qrItem => {
        let list = [
            {
                type: 'line',
                text: '单号：' + qrItem.orderId,
                align: 1,
                spaceLine: 1
            },
            {
                type: 'photo',
                // url: that.$app.urlToQrcodeUrl(e.sv_bar_code),
                url: qrItem.qrcode
            },

            {
                type: 'line',
                text: qrItem.code,
                align: 1,
                spaceLine: 1
            },
            {
                type: 'line',
                text: qrItem.name + 'x' + qrItem.number + '   ' + qrItem.price,
                align: 1,
                spaceLine: 1
            },
            {
                type: 'line',
                text: '打印时间：' + args.printTime,
                align: 1,
                spaceLine: 1,
                bottomLine: true
            },
        ]
        handlePrintWork(list, 1);
    })
}
//#endregion
function handlePrintWork(printDataList, printSum, logoSize = 80, printName = $store.state.cashierJurisdiction.printName) {
    let salesItem = $store.state.printTemplate.salesData;
    let printData = {
        HeaderList: [],
        Action: 1,
        TextFont: 0,
        PageWidth: salesItem.width || 58,
        LineHeight: 16,
        PagePadding: 0,
        PrintVersion: 1,
        LogoData: {
            Align: 1,
            Width: logoSize,
            Height: logoSize,
            ImageString: ''
        },
        QRCodeData: {
            Width: 70,
            Height: 70
        },
        CustomPhoto: {
            Width: 148,
            Height: 148,
            ImageString: ''
        },
        PageType: PageTypeObj[salesItem.width] ? PageTypeObj[salesItem.width].printType : 0
    }
    handlePrintWork
    printDataList.forEach((e, i) => {
        if (e.spaceTopLine) {
            printData.HeaderList.push(addSpaceLine(e.sapceHeight || defaultLineHeight));
        }

        if (e.topLine) {
            printData.HeaderList.push(addLineDashed());
        }

        if (e.type === 'logo') {
            printData.LogoData.ImageString = e.url;
            let logoItem = {
                Content: '',
                Columns: 1,
                RowNum: 1,
                Align: 1,
                type: 'logo'
            };
            printData.HeaderList.push(logoItem);
        }
        if (e.type === 'photo') {
            printData.CustomPhoto.ImageString = e.url;
            let photoItem = {
                type: 'photo',
                Content: '',
                Columns: 1,
                RowNum: 1,
                Align: 1,
            };
            printData.HeaderList.push(photoItem);
        }

        let limitSize = e.size ? e.size : 9
        let limitLength = parseInt(9 / limitSize * (PageTypeObj[salesItem.width] ? PageTypeObj[salesItem.width].width : 29))
        // 整行文字类型
        if (e.type === 'line') {
            $app.strWrap(e.text, limitLength).forEach(k => {
                printData.HeaderList.push(addLineText(k, e.align, e.size, e.lineHeight, e.CutPaper));
            })
        }
        if (e.type === 'remark') {
            let remarkLimitLength = parseInt(PageTypeObj[salesItem.width] ? PageTypeObj[salesItem.width].rwidth : 20)
            $app.strWrap(e.text, remarkLimitLength).forEach(k => {
                printData.HeaderList.push(addLineText(k, e.align, e.size, e.lineHeight, e.CutPaper));
            })
        }
        if (e.type === 'lineTable') {
            let leftWidth = salesItem.width === 80 ? 20 : 16;
            let rightWidth = limitLength - leftWidth - 1;
            let textList = [];
            $app.strWrap(e.text1, leftWidth).forEach(k => {
                textList.push($app.getLength(k) < leftWidth ? (k + $app.addSpaceChar(leftWidth - $app.getLength(k))) : k)
            })
            $app.strWrap(e.text2, rightWidth).forEach((k, pos) => {
                let text = $app.getLength(k) < rightWidth ? (k + $app.addSpaceChar(rightWidth - $app.getLength(k))) : k;
                if (textList[pos]) {
                    textList[pos] = textList[pos] + $app.addSpaceChar(1) + text
                } else {
                    textList[pos] = $app.addSpaceChar(leftWidth + 1) + text
                }
                // printData.HeaderList.push(addLineText(k, e.align, e.size, e.lineHeight, e.CutPaper));
            })
            textList.forEach(k => {
                printData.HeaderList.push(addLineText(k, e.align, e.size, e.lineHeight, e.CutPaper));
            })
        }
        // 整行左右布局
        if (e.type === 'betw') {
            let betwTextSpace = limitLength - $app.getLength(e.text1) - $app.getLength(e.text2);
            let betwText = e.text1 + $app.addSpaceChar(betwTextSpace) + e.text2;
            printData.HeaderList.push(addLineText(betwText));
        }
        // key：value
        if (e.type === 'lineKeyValue') {
            let valueLeftLength = parseInt(e.valueLength - $app.getLength(e.value));
            valueLeftLength = valueLeftLength < 0 ? 0 : valueLeftLength;
            let valueText = $app.addSpaceChar(valueLeftLength) + e.value;
            if (e.alignRight) {
                valueText = $app.addSpaceChar(e.valueLength - $app.getLength(e.value)) + e.value;
            }
            let keyValueText = e.key + valueText;
            if (e.alignRight) {
                let keyValueTextSpace = $app.subtractNumber(limitLength, $app.getLength(keyValueText));
                let keyValueTextRight = $app.addSpaceChar(keyValueTextSpace) + keyValueText;
                printData.HeaderList.push(addLineText(keyValueTextRight, 0, e.size, (e.valueBottom ? defaultLineHeight : e.lineHeight), e.CutPaper));
                if (e.valueBottom) {
                    let spaceLength = $app.subtractNumber(limitLength, e.valueLength);
                    printData.HeaderList.push(addLineSolid(spaceLength, e.valueLength));
                }
            } else {
                printData.HeaderList.push(addLineText(keyValueText, 0, e.size, (e.valueBottom ? defaultLineHeight : e.lineHeight), e.CutPaper));
                printData.HeaderList.push(addLineSolid($app.getLength(e.key), e.valueLength));
            }
        }


        if (e.type === 'tableCalcHeader') {
            printData.HeaderList.push(addLineDashed());
            let text = '';
            e.list.forEach(e => {
                text += e.text;
            });
            printData.HeaderList.push(addLineText(text));
            printData.HeaderList.push(addLineDashed());
        }
        // 自动表格行数
        if (e.type === 'tableCalc') {
            let text = '';
            e.list.forEach(e => {
                text += e.text;
            });
            $app.strWrap(text.trimEnd(), limitLength).forEach(k => {
                printData.HeaderList.push(addLineText(k, e.align, e.size, e.lineHeight, e.CutPaper));
            })
        }
        // 条形码类型
        if (e.type === 'barcode' && e.text) {
            printData.HeaderList.push(addBarcode(e.text, e.showText));
        }
        if (e.spaceLine) {
            for (let index = 0; index < e.spaceLine; index++) {
                printData.HeaderList.push(addSpaceLine(e.sapceHeight || defaultLineHeight));
            }
        }
        if (e.bottomLine) {
            printData.HeaderList.push(addLineDashed());
        }
        if (e.bottomLineSolid) {
            printData.HeaderList.push(addLineSolid(e.solidWidth));
        }
        if (e.bottomLineSolid2) {
            printData.HeaderList.push(addLineSolid2(e.solidWidth));
        }
    });
    // console.log(printData);
    // console.log(JSON.stringify(printData));
    for (let index = 0; index < printSum; index++) {
        if (salesItem.width === 210) {
            // Cef.CustomTicket210(JSON.stringify(printData), '1', '', printSum);
        } else {
            // 免驱动方式打印 $store.state.cashierJurisdiction.printName
            if (typeof Cef !== 'undefined') {
                if (typeof Cef.CustomTicket !== 'undefined') {
                    Cef.CustomTicket(JSON.stringify(printData), '1', printName, 1);
                    continue
                }
            }
            if (typeof LODOP !== 'undefined') {
                Lodop_print(printData, printName)
            }
        }
    }
}

//#region LODOP 打印相关
function Lodop_print(data, printName) {
    // 1in = 2.54cm = 25.4mm = 72pt = 96px。
    // LODOP.SET_LICENSES("", "EE0887D00FCC7D29375A695F728489A6", "C94CEE276DB2187AE6B65D56B3FC2848", "");
    LODOP.SET_LICENSES("", "90B1BEF38294DE4FB6616E7F99A694B7CDD", "", "");
    LODOP.PRINT_INIT('小票打印');
    /**
     * SET_PRINT_PAGESIZE(intOrient,intPageWidth,intPageHeight,strPageName);
     * 说明地址 https://my.oschina.net/ind/blog/291917
     * intOrient：打印方向及纸张类型
            值为1---纵向打印，固定纸张； 
            值为2---横向打印，固定纸张；  
            值为3---纵向打印，宽度固定，高度按打印内容的高度自适应；
            值为0(或其它)---打印方向由操作者自行选择或按打印机缺省设置。
       intPageWidth：纸张宽，单位为0.1mm 譬如该参数值为45，则表示4.5mm,计量精度是0.1mm。
       intPageHeight：固定纸张时该参数是纸张高；高度自适应时该参数是纸张底边的空白高，计量单位与纸张宽一样。
       strPageName：纸张名，必须intPageWidth等于零时本参数才有效，有如下选择：
            Letter, LetterSmall, Tabloid, Ledger, Legal,Statement, Executive, 
            A3, A4, A4Small, A5, B4, B5, Folio, Quarto, qr10X14, qr11X17, Note, 
            Env9, Env10, Env11, Env12,Env14, Sheet, DSheet, ESheet
     */
    // 58 == 192  80 == 
    let printWidth = (data.PageWidth / 58) * 58 / 29 * 96;
    if (printName) LODOP.SET_PRINTER_INDEX(printName);
    let curH = 0;
    data.HeaderList.forEach(item => {
        LODOP.SET_PRINT_STYLE('FontSize', item.FontSize);
        if (item.type === 'logo') {
            let { LogoData } = data;
            let logoLeft = (printWidth - LogoData.Width) / 2;
            LODOP.ADD_PRINT_IMAGE(curH, logoLeft, LogoData.Width, LogoData.Height, '<img border="0" src=' + LogoData.ImageString + ' />');
            LODOP.SET_PRINT_STYLEA(0, 'Stretch', 1);
            curH += LogoData.Height;
            return
        }
        if (item.type === 'photo') {
            let { CustomPhoto } = data;
            let photoLeft = (printWidth - CustomPhoto.Width) / 2;
            LODOP.ADD_PRINT_IMAGE(curH, photoLeft, CustomPhoto.Width, CustomPhoto.Height, '<img border="0" src=' + CustomPhoto.ImageString + ' />');
            LODOP.SET_PRINT_STYLEA(0, 'Stretch', 1);
            curH += CustomPhoto.Height;
        } else {
            // if (QRcode) {
            //     let { QRCodeData } = data;
            //     let QRCodeLeft = (printWidth - LogoData.Width) / 2;
            //     LODOP.ADD_PRINT_BARCODE(0, QRCodeLeft, QRCodeData.Width, QRCodeData.Height, "QRCode", QRCodeData); //设置二维码位置、宽高、字体、值
            //     LODOP.SET_PRINT_STYLEA(0, "QRCodeErrorLevel", "L");
            // }
            if (item.type === 'barcode') {
                let barCodeLeft = (printWidth - 140) / 2;
                LODOP.SET_PRINT_STYLE("FontName", '宋体');
                LODOP.ADD_PRINT_BARCODE(curH + 10, barCodeLeft, 140, 35, "128Auto", item.Content);      //设置条码位置、宽高、字体、值
                LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);                                            //设置是否显示下方的文字
                curH += 45;
            } else {
                if (item.Content !== '') {
                    LODOP.SET_PRINT_STYLE("FontName", "黑体");
                    LODOP.SET_PRINT_STYLE("Alignment", item.Align + 1);
                    LODOP.ADD_PRINT_TEXT(curH, 0, printWidth, item.LineHeight, item.Content);
                }
                curH = curH + item.LineHeight + 5;
            }
        }
    })
    LODOP.SET_PRINT_PAGESIZE(3, data.PageWidth + 'mm', 0, '');
    if (data.Action == 1) return LODOP.PRINT();
    LODOP.PREVIEW();
}
//#endregion

//#region 销售小票-退货
// type: 1 商品退货  2 整单退货  3 整单退货
const salesReturn = (args) => {
    if (typeof Cef === 'undefined' && typeof LODOP === 'undefined') return;
    let salesItem = $store.state.printTemplate.salesData;
    if (salesItem.width === 210) return
    let printDataList = [], logoSize = 80;
    // 店铺logo
    if (!$app.isNull(args.shopLogo)) {
        let printUrl = (base.imgUrl.indexOf('http') > -1 ? '' : 'http:') + $app.fmtImg(args.shopLogo);
        printDataList.push(
            {
                type: 'logo',
                url: printUrl,
                size: 1,
                align: 1,
                spaceLine: 1
            }
        );
    };
    // 店铺名称
    printDataList.push(
        {
            type: 'line',
            text: args.shopName,
            size: 17,
            lineHeight: 30,
            align: 1
        }
    );
    // 打印类型
    printDataList.push(
        {
            type: 'line',
            text: args.printTtitle,
            align: 1,
            spaceLine: 1
        }
    );
    if (!$app.isNull(args.orderNumber)) {
        // 单号
        printDataList.push(
            {
                type: 'line',
                text: '单号：' + args.orderNumber
            }
        );
        // 单号条码
        printDataList.push(
            {
                type: 'barcode',
                text: args.orderNumber,
                align: 1,
                spaceLine: 1
            },
        );
    }
    // 打印时间
    printDataList.push(
        {
            type: 'line',
            text: args.printTime
        }
    );
    // 操作员
    printDataList.push(
        {
            type: 'line',
            text: args.controlName
        }
    );

    let tableData = {
        header: ['商品/编码', '数量', '单价', '小计'],
        list: [],
        footer: []
    }
    tableData.list = args.tableList.map(e => {
        let specs = '', tastes = '', chargings = ''
        !!e.specs && e.specs.forEach(e => {
            specs += '[' + e.name + e.price + '元]'
        })
        !!e.tastes && e.tastes.forEach(e => {
            tastes += '[' + e.name + e.price + '元]'
        })
        !!e.chargings && e.chargings.forEach(e => {
            chargings += '[' + e.name + e.price + '元]'
        })
        let productName = e.productName + specs + tastes + chargings;
        if (e.isNewSpec) productName += productName + ' [' + e.sepcs + ']'
        return {
            name: productName,
            code: e.barCode || '',
            number: e.number + '',

            price: $app.moneyFixed(e.price),
            total: $app.moneyFixed(e.dealMoney)
        }
    });
    tableData.footer = ['合计', args.totalNumber + '', '', args.collectionsMoney]

    let tableArray = $app.printTableDate(tableData, isDriverType, salesItem.width);
    // 合并打印数组-表格
    printDataList = printDataList.concat(tableArray);

    if (args.addGoodsMoney > 0 && args.hasPayMoney) {
        printDataList.push(
            {
                type: 'line',
                text: '退货金额：' + args.returnMoney
            }
        );
        printDataList.push(
            {
                type: 'line',
                text: '换货金额：' + args.addGoodsMoney
            }
        );
    } else {
        printDataList.push(
            {
                type: 'line',
                text: '退款金额：' + args.returnMoney
            }
        );
    }

    if (args.collectionsMoney > 0) {
        printDataList.push(
            {
                type: 'line',
                text: '应付金额：' + args.collectionsMoney
            }
        );
    } else {
        printDataList.push(
            {
                type: 'line',
                text: '实退款：' + Math.abs(args.collectionsMoney)
            }
        );
    }

    // 退款方式
    if (!$app.isNull(args.payment)) {
        printDataList.push(
            {
                type: 'line',
                text: '退款方式：' + args.payment
            }
        );
    }

    if (!$app.isNull(args.memberInfo.member_id)) {
        printDataList.push(
            {
                type: 'line',
                text: '会员姓名：' + args.memberInfo.sv_mr_name,
                topLine: true
            }
        );

        printDataList.push(
            {
                type: 'line',
                text: '会员卡号：' + args.memberInfo.sv_mr_cardno
            }
        );

        let mobileText = args.memberInfo.sv_mr_mobile.length === 11 ? $app.phoneNumberHiding(args.memberInfo.sv_mr_mobile) : args.memberInfo.sv_mr_mobile;
        printDataList.push(
            {
                type: 'line',
                text: '会员电话：' + mobileText
            }
        );

        printDataList.push(
            {
                type: 'line',
                text: '储值余额：' + args.availableamount || args.memberInfo.sv_mw_availableamount,
                bottomLine: true
            }
        );
    }

    printDataList.push(
        {
            type: 'line',
            text: '电话：' + $store.state.userInfo.sv_us_phone
        }
    );

    printDataList.push(
        {
            type: 'line',
            text: '地址：' + $store.state.userInfo.sv_us_address
        }
    );

    // 备注
    printDataList.push(
        {
            type: 'line',
            text: '备注：' + ($app.isNull(args.remark) ? '' : args.remark),
            spaceLine: 1
        }
    );

    // console.log(printDataList);

    handlePrintWork(printDataList, 1);
}
//#regio 售课打印
const salesCourse = (args) => {
    if (typeof Cef === 'undefined' && typeof LODOP === 'undefined') return;
    let salesItem = $store.state.printTemplate.salesData;
    let printDataList = [], logoSize = 80;
    // 店铺logo
    if (!$app.isNull(args.shopLogo)) {
        let printUrl = (base.imgUrl.indexOf('http') > -1 ? '' : 'http:') + $app.fmtImg(args.shopLogo);
        printDataList.push(
            {
                type: 'logo',
                url: printUrl,
                size: 1,
                align: 1,
                spaceLine: 1
            }
        );
    };
    // 店铺名称
    printDataList.push(
        {
            type: 'line',
            text: args.shopName,
            size: 17,
            lineHeight: 30,
            align: 1
        }
    );
    // 打印类型
    printDataList.push(
        {
            type: 'line',
            text: args.printTtitle,
            align: 1,
            spaceLine: 1
        }
    );
    if (!$app.isNull(args.orderNumber)) {
        printDataList.push(
            {
                type: 'line',
                text: '收据单号：' + args.orderNumber
            }
        );
    }
    if ($app.isNull(args.isFitness)) {
        // 健身房不打印
        printDataList.push(
            {
                type: 'line',
                text: '收据类型：报名/续费',
            }
        );
    }
    printDataList.push(
        {
            type: 'line',
            text: '经 办 人：' + args.controlName,
        }
    );
    // 打印时间
    printDataList.push(
        {
            type: 'line',
            text: '经办日期：' + args.printTime,
            bottomLine: true
        }
    );

    if (!$app.isNull(args.memberInfo.member_id)) {
        printDataList.push(
            {
                type: 'line',
                text: (args.isFitness ? '会员姓名：' : '学员姓名：') + args.memberInfo.sv_mr_name
            }
        );

        let mobileText = args.memberInfo.sv_mr_mobile.length === 11 ? $app.phoneNumberHiding(args.memberInfo.sv_mr_mobile) : args.memberInfo.sv_mr_mobile;
        printDataList.push(
            {
                type: 'line',
                text: '手机号码：' + mobileText,
                bottomLine: true
            }
        );
    }

    let tableData = {
        // header: ['购买项目', '购买数量', '金额'],
        header: ['名称', '数量', '金额'],
        list: []
    }
    const unitString = {
        100: '课时',
        200: '月',
        300: '天',
        400: '期',
    }
    tableData.list = args.tableList.map(e => {
        let timeItem = {}
        let numberString = e.number;
        if (!$app.isNull(e.timedetail) && $app.isNull(args.isFitness)) {
            timeItem = e.timedetail[e.salePos];
            numberString += unitString[timeItem.sv_class_hour_type];
            if (e.timedetail[e.salePos].sv_give_class_hour > 0) numberString += '(' + timeItem.sv_give_class_hour + unitString[timeItem.sv_class_hour_type] + ')';
        }
        return {
            name: e.sv_p_name,
            number: numberString,
            price: $app.moneyFixed(e.priceTotal),
            time: args.isFitness ? '' : e.sv_effective_time
        }
    });

    let tableArray = $app.printTableCourse(tableData, isDriverType, salesItem.width);
    // 合并打印数组-表格
    printDataList = printDataList.concat(tableArray);

    printDataList.push(
        {
            type: 'line',
            text: '合计金额：' + args.totalMoney,
            topLine: true
        }
    );

    printDataList.push(
        {
            type: 'line',
            text: '应付金额：' + args.totalMoney,
        }
    );

    if (!$app.isNull(args.payment)) {
        printDataList.push(
            {
                type: 'line',
                text: '支付方式：' + args.payment,
            }
        );
    }

    printDataList.push(
        {
            type: 'line',
            text: '实付金额：' + args.dealMoney,
            topLine: true,
            spaceLine: 1
        }
    );
    printDataList.push(
        {
            type: 'line',
            text: '备注：' + ($app.isNull(args.remark) ? '' : args.remark),
            bottomLine: true,
            spaceLine: 1
        }
    );

    printDataList.push(
        {
            type: 'line',
            text: '请务必收好此收据，以便作为退费依据',
            align: 1
        }
    );


    // printDataList.push(
    //     {
    //         type: 'line',
    //         text: '电话：' + $store.state.userInfo.sv_us_phone
    //     }
    // );

    // printDataList.push(
    //     {
    //         type: 'line',
    //         text: '地址：' + $store.state.userInfo.sv_us_address
    //     }
    // );

    // console.log(printDataList);

    handlePrintWork(printDataList, 1);
}
//#endregion

//#region 处理自定义打印组件 addSpaceLine addLineText addBarcode addLineDashed
function addSpaceLine(LineHeight = defaultLineHeight) {
    return {
        Content: '',
        Columns: 1,
        RowNum: 1,
        Align: 0,
        RowMaxLength: LineHeight,
        LineHeight
    }
}
function addLineText(content, align = 0, fontSize = 9, LineHeight = defaultLineHeight, CutPaper) {
    return {
        Content: content,
        Columns: 1,
        RowNum: 1,
        Align: align,
        FontSize: fontSize,
        RowMaxLength: 10,
        LineHeight,
        CutPaper
    }
}
function addBarcode(content, showText = false) {
    return {
        Columns: 1,
        RowNum: 1,
        RowMaxLength: 10,
        Align: 1,
        FontSize: 12,
        LineHeight: 40,
        Content: content,
        type: 'barcode',
        hideText: showText ? false : true
    }
}
function addLineDashed() {
    let printWidth = $store.state.printTemplate.salesData.width;
    let string = '';
    let pageWidth = PageTypeObj[printWidth] ? PageTypeObj[printWidth].width : 29;
    for (let index = 0; index < Math.ceil(pageWidth / 2); index++) {
        string += '—';
    }
    return {
        Content: string,
        Columns: 1,
        RowNum: 1,
        Align: 0,
        RowMaxLength: defaultLineHeight,
        LineHeight: defaultLineHeight
    }
}
function addLineSolid(sapceLength = 0, length) {
    let printWidth = $store.state.printTemplate.salesData.width;
    let printWidthLenght = PageTypeObj[printWidth] ? PageTypeObj[printWidth].width : 29;
    let string = '';
    let lineWidth = length ? length : $app.subtractNumber(printWidthLenght, sapceLength);
    for (let index = 0; index < sapceLength; index++) {
        string += ' ';
    }
    for (let index = 0; index < Math.ceil(lineWidth / 2); index++) {
        string += '─';
    }
    return {
        Content: string,
        Columns: 1,
        RowNum: 1,
        Align: 0,
        RowMaxLength: 6,
        LineHeight: 6
    }
}
function addLineSolid2(sapceLength = 0, length) {
    let printWidth = $store.state.printTemplate.salesData.width;
    let printWidthLenght = PageTypeObj[printWidth] ? PageTypeObj[printWidth].width : 29;
    let string = '';
    let lineWidth = length ? length : $app.subtractNumber(printWidthLenght, sapceLength);
    for (let index = 0; index < sapceLength; index++) {
        string += ' ';
    }
    for (let index = 0; index < Math.ceil(lineWidth / 2); index++) {
        string += '____________________________________________________________';
    }
    return {
        Content: string,
        Columns: 1,
        RowNum: 1,
        Align: 0,
        RowMaxLength: defaultLineHeight,
        LineHeight: 6
    }
}
//#endregion
export default { sales, customSales, fixedSales, salesReturn, salesCourse }