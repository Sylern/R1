import resetMessage from './resetMessage.js';
import $app from '@/utils/utils.js';


//#region 标签打印 obj { data - 打印数据 tem - 选中的模板  printName - 打印机名称 dir-0  columnNum - 每行标签数 }

let addHeight = 0;          // 因换行增加的高度
const crmap = {
    店铺名称: { Filed: 'sv_us_name', Type: null },
    商品名称: { Filed: 'sv_p_name', Type: null },
    产地: { Filed: 'sv_productionplace', Type: null },
    规格: { Filed: 'sv_p_specs', Type: null },
    商品条码: { Filed: 'sv_p_barcode', Type: 'barcode' },
    商品货号: { Filed: 'sv_p_artno', Type: 'barcode' },
    零售价: { Filed: 'sv_p_unitprice', Type: null },
    单位: { Filed: 'sv_unit_name', Type: null },
    生产日期: { Filed: 'sv_production_date', Type: null },
    质保天数: { Filed: 'sv_guaranteeperiod', Type: null },
    品牌: { Filed: 'sv_brand_name', Type: null },
    供应商: { Filed: 'sv_suname', Type: null },
    会员价: { Filed: 'sv_p_memberprice', Type: null },
    自定义文本: { Filed: '', Type: null },
    二维码: { Filed: 'name', Type: 'qrcode' },
    颜色: { Filed: 'sv_color', Type: null },
    尺码: { Filed: 'sv_size', Type: null },
    面料: { Filed: 'fabric_name', Type: null },
    款号信息: { Filed: 'style_name', Type: null },
    款式信息: { Filed: 'style_name', Type: null },
    季节: { Filed: 'season_name', Type: null },
    性别信息: { Filed: 'gender_name', Type: null },
    年份: { Filed: 'sv_particular_year', Type: null },
    面料成分: { Filed: 'fabric_name', Type: null },
    一级分类: { Filed: 'sv_pc_name', Type: null },
    二级分类: { Filed: 'sv_psc_name', Type: null },
    安全类别: { Filed: 'standard_name', Type: null },
    执行标准: { Filed: 'sv_executivestandard', Type: null },
    单号: { Filed: 'sv_without_list_id', Type: null },
    取餐号: { Filed: 'everyday_serialnumber', Type: null },  // 房台号（正餐）/每日流水号-取餐号（轻餐）
    牌号: { Filed: 'sv_catering_grade', Type: null },
    口味: { Filed: 'tastes', Type: null },
    电话: { Filed: 'sv_us_phone', Type: null }
}
const pw = (w, h) => { return (num) => { return parseType('int', num * 25.4 / 96 * 1.43) } }
const ph = (w, h) => { return (num) => { return parseType('int', num * 25.4 / 93 * 1.43) } }


const parseType = (type, number) => {
    switch (type) {
        case 'int':
            return parseInt(number);
        case 'float':
            return parseFloat(number);
        default: break;
    }
}
const setObj = (data, obj, item, sv_us_name, sv_uit_cache_name, pxTommX, pxTommY, width, height) => {
    obj.Width = item.Width || 0;
    obj.Height = item.Height || 0;
    obj.TextFont = 0;
    obj.Warp = false;
    obj.FontSize = item.fontSize;
    obj.FontStyle = item.fontStyle;
    obj.WarpWidth = 0;
    obj.isEnable = item.isEnable;
    if (item.itemType === 1) {
        let tx = data[obj.Filed]
        if (item.name === '颜色') tx = tx ? tx.split(',')[0] : '';
        if (item.name === '店铺名称') tx = sv_us_name;
        if (item.name === '零售价') tx = $app.moneyFixed(tx, 2);
        // if (item.name === '流水号')
        obj.Text = item.displayModel === 2 ? (tx || '') : item.title + (tx || '');
        if (item.name === '单号' && $app.isNull(data[obj.Filed])) obj.Text = '';
    }
    if (item.itemType === 2) {
        let tx = $app.isNull(data[obj.Filed]) ? new Date : data[obj.Filed];
        if (item.name === '生产日期') {
            let dateFormat =
                item.dateTimeDisplayModel === 1 ? 'yyyy年MM月dd日'
                    : item.dateTimeDisplayModel === 2 ? 'yyyy/MM/dd'
                        : item.dateTimeDisplayModel === 3 ? 'MM/dd'
                            : item.dateTimeDisplayModel === 4 ? 'MM-dd HH:mm'
                                : item.dateTimeDisplayModel === 5 ? 'yyyy/MM/dd HH:mm:ss' : '';
            !$app.isNull(tx) && (tx = $app.currentTime(new Date(tx), dateFormat));
            if (sv_uit_cache_name === 'cache_name_cake_baking' && $app.isNull(tx)) {       // 烘培行业 生产日期 处理
                tx = $app.currentTime(new Date(), dateFormat);
            }
        }
        obj.Text = item.displayModel === 2 ? tx : item.title + tx;
    }
    if (item.itemType === 3) {
        obj.Text = item.displayModel === 2 ? (data[obj.Filed] || '') : (item.title + data[obj.Filed] || '')
    }
    // 条码打印
    if (item.itemType === 4) {
        const tx = data[obj.Filed] || ''
        if (item.displayType === 3 || item.barCodeDisplayType === 3) {
            obj.Text = tx
            obj.Type = 'barcode'
            obj.hideText = false
        } else if (item.displayType === 2 || item.barCodeDisplayType === 2) {
            obj.Text = tx
            obj.Type = 'barcode'
            obj.hideText = true
        } else if (item.displayType === 1 || item.barCodeDisplayType === 1) {
            obj.Text = tx
            obj.Type = null
            obj.hideText = false
        }
        // obj.Width = parseType('int', pxTommX(item.barCodeWidth))
        obj.Width = item.barCodeWidth + 10
        obj.Height = item.barCodeHeight || 0
        obj.FontStyle = 1
        // obj.X2 = 2   // 条码线条宽度
        // obj.BarCodePaddingRight = 5
    }
    if (item.itemType === 5) {
        obj.Text = data[obj.Filed] || ''
        obj.Warp = item.displayStyle !== 3
    }
    if (item.itemType === 6) {
        obj.Text = data[obj.Filed] || ''
        obj.Warp = item.displayStyle !== 3
    }
    if (item.itemType === 7) {
        obj.Text = item.displayModel === 2 ? (data[obj.Filed] || '') : (item.title + data[obj.Filed] || '');
    }
    // 自定义信息
    if (item.itemType === 9) {
        item.title.replace('\n', '');
        let tx = data[obj.Filed] || ''
        if (item.name === '自定义文本') tx = item.title || '';
        if (item.name === '会员价') tx = $app.moneyFixed(tx, 2);
        obj.Text = item.displayModel === 2 ? tx : item.title + tx
    }
    if (item.itemType === 12) {
        obj.Text = item.displayModel === 2 ? (data[obj.Filed] || '') : (item.title + data[obj.Filed] || '')
        obj.Warp = true
    }
    let objList = [];
    objList = handleMultiline(obj, item, pxTommX, pxTommY, width, height);
    // if (obj.Filed === 'fabric_name') {
    //     objList = handleMultiline(obj, item, pxTommX, pxTommY, width, height);
    // } else {
    //     objList = obj;
    // }
    return objList
}

const getPrintData = (data, tem, userInfo) => {             // 打印数据组装
    const pxTommX = pw(tem.width, tem.height)
    const pxTommY = ph(tem.width, tem.height)
    tem.pricesTagItems = tem.pricesTagItems.sort((a, b) => {
        if (a.top < b.top) return -1
        if (a.top > b.top) return 1
        return 0
    })
    let dataList = $app.isNull(tem.pricesTagItems) ? [] : tem.pricesTagItems.map(item => {
        const obj = JSON.parse(JSON.stringify(crmap[item.name]));
        obj.X = parseType('int', pxTommX(item.left));
        obj.Y = parseType('int', pxTommY(item.top));
        return setObj(data, obj, item, userInfo.sv_us_name, userInfo.sv_uit_cache_name, pxTommX, pxTommY, tem.width, tem.height);
    });
    dataList = [].concat.apply([], dataList);
    dataList = dataList.filter(e => e.isEnable !== false)
    addHeight = 0;
    return JSON.stringify({
        Width: parseType('int', 96 / 25 * tem.width),
        Height: parseType('int', 96 / 25 * tem.height),
        DataList: dataList
    })
}
const getPrintArray = (goodsList) => {                      // 四排打印，每一百个标签调用一次打印方法
    let labelList = [],                                             // 打印数据 数组
        labelListItem = [],                                         // 打印数据 数组
        subTotal = 0;                                               // 当前数组标签数量
    const onceNum = 100,                                            // 一次打印多少个标签
        newLabelList = JSON.parse(JSON.stringify(goodsList));       // 深拷贝商品数据
    newLabelList.forEach((item, index) => {                         // 循环所有商品
        if (subTotal + item.num >= onceNum) {                       // 到达指定数量 生成数组
            function a(n) {
                const initNum = n
                item.num = onceNum - subTotal
                labelListItem.push(JSON.parse(JSON.stringify(item)))
                labelList.push(labelListItem)
                subTotal = 0
                labelListItem = []
                if (initNum - item.num <= onceNum) {
                    item.num = initNum - item.num
                    labelListItem.push(item)
                    subTotal += item.num
                } else {
                    a(initNum)
                }
            }
            a(item.num)
        } else {
            labelListItem.push(JSON.parse(JSON.stringify(item)))
            subTotal += item.num
            index === goodsList.length - 1 && labelList.push(labelListItem)       // 最后一个标签且不超过100就把数据存入打印数据
        }
    })
    labelList.reverse()
    return labelList
}
const getColumnPrintData = (data, tem, printName, dir, columnNum, userInfo) => {
    try {
        const colSeam = 2                                                       // 列间隔
        const rowSeam = 2                                                       // 行间隔
        const newColSeam = colSeam + 1                                          // 列间隔
        const newRowSeam = rowSeam + 0.3                                        // 行间隔 此处可能存在误差,需真机调试 0.3四排打印真机误差 0.05虚拟机误差
        const pxTommX = pw(tem.width, tem.height)
        const pxTommY = ph(tem.width, tem.height)
        data.forEach((ditem, index) => {                                          // index处理四排打印机连续第二次会错位
            let col = 0                                                             // 列
            let row = 0                                                             // 行
            let newDataList = []
            ditem.forEach(val => {
                for (var i = 1; i <= val.num; i++) {
                    if (col === columnNum) { col = 0; row++; }
                    let dataList = $app.isNull(tem.pricesTagItems) ? [] : tem.pricesTagItems.map(item => {
                        const obj = JSON.parse(JSON.stringify(crmap[item.name]))
                        obj.X = parseType('int', pxTommX(item.left + (tem.width + newColSeam) * 10 * col));
                        obj.Y = parseType('int', pxTommY(item.top + (tem.height + newRowSeam) * 10 * row + (index ? 18 : 0)));
                        return setObj(val, obj, item, userInfo.sv_us_name, userInfo.sv_uit_cache_name, pxTommX, pxTommY);
                    });
                    dataList = [].concat.apply([], dataList);
                    newDataList.push(...JSON.parse(JSON.stringify(dataList)));
                    col++;
                }
            })
            const printWidth = tem.width * columnNum + (columnNum * 2) + 4
            const printHeight = tem.height * (row + 1) + ((rowSeam) * row)
            const printdata = JSON.stringify({
                Width: parseType('int', 96 / 25 * printWidth),
                Height: parseType('int', 99 / 25 * printHeight),
                DataList: newDataList
            })
            // console.log(printdata);
            Cef.PrintSupMarkLabel(printdata, 0, printName, '1', '1', dir)
        })
    } catch (err) {
        alert(err)
    }
}

const printLabel = (obj) => {                       // 打印方法
    if (typeof Cef === 'undefined') return;
    if (typeof Cef.PrintSupMarkLabel === 'undefined') return resetMessage({ showClose: true, message: '请下载最新客户端', type: 'error' });
    let { data, tem, printName, dir, columnNum, userInfo } = obj;
    if ($app.isNull(data)) return resetMessage({ showClose: true, message: '未找到需要打印的商品', type: 'error' });
    if ($app.isNull(tem)) return resetMessage({ showClose: true, message: '未找到需要打印的标签模板', type: 'error' });
    if ($app.isNull(columnNum)) return resetMessage({ showClose: true, message: '请设置每行标签数', type: 'error' });
    if ($app.isNull(userInfo)) return resetMessage({ showClose: true, message: '未传入当前店铺信息', type: 'error' });
    printName = $app.isNull(printName) ? '' : printName;
    dir = $app.isNull(dir) ? '0' : dir;

    resetMessage({ showClose: true, message: '正在打印，请稍等......', type: 'success' });
    if (columnNum === 1) {
        try {
            data.forEach(item => {
                let printNum = item.num > 0 ? item.num : 1;
                item.sv_p_artno = $app.isNull(item.sv_p_artno) ? item.sv_p_barcode : item.sv_p_artno;
                let printData = getPrintData(item, tem, userInfo);
                console.log(printData, 0, printName, printNum + '', '1', dir);
                Cef.PrintSupMarkLabel(printData, 0, printName, printNum + '', '1', dir);
            })
        } catch (err) {
            alert(err)
        }
    } else {
        data.forEach(item => {
            item.sv_p_artno = $app.isNull(item.sv_p_artno) ? item.sv_p_barcode : item.sv_p_artno;
        })
        const printData = getPrintArray(data)
        getColumnPrintData(printData, tem, printName, dir, columnNum, userInfo)
    }
}
//#endregion
function handleMultiline(obj, item, pxTommX, pxTommY, width, height) {              // 组装数据  自动换行处理
    const labelWidth = parseType('int', 96 / 25 * width);                   // 标签宽
    // const labelHeight = parseType('int', 96 / 25 * height);                 // 标签高
    const x = width * 10 / parseType('int', 96 / 25 * width);               // 标签和模板的比例系数  400为模板的固定像素宽度
    const textX = item.left / x;                                            // x坐标
    // const textY = addHeight * x;                                            // y坐标
    const fontPx = 0.75 * obj.FontSize;                                     // 字号占位   0.75为实际打印出来相差的系数
    const maxTextLength = (labelWidth - textX) / fontPx;                    // 一行最多打几个  1.4用于将标签字号转成像素
    const textLength = $app.getLength(obj.Text);                            // 文本长度
    if (textLength > maxTextLength) {
        let textList = [];
        if (obj.Filed === 'fabric_name') {
            textList = obj.Text.split(/,|，/g);
            textList = $app.isNull(textList) ? [] : textList.map(e => {
                let subList = e;
                if ($app.getLength(e) > maxTextLength) {
                    subList = $app.strWrap(e, maxTextLength);               // 将数组分割
                }
                return subList
            })
            textList = [].concat.apply([], textList);
        } else {
            textList = $app.strWrap(obj.Text, maxTextLength);               // 将数组分割
        }
        let list = $app.isNull(textList) ? [] : textList.map((e, i) => {
            let data = {};
            Object.keys(obj).forEach(key => {
                data[key] = obj[key];
            })
            data.Text = e;
            data.X = obj.X;
            data.Y = pxTommY(item.top + addHeight);
            i < textList.length - 1 && (addHeight = addHeight + fontPx * 2 * x);                             // +6是实际打印出来的文字的内边距空白
            return data;
        })
        return list;
    } else {
        obj.Y = pxTommY(item.top + addHeight);
        return obj;
    }
}

export { printLabel }