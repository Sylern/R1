import { stockApi } from '@/api/index';
import $app from '@/utils/utils.js';
import resetMessage from '@/utils/resetMessage.js';
import { catering } from './cateringPrint.js';
import $store from "../modules/common/store/index.js";
import { printLabel } from '@/utils/prin';
import { priceTagList } from '@/utils/config/config.js';

//#endregion
let templateList = [];                                              // 标签模板
//#region 餐饮后厨打印
// async function printPriceTag(e, kitchenPrinter, tableName) {        // 打印商品标签
async function printPriceTag(printList) {        // 打印商品标签
    await getTemplate()
    if ($app.isNull(templateList)) return resetMessage({ message: '获取标签模板数据失败', type: 'error', duration: 2000 });
    printList.forEach((e, i) => {
        const temJson = templateList.find(temp => temp.templateId === e.kitchenPrinter[0].sv_labeltemplate_id);
        let productName = e.dataItem.productName;
        !$app.isNull(e.dataItem.specs) && (productName += '(' + e.dataItem.specs[0].name + ')');
        const tastes = getFoodTastes(e.dataItem);
        const prData = {
            sv_p_name: productName,                                     // 商品名称
            sv_production_date: new Date(),                             // 打印时间
            tastes: tastes,                                             // 口味
            sv_p_unitprice: e.dataItem.dealMoney,                       // 单价
            sv_productionplace: $store.state.userInfo.sv_us_address,    // 店铺地址
            sv_us_phone: $store.state.userInfo.sv_us_phone,             // 店铺电话
            sv_without_list_id: e.everyday_serialnumber,                // 单号
            everyday_serialnumber: e.everyday_serialnumber,             // 房台号（正餐）/每日流水号-取餐号（轻餐）
            sv_catering_grade: (i + 1) + '/' + printList.length         // 牌号
        }
        printLabel({
            data: [prData],
            tem: temJson,
            printName: e.kitchenPrinter[0].sv_printer_ip,
            dir: '0',
            columnNum: 1,
            userInfo: $store.state.userInfo
        });
    })
};
async function getTemplate() {                                      // 获取用户标签模板
    templateList = priceTagList.map(e => {
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
};
function getFoodTastes(e) {                                         // 获取口味
    let tastes = '';
    !$app.isNull(e.tastes) && (tastes = e.tastes.reduce((txt, item, i) => (txt + (i === 0 ? '' : ' ') + item.name), ''));
    !$app.isNull(e.chargings) && (tastes += e.chargings.reduce((txt, item, i) => (txt + (i === 0 ? '' : ' ') + item.name), ' '));
    return tastes
};

// printType-厨打类型 add-加菜单 return-退菜单 online-厨打单
function kitchenPrintMain(printProductList, productData, printType, extendInfo) {
    // 厨打 type-厨打类型 add-加菜单 return-退菜单 online-厨打单 change-换台 and-并台
    let printerList = [];
    let printTagList = [];
    printProductList.forEach(printProductItem => {
        let item = {};
        let kitchenPrinter = $app.isNull(printProductItem) ? '' : JSON.parse(printProductItem.kitchenPrinter);
        let packageItem = {};
        if (printProductItem.packageproduct_id !== 0) {
            packageItem = productData.find(k => printProductItem.packageproduct_id === k.productId && printProductItem.sv_without_product_id === (k.id ? k.id : parseInt(k.productId + '' + k.index)));
            let packageGroupItem = packageItem.packageGroups.find(group => printProductItem.packagegroup_id === group.id);
            item = packageGroupItem.products.find(item => printProductItem.product_id === item.productId);
            if (item) {
                item.packageName = packageItem.product_name || packageItem.productName;
                item.number = $app.multiplyNumber(item.number, packageItem.number);
            }
        } else {
            // index 有序号，实际用的是轻餐结算时的商品数据
            item = productData.find(k => printProductItem.product_id === k.productId && printProductItem.sv_without_product_id === (k.id ? k.id : parseInt(k.productId + '' + k.index)));
        }
        if ($app.isNull(item)) return;
        if (!$app.isNull(kitchenPrinter)) {
            if (kitchenPrinter[0].sv_print_model === 0 && (printType === 'online' || printType === 'add' || printType === 'checkin')) {
                for (let i = 0; i < item.number; i++) {
                    printTagList.push({
                        dataItem: item,
                        kitchenPrinter,
                        everyday_serialnumber: extendInfo.tableName || extendInfo.everyday_serialnumber
                    })
                }
                return
            }
        };
        let printerItem = printerList.find(e => e.printer_ip === printProductItem.sv_printer_ip);
        if (printerItem) {
            printerItem.tableList.push({
                is_total_order: printProductItem.is_total_order,
                isPackage: printProductItem.packageproduct_id !== 0,
                packageId: printProductItem.sv_without_product_id,
                packageName: printProductItem.packageproduct_id !== 0 ? packageItem.productName : '',
                product_name: item.product_name || item.productName || item.name,
                product_num: item.number,
                dealMoney: printProductItem.packageproduct_id === 0 ? item.dealMoney : '',
                sv_return_status: item.sv_return_status,
                specs: item.specs,
                tastes: item.tastes,
                chargings: item.chargings,
                cateringText: item.cateringText ? item.cateringText.replaceAll(',', '、') : '',
                remark: item.remark || null
            })
        } else {
            printerList.push({
                tableList: [
                    {
                        is_total_order: printProductItem.is_total_order,
                        isPackage: printProductItem.packageproduct_id !== 0,
                        packageName: printProductItem.packageproduct_id !== 0 ? packageItem.productName : '',
                        packageId: printProductItem.sv_without_product_id,
                        product_name: item.product_name || item.productName || item.name,
                        product_num: item.number,
                        dealMoney: printProductItem.packageproduct_id === 0 ? item.dealMoney : '',
                        sv_return_status: item.sv_return_status,
                        specs: item.specs,
                        tastes: item.tastes,
                        chargings: item.chargings,
                        cateringText: item.cateringText ? item.cateringText.replaceAll(',', '、') : '',
                        remark: item.remark || null
                    }
                ],
                sv_is_print_unitprice: printProductItem.sv_is_print_unitprice,
                iscloundprint: printProductItem.iscloundprint,
                printer_id: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].id,
                printer_sn: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sn,
                printer_name: $app.isNull(kitchenPrinter) ? '' : (printProductItem.iscloundprint === 0 ? kitchenPrinter[0].sv_printer_name : kitchenPrinter[0].name),
                printer_ip: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_ip,
                printer_port: $app.isNull(kitchenPrinter) ? '' : kitchenPrinter[0].sv_printer_port,
                sv_template_josn: $app.isNull(kitchenPrinter) ? '' : (printProductItem.iscloundprint === 1 ? JSON.parse(kitchenPrinter[0].sv_template_list) : kitchenPrinter[0].sv_template_josn)
            })
        }
    });

    if (!$app.isNull(printTagList)) printPriceTag(printTagList);
    if ($app.isNull(printerList)) return
    let printData = {
        isWaitting: extendInfo.isWaitting,
        tableName: extendInfo.tableName || '',
        everyday_serialnumber: extendInfo.everyday_serialnumber || '',
        orderTime: extendInfo.orderTime || $app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        remark: extendInfo.remark || '',
        printerList
    }
    // 后厨打印根据打印配置找到商品，ip分单打
    let printTotalList = $store.state.printTotalList;
    let titleTextByType = { add: '加菜', return: '退菜', online: '', unWait: '起菜', change: '换台', and: '并台', call: '催菜', checkin: '' };

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
    printDataList = printDataList.concat(dataTop);

    let totalPrintGoodsList = [];       // 总单打印数据
    let subPrintGoodsObj = [];          // 分单单打印数据
    printData.printerList.forEach(printerTask => {
        // 80mm 菜品-23 数量-13
        printerTask.tableList.forEach(e => {
            let return_status_text = e.sv_return_status === 2 ? '（已退）' : '';

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

            let remarkItem = {
                type: 'tableCalc',
                text: '备注：' + e.remark,
                size: 2
            }
            let goodsItem = {
                type: 'tableCalc',
                isWaitting: e.isWaitting,
                text: (e.isPackage ? '※' : '') + e.product_name + return_status_text + ',' + e.product_num,
                price: e.dealMoney + '',
                cateringList,
                remarkItem: !$app.isNull(e.remark) ? remarkItem : null,
                size: 2,
                sv_return_status: e.sv_return_status
            }
            // is_total_order 商品属于厨打总单
            if (e.is_total_order) {
                if (e.isPackage && totalPrintGoodsList.findIndex(totalItem => totalItem.packageId === e.packageId) === -1) {
                    totalPrintGoodsList.push(
                        {
                            type: 'tableCalc',
                            packageId: e.packageId,
                            text: e.packageName,
                            size: 2
                        }
                    );
                }
                totalPrintGoodsList.push(goodsItem);
            }

            let filterItem = subPrintGoodsObj.find(data => (data.ip === printerTask.printer_ip && data.port === printerTask.printer_port) || (data.id === printerTask.printer_id && data.sn === printerTask.printer_sn && printerTask.iscloundprint === 1));

            if (!$app.isNull(filterItem)) {
                if (e.isPackage && filterItem.list.findIndex(listItem => listItem.packageId === e.packageId) === -1) {
                    filterItem.list.push(
                        {
                            type: 'tableCalc',
                            packageId: e.packageId,
                            text: e.packageName,
                            size: 2,
                            align: 1
                        }
                    );
                }
                filterItem.totalNum += e.product_num;
                filterItem.list.push(goodsItem);
            } else {
                let item = {
                    printer_name: printerTask.printer_name,
                    id: printerTask.printer_id,
                    sn: printerTask.printer_sn,
                    iscloundprint: printerTask.iscloundprint,
                    ip: printerTask.printer_ip,
                    port: printerTask.printer_port,
                    sv_is_print_unitprice: printerTask.sv_is_print_unitprice,
                    totalNum: e.product_num,
                    sv_template_josn: printerTask.sv_template_josn,
                    list: []
                }
                if (e.isPackage) {
                    item.list.push(
                        {
                            type: 'tableCalc',
                            packageId: e.packageId,
                            text: e.packageName,
                            size: 2,
                            align: 1
                        }
                    );
                }
                item.list.push(goodsItem);
                subPrintGoodsObj.push(item);
            }
        });
    })
    // 厨打总单相关
    // printTotalList 总单打印机列表，每次刷新页面从后台获取
    printTotalList.forEach(printTotalItem => {
        let printTotalArray = [];
        if (printData.isWaitting) {
            printTotalArray.push({
                type: 'line',
                text: '（等叫）',
                size: 2,
                align: 1,
                spaceLine: 1
            })
        }
        printTotalArray.push(
            {
                type: 'line',
                text: printTotalItem.sv_printer_name + '-' + titleTextByType[printType] + '厨打总单',
                size: 2,
                align: 1,
                spaceLine: 1
            }
        )
        printTotalArray = printTotalArray.concat(printDataList);
        if (printTotalItem.sv_is_print_unitprice) {
            printTotalArray.push({ type: 'line', text: '菜品                           数量         小计', size: 1, bottomLine: true });
            let titleData = [
                { type: 'title', text: '菜品', align: 1, size: 2, width: 16 },
                { type: 'title', text: '数量', align: 1, size: 2, width: 2 },
                { type: 'title', text: '小计', align: 1, size: 2, width: 2 }
            ]
            printTotalArray = printTotalArray.concat(titleData);
        } else {
            printTotalArray.push({ type: 'line', text: '菜品                               数量', size: 1, bottomLine: true });
            let titleData = [
                { type: 'title', text: '菜品', align: 1, size: 2, width: 18 },
                { type: 'title', text: '数量', align: 2, size: 2, width: 6 }
            ]
            printTotalArray = printTotalArray.concat(titleData);
        }
        if (totalPrintGoodsList.length > 0) {
            let totalPrintLength = 0;
            totalPrintGoodsList.forEach(k => {
                if ($app.isNull(k.packageId)) totalPrintLength++
                let price = !$app.isNull(k.price) ? k.price.length < 6 ? $app.addSpaceChar(6 - k.price.length) + k.price : k.price : '';
                printTotalArray.push({
                    ...k,
                    text: printTotalItem.sv_is_print_unitprice && !$app.isNull(k.price) ? (k.text + ',' + price) : k.text
                });
                if (!$app.isNull(k.cateringList)) {
                    k.cateringList.forEach(e => {
                        printTotalArray.push(e);
                    })
                }
                if (!$app.isNull(k.remarkItem)) printTotalArray.push(k.remarkItem);
            })
            printTotalArray.push({ type: 'foot', text: '合计：' + totalPrintLength, topLine: true, size: 2, width: 23 });
            if (!$app.isNull(printData.remark)) printTotalArray.push({ type: 'foot', text: '备注：' + printData.remark, size: 2, width: 23 });
            if (printTotalItem.iscloundprint === 1) {
                cloudCaterPrint({ printData: printTotalArray, printId: printTotalItem.id, printSum: 1 });
            } else {
                catering(printTotalArray, { ip: printTotalItem.sv_printer_ip, port: printTotalItem.sv_printer_port });
            }
        }
    })

    // 厨打分单相关
    subPrintGoodsObj.forEach((e, i) => {
        if ($app.isNull(e.sv_template_josn)) return
        if (printType === 'add' && e.sv_template_josn.find(e => e.code === 'ChangeChannels').state === false) return
        if (printType === 'return' && e.sv_template_josn.find(e => e.code === 'FoodBack').state === false) return
        if (printType === 'call' && e.sv_template_josn.find(e => e.code === 'RouseFood').state === false) return
        if (printType === 'unWait' && e.sv_template_josn.find(e => e.code === 'PushFood').state === false) return
        if (printType === 'change' && e.sv_template_josn.find(e => e.code === 'AddFood').state === false) return
        if (printType === 'and' && e.sv_template_josn.find(e => e.code === 'AndChannels').state === false) return

        if (e.sv_template_josn.find(e => e.code === 'KitchenSonSingleTotalSingle').state === true) {
            // 厨打分单总单
            let subTotalArray = [];
            if (printData.isWaitting) {
                subTotalArray.push({
                    type: 'line',
                    text: '（等叫）',
                    size: 2,
                    align: 1,
                    spaceLine: 1
                })
            }
            subTotalArray.push(
                {
                    type: 'line',
                    text: e.printer_name + '-' + titleTextByType[printType] + '厨打分单总单',
                    size: 2,
                    align: 1,
                    spaceLine: 1
                }
            )
            subTotalArray = subTotalArray.concat(printDataList);

            let arrayTableHeader = [];
            if (e.sv_is_print_unitprice) {
                arrayTableHeader.push({ type: 'line', text: '菜品                           数量         小计', size: 1, bottomLine: true });
                let titleData = [
                    { type: 'title', text: '菜品', align: 1, size: 2, width: 16 },
                    { type: 'title', text: '数量', align: 1, size: 2, width: 2 },
                    { type: 'title', text: '小计', align: 1, size: 2, width: 2 }
                ]
                arrayTableHeader = arrayTableHeader.concat(titleData);
            } else {
                arrayTableHeader.push({ type: 'line', text: '菜品                               数量', size: 1, bottomLine: true });
                let titleData = [
                    { type: 'title', text: '菜品', align: 1, size: 2, width: 18 },
                    { type: 'title', text: '数量', align: 2, size: 2, width: 6 }
                ]
                arrayTableHeader = arrayTableHeader.concat(titleData);
            }
            subTotalArray = subTotalArray.concat(arrayTableHeader);
            e.list.forEach(k => {
                if (k.isPackage && subTotalArray.findIndex(listItem => listItem.packageId === k.packageId) === -1) {
                    subTotalArray.push(
                        {
                            type: 'line',
                            packageId: k.packageId,
                            text: k.packageName,
                            size: 1,
                            align: 1
                        }
                    );
                }
                let price = !$app.isNull(k.price) ? k.price.length < 6 ? $app.addSpaceChar(6 - k.price.length) + k.price : k.price : '';
                subTotalArray.push({
                    ...k,
                    text: e.sv_is_print_unitprice && !$app.isNull(k.price) ? (k.text + ',' + price) : k.text
                });
                if (!$app.isNull(k.cateringList)) {
                    k.cateringList.forEach(e => {
                        subTotalArray.push(e);
                    })
                }
                if (!$app.isNull(k.remarkItem)) subTotalArray.push(k.remarkItem);
            })
            subTotalArray.push({ type: 'foot', text: '合计：' + e.totalNum, topLine: true, size: 2, width: 23 });
            if (!$app.isNull(printData.remark)) subTotalArray.push({ type: 'foot', text: '备注：' + printData.remark, size: 2, width: 23 });
            if (e.iscloundprint === 1) {
                cloudCaterPrint({ printData: subTotalArray, printId: e.id, printSum: 1 });
            } else {
                catering(subTotalArray, { ip: e.ip, port: e.port });
            }
        }
        if (e.sv_template_josn.find(e => e.code === 'KitchenPlaySingle2').state === true) {
            // 厨打分单
            let goodsList = printType !== 'return' ? e.list.filter(k => k.sv_return_status !== 2 && $app.isNull(k.packageId)) : e.list;
            goodsList.forEach((goodsItem, goodsIndex) => {
                let goodsArray = [];
                if (goodsItem.isWaitting) {
                    goodsArray.push(
                        {
                            type: 'line',
                            text: '(等叫)',
                            size: 2,
                            align: 1,
                            spaceLine: 1
                        }
                    )
                }
                goodsArray.push(
                    // 厨打小票标题
                    {
                        type: 'line',
                        text: e.printer_name + '-' + titleTextByType[printType] + '厨打分单',
                        size: 2,
                        align: 1,
                        spaceLine: 1
                    }
                )
                goodsArray = goodsArray.concat(printDataList);

                let arrayTableHeader = [];
                if (e.sv_is_print_unitprice) {
                    arrayTableHeader.push({ type: 'line', text: '菜品                           数量         小计', size: 1, bottomLine: true });
                    let titleData = [
                        { type: 'title', text: '菜品', align: 1, size: 2, width: 16 },
                        { type: 'title', text: '数量', align: 1, size: 2, width: 2 },
                        { type: 'title', text: '小计', align: 1, size: 2, width: 2 }
                    ]
                    arrayTableHeader = arrayTableHeader.concat(titleData);
                } else {
                    arrayTableHeader.push({ type: 'line', text: '菜品                               数量', size: 1, bottomLine: true });
                    let titleData = [
                        { type: 'title', text: '菜品', align: 1, size: 2, width: 18 },
                        { type: 'title', text: '数量', align: 2, size: 2, width: 6 }
                    ]
                    arrayTableHeader = arrayTableHeader.concat(titleData);
                }
                goodsArray = goodsArray.concat(arrayTableHeader);
                let price = !$app.isNull(goodsItem.price) ? goodsItem.price.length < 6 ? $app.addSpaceChar(6 - goodsItem.price.length) + goodsItem.price : goodsItem.price : '';
                goodsArray.push({
                    ...goodsItem,
                    text: e.sv_is_print_unitprice && !$app.isNull(goodsItem.price) ? (goodsItem.text + ',' + price) : goodsItem.text
                });
                if (!$app.isNull(goodsItem.cateringList)) {
                    goodsItem.cateringList.forEach(e => {
                        goodsArray.push(e);
                    })
                }
                if (!$app.isNull(goodsItem.remarkItem)) goodsArray.push(goodsItem.remarkItem);
                goodsArray.push({ type: 'foot', text: '合计：' + (goodsIndex + 1) + '/' + goodsList.length, topLine: true, size: 2, width: 23 });
                if (!$app.isNull(printData.remark)) goodsArray.push({ type: 'foot', text: '备注：' + printData.remark, size: 2, width: 23 });
                if (e.iscloundprint === 1) {
                    cloudCaterPrint({ printData: goodsArray, printId: e.id, printSum: 1 });
                } else {
                    catering(goodsArray, { ip: e.ip, port: e.port });
                }
            })
        }
    })
}
//#endregion

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
        }
    })
};

//#endregion

export { kitchenPrintMain }