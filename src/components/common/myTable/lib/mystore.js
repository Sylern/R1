

export default class myTableStore {
    constructor(table, options) {
        this.table = table;                 // 表格数据
        this.columns = [];                  // 列的数据
        this.fixedColumns = [];             // 左侧固定列数据
        this.fixedColumnsRight = [];        // 右侧固定列数据
        this.checked = [];                  // 选中的checked值
    }
    initStore() {                 // 初始化监听函数
        let store = this;
        this.table.eventbus.on('addColumn', (colObj) => { store.columns.push(colObj); });
        this.table.eventbus.on('addFixedColumn', (colObj) => { store.fixedColumns.push(colObj); });
        this.table.eventbus.on('addFixedColumnRight', (colObj) => { store.fixedColumnsRight.push(colObj); });
        this.table.eventbus.on('changeChecked', (colObj) => { store.fixedColumnsRight.push(colObj); });
        this.table.eventbus.on('clear', () => { store.fixedColumnsRight = []; store.fixedColumns = []; store.columns = []; });
    }
    debug() {                     // 调试
        // console.log('myTableStore debug', this.columns)
    }
    getColumns() {                // 获取列的数据
        return this.columns;
    }
}