import { stockApi } from '@/api/index';
import $app from '@/utils/utils.js';
import $print from './print.js';
import { catering } from './cateringPrint.js';
import $store from "../modules/common/store";
import { printLabel } from '@/utils/prin';

var userInfo, printerInfo, ticketShowPhone;
function getInfo() {
    userInfo = $app.valuesFilterNull($store.state.userInfo);                   // 店铺信息
    printerInfo = $app.valuesFilterNull($store.state.cashierJurisdiction);     // 打印机信息
    ticketShowPhone = $app.valuesFilterNull($store.state.JurisdictionObj.MbilePhoneMhow_Switch);     // 是否不显示完整手机号
}
getInfo();
//#region 轮询打印多个订单
// orderList-订单列表 type-订单类型
function polling(orderList, type) {
    getInfo();
    // 后厨打印根据商品绑定的ip分单打
    let printListByIp = [];
    // 是否要后厨打印
    let networkPrint = userInfo.sv_us_industrytype === 27 && type !== 'waiting' && type !== 'androidAdd';

    orderList.forEach(e => {
        if ($app.isNull(e.prlist)) return
        // 把null、undefined替换为'' 防止打印出null undefined字眼
        e = $app.valuesFilterNull(e);
        // 打印前台小票
        concatSalesTicket(e, type);
        e.sv_shipping_methods === 1 && concatSalesTicket(e, '配送单');

        // 每个商品绑定的后厨ip可能不一样，所以需重组后厨打印数据
        networkPrint && e.prlist.forEach(item => {
            const index = printListByIp.length > 0 ? printListByIp.findIndex(f => (f.prlist[0].PrinterIp === item.PrinterIp)) : -1;
            if (index > -1) {
                printListByIp[index].prlist.push(item);
            } else {
                printListByIp.push({ ...e, prlist: [{ ...item }] });
            }
        })
    })
    networkPrint && printListByIp.forEach(async (e) => {
        if ($app.isNull(e.prlist)) return
        e = $app.valuesFilterNull(e);
        let ids = [];
        e.prlist.forEach(e => {
            ids.push({ product_id: e.product_id, packageproduct_id: 0, packagegroup_id: 0 })
        })
        await stockApi.getKitchenPrinter(ids).then(res => {
            if (res) {
                // 加菜打印
                let tableName = e.sv_catering_grade;
                let tableList = [];
                e.prlist.map(item => {
                    let goodsItem = res.find(k => item.product_id === k.product_id);
                    let kitchenPrinter = $app.isNull(goodsItem) ? '' : JSON.parse(goodsItem.kitchenPrinter);
                    if ($app.isNull(kitchenPrinter)) return
                    if (kitchenPrinter[0].sv_print_model === 0) {
                        toPrintLabel(item, kitchenPrinter);
                        return
                    }
                    let specs = [], tastes = [], chargings = [];
                    if (!$app.isNull(item.cateringChargingJson)) {
                        const cateringList = JSON.parse(item.cateringChargingJson);
                        if (Array.isArray(cateringList)) {
                            specs = cateringList.filter(caterItem => caterItem.sv_taste_data_type === 2).map(g => ({ name: g.sv_taste_name }));
                            tastes = cateringList.filter(caterItem => caterItem.sv_taste_data_type === 0).map(g => ({ name: g.sv_taste_name }));
                            chargings = cateringList.filter(caterItem => caterItem.sv_taste_data_type === 1).map(g => ({ name: g.sv_taste_name }));
                        }
                    }

                    tableList.push({
                        product_name: item.product_name,
                        product_num: item.product_num,
                        sv_return_status: item.sv_return_status,
                        remark: item.sv_remark,
                        specs,
                        tastes,
                        // tastes: getTastes(item.cateringChargingJson),
                        chargings,
                        kitchenPrinter,
                        printer_name: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_name,
                        printer_ip: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_ip,
                        printer_port: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_port,
                        sv_template_josn: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_template_josn
                    })
                    // 如果是套餐商品
                    if (!$app.isNull(item.combination_new)) {
                        let childrenProducts = JSON.parse(item.combination_new);
                        childrenProducts.forEach(f => {
                            let specs = [], tastes = [], chargings = [];
                            if (!$app.isNull(f.specItem)) {
                                specs = [{ name: f.specItem.name }]
                            }
                            if (!$app.isNull(f.tasteIdList)) {
                                tastes = f.tasteIdList[0].map(g => ({ name: g.name }))
                            }
                            if (!$app.isNull(f.chargingIdList)) {
                                chargings = f.chargingIdList.map(g => ({ name: g.name }))
                            }
                            tableList.push({
                                product_name: '--' + f.sv_p_name,
                                product_num: f.product_number,
                                sv_return_status: item.sv_return_status,
                                remark: item.sv_remark,
                                specs,
                                tastes,
                                chargings,
                                kitchenPrinter,
                                printer_name: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_name,
                                printer_ip: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_ip,
                                printer_port: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_port,
                                sv_template_josn: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_template_josn
                            })
                        })
                    }
                })
                if ($app.isNull(tableList)) return
                let printData = {
                    tableId: e.sv_table_id,
                    tableName: tableName,
                    orderId: e.order_running_id,
                    remark: e.remark || e.sv_remarks,
                    orderTime: $app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    tableList: tableList
                }
                cashierCateringPrint(printData, type);
            }
        });
    })
}
//#endregion
function toPrintLabel(e, kitchenPrinter) {                       // 打印标签
    const temJson = getTemplate(kitchenPrinter[0].sv_labeltemplate_id);
    if ($app.isNull(temJson)) return alert('获取标签模板数据失败')

    e.sv_productionplace = userInfo.sv_us_address;    // 店铺地址
    e.sv_us_phone = userInfo.sv_us_phone;             // 店铺电话

    e.tastes = '';
    let tastes = getTastes(e.cateringChargingJson);
    !$app.isNull(tastes) && (e.tastes += tastes.reduce((txt, item, i) => (txt + item.name + ' '), ''));

    for (let i = 0; i < e.product_num; i++) {
        printLabel({
            data: [e],
            tem: temJson,
            printName: kitchenPrinter[0].sv_printer_ip,
            dir: '0',
            columnNum: 1,
            userInfo: userInfo
        });
    }
}
function getTemplate(temId) {         // 获取用户标签模板
    let templateList = [];
    // await stockApi.getTemplateByUser().then(res => {
    //     if (!$app.isNull(res)) {
    //         // 筛选掉非本行业的系统模板
    //         templateList.unshift(...res);
    //     }
    // });
    templateList = templateList.map(e => {
        e.pricesTagItems = $app.isNull(e.pricesTagItems) ? [] : e.pricesTagItems.map(e => {
            switch (e.fontStyle) {
                case 0: e.b = false; e.u = false; break
                case 1: e.b = true; e.u = false; break
                case 4: e.u = true; e.b = false; break
                case 5: e.b = true; e.u = true; break
            }
            return { ...e, itemType: e.priceTagItemType, barCodeWidth: e.barCodeWidth === 2 ? 212 : e.barCodeWidth === 1 ? 141 : e.barCodeWidth }
        });
        return { ...e, createTime: $app.currentTime(new Date(e.createTime), 'yyyy-MM-dd HH:mm') }
    });
    return templateList.find(e => e.templateId === temId)
}
function getTastes(e) {    // 加料 数据
    if ($app.isNull(e)) return [];
    e = JSON.parse(e)

    let productTaste = e.map(tItem => ({ name: tItem.sv_taste_name }));
    productTaste = productTaste.filter(f => !$app.isNull(f.name));
    return productTaste;
}

//#region 餐饮收银打印
// printData-订单数据子级要有prlist
// printType-厨打类型 add-加菜单 return-退菜单 online-厨打单
function cashierCateringPrint(printData, printType) {
    // 后厨打印根据商品绑定的ip分单打
    let printTotalList = $store.state.printTotalList;

    let printDataList = [];
    if (!$app.isNull(printData.tableName)) {
        let gradeTitle = ((printData.tableId && printData.tableId === 0) || !$app.isNull(printData.everyday_serialnumber)) ? '取餐号' : '房台';
        printDataList.push({
            type: 'line',
            text: gradeTitle + '：' + (printData.tableName),
            size: 2
        });
    }
    if (!$app.isNull(printData.everyday_serialnumber) && $app.isNull(printData.tableName)) {
        printDataList.push({
            type: 'line',
            text: '取餐号：' + (printData.everyday_serialnumber),
            size: 2
        });
    }
    let dataTop = [
        {
            type: 'line',
            text: '收银：' + $store.state.userInfo.sv_ul_name,
            size: 1
        },
        {
            type: 'line',
            text: '时间：' + $app.currentTime(new Date(printData.orderTime)),
            size: 1,
            bottomLine: true
        }
    ]
    // if (!$app.isNull(printData.sv_isbook) && !$app.isNull(printData.sv_deliverTime)) {
    //     // 外卖预定单
    //     dataTop.push(
    //         { type: 'line', text: '外卖预定单', align: 1, fontStyle: 2 },
    //         { type: 'line', text: '配送时间：' + $app.currentTime(new Date(printData.sv_deliverTime)), align: 1, fontStyle: 2, bottomLine: true }
    //     )
    // }
    dataTop.push({ type: 'line', text: '菜品                               数量', size: 1, bottomLine: true });
    printDataList = printDataList.concat(dataTop);

    // 80mm 菜品-23 数量-13
    let titleData = [
        { type: 'title', text: '菜品', align: 1, size: 2, width: 18 },
        { type: 'title', text: '数量', align: 2, size: 2, width: 6 }
    ]
    printDataList = printDataList.concat(titleData);
    let goodsList = [], totalPrintGoodsList = [];
    printData.tableList = printData.tableList.filter(e => e.kitchenPrinter || e.isPackage);
    printData.tableList.forEach((e, i) => {
        let return_status_text = e.sv_return_status === 2 ? '（已退）' : '';
        if (e.isPackage) {
            e.packageGroups.forEach((p, pi) => {
                p.products = p.products.filter(k => k.kitchenPrinter);
                p.products.forEach((k, ki) => {
                    let filterItem = {}
                    if (k.iscloundprint === 1) {
                        filterItem = goodsList.find(data => data.id === k.printer_id);
                    } else {
                        filterItem = goodsList.find(data => data.ip === k.printer_ip && data.port === k.printer_port);
                    }

                    let cateringObj = {
                        specs: [],                  // 规格
                        tastes: [],                 // 口味
                        chargings: []               // 加料
                    };
                    !!k.specs && k.specs.forEach(k => {
                        cateringObj.specs.push(k.name);
                    })
                    !!k.tastes && k.tastes.forEach(k => {
                        cateringObj.tastes.push(k.name);
                    })
                    !!k.chargings && k.chargings.forEach(k => {
                        cateringObj.chargings.push(k.name);
                    })
                    let cateringList = [];
                    if (cateringObj.specs.length > 0) {
                        cateringList.push({
                            type: 'tableCalc',
                            text: '-规格：' + cateringObj.specs.join('、'),
                            size: 2
                        })
                    }
                    if (cateringObj.tastes.length > 0) {
                        cateringList.push({
                            type: 'tableCalc',
                            text: '-口味：' + cateringObj.tastes.join('、'),
                            size: 2
                        })
                    }
                    if (cateringObj.chargings.length > 0) {
                        cateringList.push({
                            type: 'tableCalc',
                            text: '-加料：' + cateringObj.chargings.join('、'),
                            size: 2
                        })
                    }

                    let packageInfo = {
                        type: 'tableCalc',
                        text: e.product_name + '（' + p.name + '）',
                        align: 1,
                        lineHeight: 18
                    };

                    let subItem = {
                        type: 'tableCalc',
                        packageInfo: packageInfo,
                        isWaitting: e.isWaitting,
                        text: (e.isWaitting ? '(等叫)' : '') + '※' + k.name + return_status_text + ',' + e.product_num * k.number,
                        cateringList,
                        remarkItem: null,
                        size: 2
                    }
                    totalPrintGoodsList.push(subItem);
                    if (!$app.isNull(filterItem)) {
                        filterItem.totalNum += e.product_num * k.number;
                        filterItem.list.push(subItem)
                    } else {
                        let item = {
                            printer_name: k.printer_name,
                            id: k.printer_id,
                            ip: k.printer_ip,
                            iscloundprint: k.iscloundprint,
                            port: k.printer_port,
                            totalNum: e.product_num * k.number,
                            sv_template_josn: k.sv_template_josn,
                            list: [],
                            totalPrintGoodsList: totalPrintGoodsList
                        }
                        item.list.push(subItem);
                        goodsList.push(item)
                    }
                })
            })
        } else {
            // if ($app.isNull(e.printer_ip) && $app.isNull(e.printer_id)) return;
            let remarkItem = {
                type: 'tableCalc',
                text: '备注：' + e.remark,
                size: 2
            }
            let cateringObj = {
                specs: [],                  // 规格
                tastes: [],                 // 口味
                chargings: []               // 加料
            };
            !!e.specs && e.specs.forEach(k => {
                cateringObj.specs.push(k.name);
            })
            !!e.tastes && e.tastes.forEach(k => {
                cateringObj.tastes.push(k.name);
            })
            !!e.chargings && e.chargings.forEach(k => {
                cateringObj.chargings.push(k.name);
            })
            let cateringList = [];
            if (cateringObj.specs.length > 0) {
                cateringList.push({
                    type: 'tableCalc',
                    text: '-规格：' + cateringObj.specs.join('、'),
                    size: 2
                })
            }
            if (cateringObj.tastes.length > 0) {
                cateringList.push({
                    type: 'tableCalc',
                    text: '-口味：' + cateringObj.tastes.join('、'),
                    size: 2
                })
            }
            if (cateringObj.chargings.length > 0) {
                cateringList.push({
                    type: 'tableCalc',
                    text: '-加料：' + cateringObj.chargings.join('、'),
                    size: 2
                })
            }
            
            let filterItem = goodsList.find(data => (data.ip === e.printer_ip && data.port === e.printer_port) || (data.id === e.printer_id && data.sn === e.printer_sn && e.iscloundprint === 1));
            let goodsItem = {
                type: 'tableCalc',
                isWaitting: e.isWaitting,
                text: e.product_name + return_status_text + ',' + e.product_num,
                cateringList,
                remarkItem: !$app.isNull(e.remark) ? remarkItem : null,
                size: 2,
                sv_return_status: e.sv_return_status
            }
            totalPrintGoodsList.push(goodsItem);
            if (!$app.isNull(filterItem)) {
                filterItem.totalNum += e.product_num;
                filterItem.list.push(goodsItem);
            } else {
                let item = {
                    printer_name: e.printer_name,
                    id: e.printer_id,
                    sn: e.printer_sn,
                    iscloundprint: e.iscloundprint,
                    ip: e.printer_ip,
                    port: e.printer_port,
                    totalNum: e.product_num,
                    sv_template_josn: e.sv_template_josn,
                    list: [],
                    totalPrintGoodsList: totalPrintGoodsList
                }
                item.list.push(goodsItem);
                goodsList.push(item)
            }
        }
        if (!$app.isNull(e.return)) {

        }
    });
    let titleTextByType = { add: '加菜', return: '退菜', online: '', unWait: '起菜', change: '换台', and: '并台', call: '催菜', checkin: '' }
    // 厨打总单相关
    printTotalList.forEach(e => {
        let array = [];
        if (printData.isWaitting) {
            array.push({
                type: 'line',
                text: '（等叫）',
                size: 2,
                align: 1,
                spaceLine: 1
            })
        }
        array.push(
            {
                type: 'line',
                text: e.sv_printer_name + '-' + titleTextByType[printType] + '厨打总单',
                size: 2,
                align: 1,
                spaceLine: 1
            }
        )
        if (goodsList.length > 0) {
            goodsList[0].totalPrintGoodsList.forEach(k => {
                if (!$app.isNull(k.packageInfo)) array.push(k.packageInfo);
                array.push(k);
                if (!$app.isNull(k.cateringList)) {
                    k.cateringList.forEach(e => {
                        array.push(e);
                    })
                }
                if (!$app.isNull(k.remarkItem)) array.push(k.remarkItem);
            })
            let dataList = array.concat(printDataList);
            dataList.push({ type: 'foot', text: '合计：' + goodsList[0].totalPrintGoodsList.length, topLine: true, size: 2, width: 23 });
            if (!$app.isNull(printData.remark)) dataList.push({ type: 'foot', text: '备注：' + printData.remark, size: 2, width: 23 });
            if (e.iscloundprint === 1) {
                cloudCaterPrint({ printData: dataList, printId: e.id, printSum: 1 });
            } else {
                catering(dataList, { ip: e.sv_printer_ip, port: e.sv_printer_port });
            }
        }
    })

    // 厨打分单相关
    goodsList.forEach((e, i) => {
        if ($app.isNull(e.sv_template_josn)) return
        if (printType === 'add' && e.sv_template_josn.find(e => e.code === 'ChangeChannels').state === false) return
        if (printType === 'return' && e.sv_template_josn.find(e => e.code === 'FoodBack').state === false) return
        if (printType === 'call' && e.sv_template_josn.find(e => e.code === 'RouseFood').state === false) return
        if (printType === 'unWait' && e.sv_template_josn.find(e => e.code === 'PushFood').state === false) return
        if (printType === 'change' && e.sv_template_josn.find(e => e.code === 'AddFood').state === false) return
        if (printType === 'and' && e.sv_template_josn.find(e => e.code === 'AndChannels').state === false) return

        if (e.sv_template_josn.find(e => e.code === 'KitchenSonSingleTotalSingle').state === true) {
            // 厨打分单总单
            let array = [];
            if (printData.isWaitting) {
                array.push({
                    type: 'line',
                    text: '（等叫）',
                    size: 2,
                    align: 1,
                    spaceLine: 1
                })
            }
            array.push(
                {
                    type: 'line',
                    text: e.printer_name + '-' + titleTextByType[printType] + '厨打分单总单',
                    size: 2,
                    align: 1,
                    spaceLine: 1
                }
            )
            e.list.forEach(k => {
                if (!$app.isNull(k.packageInfo)) array.push(k.packageInfo);
                array.push(k);
                if (!$app.isNull(k.cateringList)) {
                    k.cateringList.forEach(e => {
                        array.push(e);
                    })
                }
                if (!$app.isNull(k.remarkItem)) array.push(k.remarkItem);
            })
            let dataList = array.concat(printDataList);
            dataList.push({ type: 'foot', text: '合计：' + e.totalNum, topLine: true, size: 2, width: 23 });
            if (!$app.isNull(printData.remark)) dataList.push({ type: 'foot', text: '备注：' + printData.remark, size: 2, width: 23 });
            if (e.iscloundprint === 1) {
                cloudCaterPrint({ printData: dataList, printId: e.id, printSum: 1 });
            } else {
                catering(dataList, { ip: e.ip, port: e.port });
            }
        }
        if (e.sv_template_josn.find(e => e.code === 'KitchenPlaySingle2').state === true) {
            // 厨打分单
            let goodsList = printType !== 'return' ? e.list.filter(k => k.sv_return_status !== 2) : e.list;
            goodsList.forEach((goodsItem, goodsIndex) => {
                let arrayTitle = [];
                if (goodsItem.isWaitting) {
                    arrayTitle.push(
                        {
                            type: 'line',
                            text: '(等叫)',
                            size: 2,
                            align: 1,
                            spaceLine: 1
                        }
                    )
                }
                arrayTitle.push(
                    // 厨打小票标题
                    {
                        type: 'line',
                        text: e.printer_name + '-' + titleTextByType[printType] + '厨打分单',
                        size: 2,
                        align: 1,
                        spaceLine: 1
                    }
                )
                let dataList = arrayTitle.concat(printDataList);
                let array = [];
                if (!$app.isNull(goodsItem.packageInfo)) array.push(goodsItem.packageInfo);
                array.push(goodsItem);
                if (!$app.isNull(goodsItem.cateringList)) {
                    goodsItem.cateringList.forEach(e => {
                        array.push(e);
                    })
                }
                if (!$app.isNull(goodsItem.remarkItem)) array.push(goodsItem.remarkItem);
                array.push({ type: 'foot', text: '合计：' + (goodsIndex + 1) + '/' + goodsList.length, topLine: true, size: 2, width: 23 });
                array = dataList.concat(array);
                if (!$app.isNull(printData.remark)) array.push({ type: 'foot', text: '备注：' + printData.remark, size: 2, width: 23 });
                if (e.iscloundprint === 1) {
                    // cloudCaterPrint({ printData: array, printId: e.id, printSum: 1 });
                } else {
                    catering(array, { ip: e.ip, port: e.port });
                }
                // catering(array, { ip: e.ip, port: e.port });
            })
        }
    })
    // });
}
// 调用云打印异步
function cloudCaterPrint(dataObj) {
    let userInfo = $app.valuesFilterNull($store.state.userInfo);
    let query = {
        id: dataObj.printId,
        type: 0,
        brand_id: 0,
        userid: userInfo.user_id,
        info: dataObj.printData,
        print_times: dataObj.printSum,
        print_type: 1                                       // 0 小票 1后厨
    }
    stockApi.postCloudPrint(query).then(res => {
        if (res.success) {
            // this.$message.success('正在执行云打印')
        }
    })
};
//#endregion

//#region 餐饮小票打印
function concatSalesTicket(printData, printType) {
    getInfo();
    let printDataList = [];
    const imgProtocol = stockApi.imgBase().indexOf('http') > -1 ? '' : 'http:';
    let shopLogo = userInfo.sv_store_logo.indexOf('http') > -1 ? userInfo.sv_store_logo : (imgProtocol + stockApi.imgBase() + userInfo.sv_store_logo);
    $app.checkImgExists(shopLogo).then(() => {
        //success callback
        // console.log('有效图片链接')
        (printData.order_payment === '交易单' || printData.order_payment === '退货单') && printDataList.push(
            {
                type: 'logo',
                url: shopLogo,
                size: 1,
                align: 1,
                spaceLine: 1
            }
        );
    }).catch(() => {
        //fail callback
        console.log('无效图片链接')
    }).then(() => {
        let ticketTitle = '销售小票';
        if (userInfo.sv_uit_cache_name === 'cache_name_catering') {
            const shipping_methods_list = ['堂食', '外卖', '自取'];
            const shipping_text = shipping_methods_list[printData.sv_shipping_methods] || '';
            ticketTitle = shipping_text + (printData.order_payment === '待付款' ? '宾客单' : '结账单');
            // ticketTitle = (printData.sv_shipping_methods == 0 ? '堂食' : printData.sv_shipping_methods == 1 ? '外卖' : printData.sv_shipping_methods == 2 ? '自取' : '') + ticketTitle;
        }

        switch (printType) {
            case 'add': ticketTitle += '【加菜】'; break;
            case 'return': ticketTitle += '【退菜】'; break;
            case '交易单': ticketTitle = '销售小票（补打）'; break;
            case '配送单': ticketTitle = '外卖配送单'; break;
            case '退货单': ticketTitle = '退货小票'; break;
            default: break;
        }
        let dataArray1 = [
            {
                type: 'line',
                text: userInfo.sv_us_shortname,
                size: 17,
                lineHeight: 30,
                align: 1
            },
            {
                type: 'line',
                text: ticketTitle,
                align: 1,
                spaceLine: 1
            },

            // {
            //     type: 'barcode',
            //     text: printInfo.order_running_id,
            //     align: 1,
            //     spaceLine: 1
            // }
        ]
        if (!$app.isNull(printData.sv_deliver_companyid)) {
            if (printData.sv_deliver_companyid === -1 && !$app.isNull(printData.sv_deliver_company) && !$app.isNull(printData.sv_deliver_orderno)) {
                dataArray1.push({
                    type: 'line',
                    text: printData.sv_deliver_company + '#' + (printData.sv_deliver_orderno),
                    size: 12,
                    lineHeight: 20
                });
            }
        }
        const arrayTop = [
            ...(!$app.isNull(printData.order_running_id) ? [{
                type: 'line',
                text: '单号：' + printData.order_running_id
            }] : []),
            {
                type: 'line',
                text: '销售时间：' + $app.currentTime(new Date(printData.order_datetime)),
            },
            {
                type: 'line',
                text: '操作员：' + userInfo.sv_ul_name,
            }
        ];
        dataArray1 = dataArray1.concat(arrayTop);

        !$app.isNull(printData.sv_person_num) && printData.sv_person_num > 0 && dataArray1.splice(2, 0, {
            type: 'line',
            text: '人数：' + printData.sv_person_num
        })
        let gradeTitle = (!$app.isNull(printData.sv_table_id) && printData.sv_table_id == 0) ? '取餐号' : '房台';
        // 线上订单         取餐号 - sv_catering_grade  房台 - sv_catering_grade
        // 销售流水         取餐号 - everyday_serialnumber  房台 - sv_catering_grade
        let tableNum = gradeTitle === '取餐号' ? (printData.everyday_serialnumber || printData.sv_catering_grade) : printData.sv_catering_grade;
        let currentTitle = gradeTitle === '取餐号' ? (printData.sv_shipping_methods === 1 ? '#' : '取餐号：') : '房台：';
        !$app.isNull(printData.sv_catering_grade) && dataArray1.splice(2, 0, {
            type: 'line',
            text: currentTitle + tableNum,
            size: 12,
            lineHeight: 20
        })
        // 合并打印数组-第一部分
        printDataList = printDataList.concat(dataArray1);
        let tableData = {
            header: ['名称/条码', '数量', '单价', '小计'],
            list: [],
            footer: []
        }
        let [tableList, totalNum, totalMoney] = printBodyData(printData.prlist, true)
        tableData.list = tableList;
        printType !== '退货单' && (totalMoney = $app.moneyFixed($app.addNumber(printData.order_money, printData.order_money2), 2))
        tableData.footer = ['合计', totalNum + '', '', totalMoney]
        let isDriverType = $store.state.cashierJurisdiction.printName.indexOf('免驱动') < 0;
        let tableArray = $app.printTableDate(tableData, isDriverType, $store.state.printTemplate.salesData.width);
        // 合并打印数组-表格
        printDataList = printDataList.concat(tableArray);

        // 宾客单和加菜单不打印合计以后的内容
        let orderInfo = [], memberInfo = [];
        if (printData.order_payment !== '待付款' && printType !== 'add') {
            orderInfo = [
                {
                    type: 'tableCalc',
                    list: [
                        {
                            text: printType === '退货单' ? '退还' : '实收'
                        },
                        {
                            text: $app.addSpaceChar(29 - 4 - totalMoney.length)
                        },
                        {
                            text: totalMoney
                        }
                    ],
                    topLine: true,
                },
            ]

            // 支付方式
            let orderPayment = `${printData.order_payment}：${printData.order_money}`;
            if (printData.order_payment2 !== '待收' && !$app.isNull(printData.order_payment2)) {      // 组合支付
                orderPayment += `   ${printData.order_payment2}：${printData.order_money2}`;
            } else {                                        // 非组合支付
                orderPayment = '支付方式：' + printData.order_payment;
            }
            printType !== '退货单' && orderInfo.push({ type: 'line', text: orderPayment })

            // 会员信息
            if (!$app.isNull(printData.member_id)) {
                memberInfo = [
                    {
                        type: 'line',
                        text: '会员姓名/卡号：' + printData.sv_mr_name + '/' + printData.sv_mr_cardno,
                        topLine: true
                    },
                    {
                        type: 'line',
                        text: '储值余额：' + printData.sv_mw_availableamount,
                    },
                    {
                        type: 'line',
                        text: '积分：' + printData.sv_mw_availablepoint,
                    }
                ]
            }
            if (printData.sv_shipping_methods == 1) {
                memberInfo.push(
                    { type: 'line', text: '收货人：' + printData.recipient_name, topLine: true },
                    { type: 'line', text: '收货电话：' + printData.recipient_phone },
                )
                if (!$app.isNull(printData.recipient_address)) {
                    let addressArr = $app.strWrap('收货地址：' + printData.recipient_address, 29);
                    let addressList = addressArr.map(aItem => ({ type: 'line', text: aItem }));
                    memberInfo.push(...addressList);
                }
            }
        }
        let needHidePhoneNumber = userInfo.sv_us_phone.length === 11 && !ticketShowPhone;
        let shopInfo = [
            {
                type: 'line',
                text: printType === '配送单' ? '' : ('电话：' + (needHidePhoneNumber ? $app.phoneNumberHiding(userInfo.sv_us_phone) : userInfo.sv_us_phone)),
                topLine: true,
            },
            {
                type: 'line',
                text: printType === '配送单' ? '' : ('地址：' + userInfo.sv_us_address),
            },
            {
                type: 'line',
                text: '打印时间：' + $app.currentTime(new Date()),
            },
            {
                type: 'line',
                text: '备注：' + (printData.return_remark || printData.sv_remarks),
                spaceLine: true
            },
            !$app.isNull(printData.sv_delivery_time) && {
                type: 'line',
                text: (printData.sv_shipping_methods === 0 ? '自提时间：' : '配送时间：') + printData.sv_delivery_time
            },
            {
                type: 'line',
                text: printData.sv_person_num === 0 || printData.sv_shipping_methods !== 1 ? '' : ('餐具数量：' + printData.sv_person_num),
            }
        ]
        if (printData.form_list) {
            printData.form_list.forEach(e => {
                shopInfo.push({
                    type: 'line',
                    text: e.sv_form_label + '：' + e.sv_form_value,
                })
            })
        }
        let moreInfo = [
            {
                type: 'barcode',
                text: printData.sv_shipping_methods !== 1 ? '' : printData.order_running_id,
                align: 1,
                spaceLine: true
            },
            {
                type: 'line',
                text: printData.sv_shipping_methods !== 1 ? '' : '谢谢惠顾，欢迎下次光临',
                align: 1,
                spaceTopLine: true
            }
        ]
        // if (printType == '配送单') {
        //     shopInfo.splice(0, 2)
        // }
        printDataList = printDataList.concat(orderInfo).concat(memberInfo).concat(shopInfo).concat(moreInfo);

        //#region 自定义模板打印 未改完
        // let printData = {
        //     /*打印类型*/
        //     printType: 1,           //1 ? '销售小票' : '预打/预结小票',
        //     /*打印份数*/
        //     printSum: parseInt(times),
        //     /*店铺logo*/
        //     shopLogo: userInfo.sv_store_logo,
        //     /*店铺名称*/
        //     shopName: userInfo.sv_us_shortname || userInfo.sv_us_name,
        //     /*电话*/
        //     shopTel: userInfo.sv_us_phone,
        //     /*地址*/
        //     shopAddress: userInfo.sv_us_address,
        //     /*订单号*/
        //     orderNumber: wt_nober,
        //     /*打印时间*/
        //     printTime: (printType === 1 ? '销售' : prePrintText) + '时间：' + $app.currentTime(new Date()),
        //     /*操作员*/
        //     controlName: '操作员：' + userInfo.sv_ul_name,
        //     /*商品表格*/
        //     tableList: getTableList(printData),
        //     /*合计总数量*/
        //     totalNumber: carttingData.buyNumber,
        //     /*合计总金额*/
        //     totalMoney: $app.moneyFixed(carttingData.dealMoney),
        //     /*优惠金额*/
        //     discountMoney: $app.isNull(discountMoney) ? '' : $app.moneyFixed(discountMoney),
        //     /*应收*/
        //     receivableMoney: $app.moneyFixed(receivableMoney),
        //     /*实收*/
        //     collectionsMoney: $app.moneyFixed(inputNumber),
        //     /*支付方式*/
        //     payTypeName: payTypePos > -1 ? totalPayTypeList[payTypePos].name : '',
        //     /*支付单号*/
        //     payOrderNumber: printType === 1 && !$app.isNull(queryPay.queryId) ? queryPay.queryId : '',
        //     /*会员信息*/
        //     memberInfo: $app.isNull(memberInfo.member_id) ? {} : JSON.parse(JSON.stringify(memberInfo)),
        //     /*备注*/
        //     remark: orderRemark,
        // }

        // $print.customSales(printData);
        //#endregion

        // console.log(printDataList);
        $print.sales(printDataList);
    })
}
//#endregion

function printBodyData(list, isTicket = false) {            // 小票商品信息组装 isTicket: true-小票数据 false-后厨数据
    if ($app.isNull(list)) return
    let totalNum = 0;
    let totalMoney = 0;
    let returnList = [];
    list.forEach(e => {
        e = $app.valuesFilterNull(e);
        let textContent = '';
        // 菜品总数量
        let realNum = e.return_num || e.sv_p_weight_bak || e.sv_p_weight || e.product_num_bak || e.product_num;
        let productPrice = e.product_price || e.product_single_untprice || e.product_unitprice;
        productPrice = $app.moneyFixed(productPrice, 2);
        let subTotal = $app.moneyFixed($app.multiplyNumber(realNum, productPrice), 2);
        totalNum = $app.addNumber(totalNum, realNum);
        totalMoney = $app.moneyFixed($app.addNumber(totalMoney, subTotal), 2);
        if (e.type == true || e.product_type == 1) {    // 次卡消费
            if (e.cnum - realNum) {
                textContent = e.product_name + ',' + realNum + ",-" + realNum + ',' + (e.cnum - realNum || 0);
            } else {
                textContent = e.product_name + ',' + realNum + ",-" + realNum + ',' + 0;
            }
            isTicket ? returnList.push({
                name: textContent,
                code: e.sv_p_barcode || '',
                number: realNum + '',
                price: productPrice,
                total: subTotal
            }) : returnList.push({ type: 'tableCalc', text: textContent, size: 2 });
        } else {                                        // 正常消费
            // 套餐
            let childrenProducts = $app.isNull(e.combination_new) ? [] : JSON.parse(e.combination_new);
            if (childrenProducts.length > 0) {
                // 套餐名称
                textContent = isTicket ? e.product_name : e.product_name + ',' + realNum + e.sv_p_unit;
                isTicket ? returnList.push({
                    name: textContent,
                    code: e.sv_p_barcode || '',
                    number: realNum + '',
                    price: productPrice,
                    total: subTotal
                }) : returnList.push({ type: 'tableCalc', text: textContent, size: 2 });
                // 套餐子商品
                childrenProducts.forEach(f => {
                    let childName = '--' + f.sv_p_name;
                    let productTaste = [];
                    if (!$app.isNull(f.specItem)) {
                        productTaste = productTaste.concat(f.specItem.name)
                    }
                    if (!$app.isNull(f.tasteIdList)) {
                        productTaste = productTaste.concat(f.tasteIdList[0].map(g => g.name))
                    }
                    if (!$app.isNull(f.chargingIdList)) {
                        productTaste = productTaste.concat(f.chargingIdList.map(g => g.name))
                    }
                    // 小票打印 或 后厨打印
                    let spec = '';
                    if (isTicket) {
                        spec = '[' + productTaste.reduce((txt, item, i) => (txt + (i === 0 ? '' : '、') + item), '') + ']';
                        returnList.push({ name: childName + spec, code: '', number: f.product_number + '', price: '', total: '' })
                    } else {
                        childName = childName + ',' + f.product_number;
                        spec = '---[' + productTaste.reduce((txt, item, i) => (txt + (i === 0 ? '' : '、') + item), '') + ']';
                        returnList.push({ type: 'tableCalc', text: childName, size: 2 });
                        !$app.isNull(spec) && returnList.push({ type: 'tableCalc', text: spec, size: 2 });
                    }
                })
            } else {
                // 规格文本
                let spec = '';

                // 规格口味 数据
                let productTaste = $app.isNull(e.cateringChargingJson) ? [] : JSON.parse(e.cateringChargingJson);
                productTaste = productTaste.filter(f => !$app.isNull(f.sv_taste_name));
                if (productTaste.length > 0) {
                    spec = '[' + productTaste.reduce((txt, item, i) => (txt + (i === 0 ? '' : '、') + item.sv_taste_name), '') + ']'
                }

                let productName = $app.isNull(e.sv_p_specs) ? e.product_name : e.product_name + '[' + e.sv_p_specs + ']'
                textContent = productName + ',' + realNum + e.sv_p_unit;
                isTicket ? returnList.push({
                    name: $app.isNull(spec) ? productName : productName + spec,
                    code: e.sv_p_barcode || '',
                    number: realNum + '',
                    price: productPrice,
                    total: subTotal
                }) : (returnList.push({ type: 'tableCalc', text: textContent, size: 2 }), !$app.isNull(spec) && returnList.push({ type: 'tableCalc', text: spec, size: 2, bottomLine: true }))
            }
        }
    })
    return [returnList, totalNum, totalMoney];
}

//#region   还款小票打印
function repaymentPrint(repaymentData) {
    repaymentData = $app.valuesFilterNull(repaymentData);
    let printDataList = [];
    let shopLogo = stockApi.imgBase().indexOf('http') > -1 ? stockApi.imgBase() + userInfo.sv_store_logo : 'http:' + stockApi.imgBase() + userInfo.sv_store_logo;
    $app.checkImgExists(shopLogo).then(() => {
        printDataList.push({ type: 'logo', url: shopLogo, size: 1, align: 1, spaceLine: 1 });
    }).catch(() => {
        console.log('无效图片链接')
    }).then(() => {
        let ticketTitle = '还款小票';

        let orderInfo = [
            {
                type: 'line',
                text: userInfo.sv_us_shortname,
                size: 17,
                lineHeight: 30,
                align: 1
            },
            {
                type: 'line',
                text: ticketTitle,
                align: 1,
                spaceLine: 1
            },
            {
                type: 'line',
                text: '会员姓名：' + repaymentData.sv_mr_name
            },
            {
                type: 'line',
                text: '会员卡号：' + repaymentData.sv_mr_cardno
            },
            {
                type: 'line',
                text: '单据类型：还款'
            },
            {
                type: 'line',
                text: '订单单号：' + repaymentData.order_running_id
            },
            {
                type: 'line',
                text: '欠款金额：' + repaymentData.maximum
            },
            {
                type: 'line',
                text: '还款金额：' + repaymentData.sv_money
            },
            {
                type: 'line',
                text: '剩余金额：' + repaymentData.sv_credit_money
            },
            {
                type: 'line',
                text: '还款方式：' + repaymentData.sv_payment_method_name
            },
            {
                type: 'line',
                text: '日期：' + $app.currentTime(new Date(repaymentData.sv_repayment_date))
            },
            {
                type: 'line',
                text: '操作员：' + repaymentData.optername,
            },
            {
                type: 'line',
                text: '备注：' + repaymentData.sv_note,
            },
            {
                type: 'line',
                text: '谢谢惠顾，欢迎下次光临',
            }
        ]
        printDataList = printDataList.concat(orderInfo);

        // console.log(printDataList);
        // console.log(printerInfo);
        $print.sales(printDataList);
    })
}
//#endregion

function onlineOrderPrint(printData, type) {                // 线上订单打印
    // if (typeof Cef === 'undefined') return;
    polling(printData, type)
}

export { cashierCateringPrint, onlineOrderPrint, concatSalesTicket, repaymentPrint }