import $app from '@/utils/utils.js';

const catering = (args, printer) => {

    //#region mvc脚本组装数据 部分样本
    /*
        postData.HeaderList.push({ "Content": "厨打单"+printTitle, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0, "TextFontSize": 2 });牌号：
        postData.HeaderList.push({ "Content": "外卖预定单", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0, "FontStyleType": 2 });配送时间：
        if (strptype == 1) {//80mm
            StrWidth = 3;
            PagePadding = 5;
        } else if (strptype == 2)//A4 210mm
        {
            StrWidth = 10;
            PagePadding = 10;
            postData.PagePadding = PagePadding;
        }
    */
    //#endregion
    if (typeof Cef === 'undefined' || typeof Cef.NetworkPrint === 'undefined') return;
    let printData = {
        //-------------头部数据-----------------
        "HeaderList": [],
        //-------------中部数据-----------------
        "BodyList": [],
        //-------------标题数据-----------------
        "TitleList": [],
        //-------------页脚数据-----------------
        "FooterList": [],
        //-------------店铺logo数据-----------------
        "LogoData": null,
        //-------------二维码数据-----------------
        "QRCodeData": null,
        //-----------------1：打印，0：预览-----------------
        "Action": 1,
        //-----------------0:58mm,1:80mm,2:210mm,5:76mm-----------------
        "PageType": 1,
        //-----------------5:80mm-----------------
        "PagePadding": 5
    }

    args.forEach((e, i) => {
        // 整行文字类型
        if (e.type === 'line') {
            printData.HeaderList.push(addLineText(e.text, e.align, e.size, e.fontStyle));
        }
        // 自动表格行数
        if (e.type === 'title') {
            printData.TitleList.push(addLineText(e.text, e.align, e.size, 0, e.width));
        }
        // 自动表格行数
        if (e.type === 'tableCalc') {
            printData.BodyList.push(addLineText(e.text, e.align, e.size, 0, 0));
        }
        // 页脚行文字
        if (e.type === 'foot') {
            e.topLine && printData.FooterList.push(addBottomLine());
            printData.FooterList.push(addLineText(e.text, e.align, e.size));
        }
        if (e.spaceLine) {
            e.type === 'line' && printData.HeaderList.push(addSpaceLine());
            e.type === 'title' && printData.TitleList.push(addSpaceLine());
            e.type === 'tableCalc' && printData.BodyList.push(addSpaceLine());
            e.type === 'foot' && printData.FooterList.push(addSpaceLine());
        }
        if (e.bottomLine) {
            e.type === 'line' && printData.HeaderList.push(addBottomLine());
            e.type === 'title' && printData.TitleList.push(addBottomLine());
            e.type === 'tableCalc' && printData.BodyList.push(addBottomLine());
            e.type === 'foot' && printData.FooterList.push(addBottomLine());
        }
    });

    // console.log(JSON.stringify(args));
    // console.log(printData);
    // console.log(JSON.stringify(printData));
    Cef.NetworkPrint(JSON.stringify(printData), printer.ip, printer.port, "1");
}

function addLineText(content, align = 0, fontSize = 9, fontStyle = 0, width = 0, ip = '', port = '') {
    //{ "Content": "厨打单"+printTitle, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0, "TextFontSize": 2 }
    //{ "Content": "外卖预定单", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0, "FontStyleType": 2 }
    let line = {
        Content: content,
        Columns: 1,
        RowNum: 1,
        RowMaxLength: 10,
        Align: align,
        TextFont: 0,
        Width: width,
        TextFontSize: fontSize,
        FontStyleType: fontStyle,
        LineHeight: 20
    }
    !$app.isNull(ip) && (line.PrinterIp = ip);
    !$app.isNull(port) && (line.PrinterPort = port);
    return line
}

function addBottomLine() {
    return {
        Content: '-----------------------------------------------',
        Columns: 1,
        RowNum: 1,
        RowMaxLength: 10,
        Align: 0,
        TextFont: 0,
        Width: 0
    }
}

function addSpaceLine() {
    return {
        Content: '',
        Columns: 1,
        RowNum: 1,
        RowMaxLength: 10,
        Align: 0,
        TextFont: 0,
        Width: 0
    }
}

export { catering }