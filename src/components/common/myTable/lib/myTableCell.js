import utils from '../../../../utils/utils';
export default {
    name: "myTableCell",
    props: {
        label: String,              // 名称    
        prop: String,               // 对应值
        showTooltip: Boolean,       // 显示提示
        width: String,              // 数值
        fixed: String,              // 固定列
        align: String               // 对齐方式
    },
    data() {
        return {};
    },
    render(h) { },
    created() { },
    computed: {
        owner() {
            let parent = this.$parent;
            while (parent && !parent.tableId) { parent = parent.$parent; }
            return parent;
        }
    },
    methods: {
        getRenderCol(h, data, prop) {                   // 数据填充
            let propVal = prop ? prop : this.prop;
            //#region 先判断数据项内是否存在children  去出左侧第一项，并且判断当前是否再第一列 并处理点击行的时候显示行的数据
            let treeHtml = this.getTreeHtml(data, h);

            let vercell = this.verificationCell(data);
            let cellClass = vercell[0];
            let cellbool = vercell[1];



            let className = "cs_td " + "cs_column_" + utils.convertPinyin(this.prop) + '_' + this._uid;
            let divcell = [];
            if (typeof (this.$scopedSlots.default) !== 'undefined') {
                data.label =  this.label;
                let scopeVm = this.$scopedSlots.default(data);
                divcell = [h('div', { class: 'cs_cell ' + cellClass, }, [treeHtml, scopeVm])];
            } else {
                // 判断为复选框  && !cellbool
                if (this.prop === 'selection') {

                    let rowChecked = this.owner.isNull(data['rowChecked']) ? false : data['rowChecked'];
                    className = className + ' notborder';
                    divcell = [h('div', { class: 'cs_cell ' + cellClass },
                        [treeHtml, h('el-checkbox', {
                            class: 'cs_checkbox',
                            attrs: { label: data[this.owner.rowKey], disabled: this.owner.isNull(data.ischecked) ? false : data.ischecked, value: rowChecked },//value: data.rowChecked 
                            on: {
                                change: checked => this.owner.checkedSelectionCell(checked, data)
                            },
                            nativeOn: {
                                click: e => this.handleClick(e)
                            }
                        }, '')])];
                }
                else {
                    let value = this.owner.isNull(data[propVal]) ? '' : data[propVal];                          // 具体值
                    divcell = [h('div', {
                        class: 'cs_cell ' + cellClass,
                        on: {
                            click: e => this.owner.handleCellClick(e, data, propVal, value)
                        }
                    }, [treeHtml, value])];
                    if (this.showTooltip) {                             // 设置tooltip
                        let minWidth = this.owner.isNull(this.width) ? this.owner.isNull(this.owner.minWidth) ? this.owner.defaultMinWidth : this.owner.minWidth : parseInt(this.width);
                        let disabled = value.length * 14 > minWidth ? false : true;
                        divcell = [h('el-tooltip', { class: 'item', attrs: { effect: 'dark', content: value, placement: 'top', disabled: disabled } }, divcell)];
                    }
                }
            }
            return h('div', { class: className }, divcell)
        },
        handleClick(e) {                                // 禁用点击事件冒泡
            e.stopPropagation();
        },
        verificationCell(data) {                        // 判断当前是否是第一行第一列，并且当前是树形数据 
            let oneCell = '';
            let bool = false;
            let findIndex = this.owner.tabledata.findIndex(e => e.children !== undefined);
            if (findIndex > -1) {                       // 判断是否是树形数据  是的话给 不是树形数据的第一列添加一个样式 
                if (this.prop === this.owner.tablecolumns[0].prop && this.owner.isNull(data.children)) {
                    oneCell = " noCell ";
                    bool = true;
                }
            }
            if (!this.owner.isNull(this.align)) oneCell = oneCell + ' ' + this.align + ' ';
            return [oneCell, bool];
        },
        getTreeHtml(data, h) {                          // 获取树形结构的html
            if (this.owner.tablecolumns[0].prop === this.prop && !this.owner.isNull(data.children)) {
                // let className = this.owner.isNull(data.isChildren) ? 'el-icon-arrow-right' : 'el-icon-arrow-down';
                return h('i', { class: data.chilrenClass, on: { click: e => this.owner.handleTreeClick(e, data) } }, '');
            }
            return '';
        },
    },
    mounted() {
        //  分发事件线 添加addcolumn事件
        // if(this.owner.key>1) this.owner.eventbus.fire('clear');
        let fixed = this.fixed !== undefined ? this.fixed === 'right' ? 'right' : 'left' : undefined;
        this.row = { label: this.label, showTooltip: this.showTooltip, prop: this.prop, fixed, width: this.width || 0, colRef: this };
        this.owner.eventbus.fire('addColumn', this.row);
        if (fixed === 'left') {
            this.owner.eventbus.fire('addFixedColumn', this.row);
        }
        if (fixed === 'right') {
            this.owner.eventbus.fire('addFixedColumnRight', this.row);
        }
    },
}
