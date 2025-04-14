import EventBus from './eventbus';
import myTableStore from './mystore';
import utils from '../../../../utils/utils';
export default {
    name: "myTable",
    components: {},
    props: {
        data: Array,
        stripe: Boolean,
        rowClick: Boolean,
        lazyChildren: Boolean,
        isAllChecked: Boolean,
        rowKey: String,
        minWidth: Number,
        load: Function,
        maxHeight: Number,
        notHeight: Boolean
    },
    data() {
        var eventbus = new EventBus({});
        var mystore = new myTableStore(this, {});
        return {
            eventbus,
            mystore,
            tableId: 'myTable' + new Date().getTime(),
            tabledata: this.initTableData(),
            tablecolumns: [{}],
            tableFixed: [{}],
            tableFixedRight: [{}],
            showTable: true,
            avgWidth: 0,                    // 平均宽度
            defaultMinWidth: 50,            // td 最小宽度
            key: 1,                         // key标识
            checkedJson: []                 // 选中的数据项
        }
    },
    watch: {
        data: {
            inmmediate: true,
            deep: true,
            handler(newVal, oldVal) {
                this.tabledata = this.initTableData();
            },
        },
        tabledata: {
            // inmmediate: true,
            deep: true,
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    let parentHeight = this.$refs["myTable"].parentNode.parentNode.offsetHeight;
                    // let nextNode = this.$refs["myTable"].parentNode.parentNode.nextSibling;
                    let maxTop = this.$refs["myTable"].parentNode.offsetTop;
                    let minTop = this.$refs["myTable"].parentNode.parentNode.offsetTop;
                    // if (!this.isNull(nextNode)) {
                    //     let nextNodeTop = nextNode.offsetTop;
                    //     parentHeight = nextNodeTop - minTop;
                    // }
                    // let parentHeight = this.$refs["myTable"].parentNode.parentNode.offsetHeight;

                    let top = maxTop - minTop;
                    let pHeigth = parentHeight - 2 * top;
                    let lastHeight = this.$refs["myTable"].parentNode.parentNode.lastElementChild.clientHeight;
                    let heigth = this.$refs["myTable"].parentNode.parentNode.lastElementChild === this.$refs["myTable"].parentNode ? pHeigth : pHeigth - lastHeight;
                    let tabHeigth = this.$refs["myTable"].clientHeight;
                    if (this.maxHeight > 0)
                        this.$refs["myTable"].style.height = this.isNull(this.tabledata) ? 'auto' : (this.tabledata.length * 40 + 45) > this.maxHeight ? this.maxHeight + 'px' : 'auto';
                    else if (this.notHeight)
                        this.$refs["myTable"].style.height = 'auto';
                    else
                        this.$refs["myTable"].style.height = tabHeigth > heigth - 5 ? heigth + 'px' : 'auto';
                })
            }
        }
    },
    render(h) {
        let that = this;
        const bodyColumns = this.isNull(this.tabledata) ? (<div ref="notNull" class="notNull">{this.isNull(this.$slots.empty) ? '暂无数据' : this.$slots.empty}</div>)
            : that._l(this.tabledata, (data, index) => {
                return (
                    <div class={'cs_tr ' + (data.rowstriped === undefined ? '' : data.rowstriped) + data.rowLevel + (data.hoverClass === undefined ? '' : data.hoverClass)} onClick={e => this.handleRow(data, index)} onmouseover={e => this.handleMouseover(data, e)} onmouseout={e => this.handleMouseout(data, e)}>
                        {
                            that._l(this.tablecolumns, (colData, indexData) => {
                                return this.createCol(h, colData, data, 'center');
                            })
                        }
                    </div>
                );
            });
        const styleClass = that._l(this.tablecolumns, (col, index) => {
            return (that.createStyle(h, col, index))
        });
        return (
            <div class="cs_table" ref="myTable" key={this.key}>
                {this.$slots.default}
                <div class="cs_theader" ref="cs_theader">
                    <div class="cs_tr">
                        {
                            this._l(this.tablecolumns, (col, index) => {
                                return (this.createTh(h, col, 'center'))
                            })
                        }
                    </div>
                </div>
                <div class="cs_tbody" ref="cs_tbody" >
                    {/* {bodyColumns} */}
                    <el-scrollbar ref="scrollbar" style="height:100%;width:100%">
                        {bodyColumns}
                    </el-scrollbar>
                </div>
                {/* 左侧滑动固定列 */}
                <div class="cs_fixed" ref="cs_fixed">
                    <div class="cs_theader" >
                        <div class="cs_tr">
                            {
                                this._l(this.tableFixed, (col, index) => {
                                    return (this.createTh(h, col, 'left'))
                                })
                            }
                        </div>
                    </div>
                    <div class="cs_tbody" ref="csFixedTbody">
                        {
                            this._l(this.tabledata, (data, index) => {
                                return (
                                    <div class={'cs_tr ' + (data.rowstriped === undefined ? '' : data.rowstriped) + data.rowLevel + (data.hoverClass === undefined ? '' : data.hoverClass)} onClick={e => this.handleRow(data, index)} onmouseover={e => this.handleMouseover(data, e)} onmouseout={e => this.handleMouseout(data, e)}>
                                        {
                                            that._l(this.tableFixed, (colData, indexData) => {
                                                return this.createCol(h, colData, data, 'left');
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                {/* 右侧滑动固定列 */}
                <div class="cs_fixedRight" ref="cs_fixedRight">
                    <div class="cs_theader" >
                        <div class="cs_tr">
                            {
                                this._l(this.tableFixedRight, (col, index) => {
                                    return (this.createTh(h, col, 'right'))
                                })
                            }
                        </div>
                    </div>
                    <div class="cs_tbody" ref="csFixedRight">
                        {
                            this._l(this.tabledata, (data, index) => {
                                return (
                                    <div class={'cs_tr ' + (data.rowstriped === undefined ? '' : data.rowstriped) + data.rowLevel + (data.hoverClass === undefined ? '' : data.hoverClass)} onClick={e => this.handleRow(data, index)} onmouseover={e => this.handleMouseover(data, e)} onmouseout={e => this.handleMouseout(data, e)} >
                                        {
                                            that._l(this.tableFixedRight, (colData, indexData) => {
                                                return this.createCol(h, colData, data, 'right');
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                {this.isNull(this.tabledata) ? "" : this.$slots.append}
                {styleClass}
            </div >
        );
    },
    created() {
        this.mystore.initStore();
        // this.tabledata = this.initTableData();
    },
    mounted() {
        this.tablecolumns = this.mystore.columns || [];
        this.tableFixed = this.mystore.fixedColumns || [];
        this.tableFixedRight = this.mystore.fixedColumnsRight || [];
        this.handleScroll();
        this.$nextTick(() => {
            if (!this.isNull(this.$refs["myTable"])) {
                let parentHeight = this.$refs["myTable"].parentNode.parentNode.offsetHeight;
                let maxTop = this.$refs["myTable"].parentNode.offsetTop;
                let minTop = this.$refs["myTable"].parentNode.parentNode.offsetTop;
                let top = maxTop - minTop;
                let pHeigth = parentHeight - 2 * top;
                let lastHeight = this.$refs["myTable"].parentNode.parentNode.lastElementChild.clientHeight;
                let heigth = this.$refs["myTable"].parentNode.parentNode.lastElementChild === this.$refs["myTable"].parentNode ? pHeigth : pHeigth - lastHeight;
                let tabHeigth = this.$refs["myTable"].clientHeight;
                heigth = heigth < 100 ? 100 : heigth;
                if (this.maxHeight > 0)
                    this.$refs["myTable"].style.height = this.isNull(this.tabledata) ? 'auto' : (this.tabledata.length * 40 + 45) > this.maxHeight ? this.maxHeight + 'px' : 'auto';
                else if (this.notHeight)
                    this.$refs["myTable"].style.height = 'auto';
                else
                    this.$refs["myTable"].style.height = tabHeigth > heigth - 5 ? heigth + 'px' : 'auto';
            }
        })
    },
    methods: {
        createCol(h, colData, data, type) {       // 添加行数据
            if (colData.prop === undefined) return;
            //#region 装载数据
            let rowStore = this.mystore.getColumns();
            let rowStoreColumn = rowStore.find((ele) => { return ele.prop === colData.prop; });
            if (rowStoreColumn && rowStoreColumn.colRef) {
                if ((type === 'center' && (colData.fixed === undefined || colData.fixed === 'right')) || type === 'left' || type === 'right')
                    return rowStoreColumn.colRef.getRenderCol(h, data);
            }
        },
        handleScroll() {                          // 滚动条监听事件
            if (!this.isNull(this.$refs.scrollbar)) {
                let scrollbarEl = this.$refs.scrollbar.wrap;
                let that = this;
                scrollbarEl.onscroll = () => {
                    this.$nextTick(() => {
                        // 横向滚动
                        that.$refs.cs_theader.scrollLeft = that.$refs.scrollbar.wrap.scrollLeft;         // 设置表头与滚动条滚动一致
                        // 判断横向滚动是否大于0  大于0的话左右两侧的固定列添加样式
                        that.$refs.cs_fixed.setAttribute('class', that.$refs.scrollbar.wrap.scrollLeft > 0 ? 'cs_fixed fixed' : 'cs_fixed');
                        that.$refs.csFixedTbody.scrollTop = that.$refs.scrollbar.wrap.scrollTop;
                        that.$refs.csFixedRight.scrollTop = that.$refs.scrollbar.wrap.scrollTop;
                        that.$refs.cs_fixedRight.setAttribute('class', that.$refs.scrollbar.wrap.scrollLeft > 0 ? 'cs_fixedRight fixed' : 'cs_fixedRight');
                    });
                }
            }

        },
        createTh(h, colData, type) {              // 创建表头并设置样式
            if (colData.prop === undefined) return;
            let className = "cs_td " + "cs_column_" + utils.convertPinyin(colData.prop) + '_' + colData.colRef._uid;
            // // 判断是否是中间滑动区域
            // if (type === 'center') {
            //     // 取出左侧固定列 并计算出距离左侧的距离
            //     let that = this;
            //     let fixedLeft = this.tablecolumns.filter(e => e.fixed === 'left');
            //     let fixedLeftWidth = fixedLeft.reduce((total, currentValue, currentIndex, arr) => {
            //         return total + parseInt((currentValue.width || that.avgWidth));
            //     }, 0);
            //     this.$nextTick(() => {
            //         that.$refs.scrollbar.$el.style.marginLeft = fixedLeftWidth + "px";
            //         that.$refs.scrollbar.$el.style.width = "calc(100% - " + fixedLeftWidth + "px)"
            //     });
            // }

            // 判断是否是复选框
            let divcell = [];
            let classCell = ' cs_cell ';
            if (!this.isNull(colData.colRef.align)) classCell = classCell + ' ' + colData.colRef.align;
            if (colData.prop === 'selection') {
                divcell = [h('div', { class: classCell }, [h('el-checkbox', {
                    ref: 'myTableCheckboxAll',
                    attrs: { disabled: this.isNull(this.isAllChecked) ? true : this.isAllChecked },
                    on: {
                        change: this.checkedChange
                    }
                }, '')])];
            } else if (!this.isNull(colData.colRef.$slots.header)) {
                divcell = [h('div', { class: classCell }, colData.colRef.$slots.header)];
            }
            else {
                divcell = [h('div', { class: classCell }, colData.label)];
            }
            return h('div', { class: className }, divcell);
        },
        createStyle(h, col, index) {              // 设置style 样式
            if (col.prop === undefined) return;

            let minWidth = this.minWidth > 0 ? this.minWidth : this.defaultMinWidth;
            // 取出整个头部的宽度
            let heard = this.$refs.cs_theader;
            let heardWidth = heard.clientWidth > 0 ? heard.clientWidth : heard.offsetWidth;                             // 总宽度
            // 取出当前设置了宽度的数据 - 宽度和 - 长度
            let widthData = this.tablecolumns.filter(e => parseInt((e.width || 0)));
            let width = this.isNull(widthData) ? 0 : widthData.reduce((total, currentValue, currentIndex, arr) => { return total + parseInt((currentValue.width || 0)) }, 0);
            let widthLength = widthData.length;

            // 获取最后一条没设置宽度的数据 和 下标
            let nodeWidthData = this.tablecolumns.filter(e => parseInt((e.width || 0)) === 0);
            let lastNodeData = this.isNull(nodeWidthData) ? null : nodeWidthData[nodeWidthData.length - 1];
            let lastIndex = lastNodeData === null ? 0 : this.tablecolumns.findIndex(e => e.prop === lastNodeData.prop);

            // 计算出平均宽度  当平均宽度小于最小宽度的时候以最小宽度为主
            let avgWidth = parseInt((heardWidth - width) / (this.tablecolumns.length - widthLength));
            avgWidth = avgWidth > minWidth ? avgWidth : minWidth;

            // 判断 如果设置了宽度 就直接设置宽度
            let styleWidth = 'width: ';
            if (parseInt((col.width || 0)) > 0) {
                styleWidth = styleWidth + col.width + 'px;' + ' min-width: ' + col.width + 'px';;
            } else {
                // 判断当前是否处于最后一个没设宽度的列  
                if (index === lastIndex) {
                    // 总长度- 当前设置的长度 剩下就是当前的长度值
                    let lastWdith = heardWidth - width - (avgWidth * (this.tablecolumns.length - widthLength - 1));
                    lastWdith = lastWdith > minWidth ? lastWdith : minWidth;
                    styleWidth = styleWidth + lastWdith + 'px;' + ' min-width:' + lastWdith + 'px';
                } else {
                    styleWidth = styleWidth + avgWidth + 'px;' + ' min-width:' + avgWidth + 'px';
                }
            }

            // 获取做的固定的数据列 - 左侧设置了宽度的数据 - 没设置宽度的长度
            let leftFixedData = this.tablecolumns.filter(e => e.fixed === 'left');
            let leftFixedWidth = leftFixedData.filter(e => parseInt((e.width || 0)) > 0).length === 0 ? 0 : leftFixedData.filter(e => parseInt((e.width || 0)) > 0).reduce((total, currentValue, currentIndex, arr) => { return total + parseInt((currentValue.width || 0)) }, 0);
            let leftFixedLength = leftFixedData.filter(e => parseInt((e.width || 0)) === 0).length;
            let leftWidth = avgWidth * leftFixedLength;
            this.$nextTick(() => {
                // 获取table 的实际高度
                // let height = this.$refs.myTable.parentElement.clientHeight;
                // this.$refs.myTable.style.height = height + "px";

                let marginLeft = leftFixedWidth + leftWidth;
                this.$refs.scrollbar.$el.style.marginLeft = marginLeft + "px";
                this.$refs.scrollbar.$el.style.width = "calc(100% - " + marginLeft + "px)";
                this.$refs.scrollbar.wrap.style.marginBottom = "-17px";
                this.$refs.scrollbar.wrap.style.marginRight = "-17px";

                // 设置数据为空的时候 内容居中
                if (!this.isNull(this.$refs.notNull)) {
                    this.$refs.notNull.style.width = "calc(100% + " + (marginLeft - 17) + "px)";
                    this.$refs.notNull.style.marginLeft = '-' + marginLeft + "px";
                }
                // 设置如果选中项的长度等于当前数据的长度 那么设置全选选中
                // if (this.tabledata.length === this.checkedJson.length && !this.isNull(this.$refs.myTableCheckboxAll) && this.checkedJson.length > 0) {
                //     this.$refs.myTableCheckboxAll.model = true;
                // }
            });
            let className = ".cs_column_" + utils.convertPinyin(col.prop) + '_' + col.colRef._uid;
            className = className + '{' + styleWidth + '}';
            return h('style', {}, className);
        },
        getHeight() {                             // 获取theader高度
            let cs_theader = this.$refs.cs_theader;
            let height = cs_theader.clientHeight > 0 ? cs_theader.clientHeight : cs_theader.offsetHeight;
            return height;
        },
        taggleRowSelection(id, isBool) {          // 设置选中某行数据
            this.$nextTick(() => {
                let data = this.tabledata.find(e => e[this.rowKey] === id);
                if (!this.isNull(data)) {
                    let that = this;
                    isBool = isBool === undefined ? !data.rowChecked : isBool;
                    this.setChecked(isBool, data);
                    this.tabledata = this.tabledata.map(e => { e.rowChecked = e[that.rowKey] === id ? isBool : e.rowChecked; return { ...e } });
                    //     if (this.tabledata.length === this.checkedJson.length) {
                    //         this.$refs.myTableCheckboxAll.model = true;
                    //     }
                }
            });
        },
        cancelCheckedAll() {                      // 外部ref调用取消全选
            this.checkedJson = [];
            this.tabledata.forEach(e => {
                e.rowChecked = false;
            });
            this.$refs.myTableCheckboxAll.model = false;
        },
        checkedChange(isBool) {                   // 全选事件
            this.$nextTick(() => {
                this.tabledata.forEach(e => {
                    e.rowChecked = this.isNull(e.ischecked) || !e.ischecked ? isBool : false;
                })
                let data = isBool ? this.tabledata.filter(e => e.ischecked !== true) : [];
                this.checkedJson = data;
                this.$emit('select-all', data, isBool);
            });
        },
        checkedSelectionCell(isBool, data) {      // 当前选中的复选框
            if (this.rowClick) {
                return this.handleRow(data);
            }
            let that = this;
            // this.tabledata = this.tabledata.map(e => { e.rowChecked = e[that.rowKey] === data[that.rowKey] ? isBool : e.rowChecked; return { ...e } });
            this.tabledata.forEach(e => {
                if (e[that.rowKey] === data[that.rowKey]) e.rowChecked = isBool
            })
            this.$emit('select', data, this.checkedJson, isBool);
            this.$nextTick(() => {
                this.setChecked(isBool, data);
            });
        },
        setChecked(isBool, data) {                // 设置选中的项
            if (isBool) {                          // 往数据项内添加选中的项
                let findIndex = this.checkedJson.length > 0 ? this.checkedJson.findIndex(e => e[this.rowKey] === data[this.rowKey]) : -1;
                if (findIndex === -1)
                    this.checkedJson.push(data);
            } else {                               // 删除选中的项
                this.checkedJson = this.checkedJson.filter(e => e[this.rowKey] !== data[this.rowKey]);
            }

            // this.setAllUndeterMinate();
            let allChecked = this.$refs.myTableCheckboxAll;
            if (!this.isNull(allChecked)) {
                allChecked.model = this.checkedJson.length === this.tabledata.length ? true : false;
            }
        },
        setAllUndeterMinate() {                   // 设置全选样式
            if (this.isNull(this.$refs.myTableCheckboxAll)) return
            let checkboxAll = this.$refs.myTableCheckboxAll.$el.firstElementChild;
            if (this.checkedJson.length === this.tabledata.length || (this.checkedJson.length === 0)) {
                if (!this.isAllChecked)
                    checkboxAll.setAttribute('class', 'el-checkbox__input');
            } else {
                if (!this.isAllChecked)
                    checkboxAll.setAttribute('class', 'el-checkbox__input is-indeterminate');
            }
        },
        handleRow(data) {                        // 点击行事件
            if (this.isNull(data.children) && this.rowClick) {
                this.tabledata.forEach(e => {
                    data.id === e.id && (e.rowChecked = data.rowChecked ? false : true)
                })
                this.$emit('row-click', data);
                this.$nextTick(() => {
                    this.checkedJson = this.tabledata.filter(e => e.rowChecked);
                    if (this.$refs.myTableCheckboxAll) {
                        this.$refs.myTableCheckboxAll.model = this.checkedJson.length === this.tabledata.length;
                    }
                });
                return
            }
            data.isChildren = !data.isChildren;
            data.chilrenClass = data.isChildren === false ? 'el-icon-arrow-right' : 'el-icon-arrow-right showChildren';
            // this.tabledata.forEach(item => {
            //     json.remove(e);
            // });
            if (this.lazyChildren) {
                this.$emit('row-click', data);
            } else {
                let json = [];
                this.data.forEach((item, index) => {
                    let isChildren = data.index === index ? data.isChildren : false;
                    let chilrenClass = isChildren ? 'el-icon-arrow-right showChildren' : 'el-icon-arrow-right';
                    json.push({ ...item, isChildren, chilrenClass, hoverClass: '', rowLevel: '', index });
                    if (isChildren) {
                        (item.children || []).forEach(e => {
                            let rowChecked = this.isNull(this.checkedJson) ? false : this.checkedJson.findIndex(item => item[this.rowKey] === e[this.rowKey]) > -1 ? true : false;
                            json.push({ ...e, parentId: item[this.rowKey], rowLevel: ' row--level ', rowChecked });
                        });
                    }
                });
                this.tabledata = json;
            }
        },
        handleCellClick(e, row, column, cell) {   // 点击列事件
            this.$emit('cell-click', row, column, cell)
        },
        handleTreeClick(event, row) {             // 点击树形数据并展开-收缩数据
            this.$emit('tree-click', row)
        },
        handleMouseover(data, e) {                // 鼠标移入添加事件
            // let json = [...this.tabledata];
            // json = json.map(m => {
            //     if (m[this.rowKey] === data[this.rowKey]) return { ...m, hoverClass: ' hover-row ' }; return { ...m, hoverClass: '' }
            // });
            // this.tabledata = json;
        },
        handleMouseout(data, e) {                 // 鼠标移出添加事件
            // let json = [...this.tabledata];
            // json = json.map(m => { if (m[this.rowKey] === data[this.rowKey]) return { ...m, hoverClass: '' }; return { ...m } });
            // this.tabledata = json;
        },
        initTableData() {
            let json = [];
            this.data.forEach((item, index) => {
                let isChildren = this.isNull(item.isChildren) ? false : item.isChildren;
                let chilrenClass = !this.isNull(item.children) && item.children.length > 0 ? isChildren ? 'el-icon-arrow-right showChildren' : 'el-icon-arrow-right' : '';
                json.push({ ...item, isChildren, chilrenClass, hoverClass: '', rowLevel: '', index });
                if (isChildren) {
                    (item.children || []).forEach(e => {
                        // let rowChecked = this.isNull(this.checkedJson) ? false : this.checkedJson.findIndex(item => item[this.rowKey] === e[this.rowKey]) > -1 ? true : false;
                        // json.push({ ...e, parentId: item[this.rowKey], rowLevel: ' row--level ', rowChecked });
                        let isChildren = this.isNull(e.isChildren) ? false : e.isChildren;
                        let chilrenClass = !this.isNull(e.children) && e.children.length > 0 ? isChildren ? 'el-icon-arrow-right showChildren' : 'el-icon-arrow-right' : '';
                        json.push({ ...e, isChildren, chilrenClass, parentId: item[this.rowKey], rowLevel: ' row--level ' });
                        if (isChildren) {
                            e.children.forEach(l => {
                                json.push({ ...l, parentId: e[this.rowKey], rowLevel: ' row--level  row--level3' });
                            })
                        }
                    });
                } else {
                    if (this.lazyChildren && item.children) json[index].children = [{}]
                }
            });

            let allChecked = this.$refs.myTableCheckboxAll;
            if (!this.isNull(allChecked)) {
                allChecked.model = this.isNull(json) ? false : this.checkedJson.filter(e => json.findIndex(k => k[this.rowKey] === e[this.rowKey]) > -1).length === json.length ? true : false;
            }
            return json;
        },
        getData() {                               // 初始化 重组数据 hoverClass 鼠标移入的样式 rowLevel:树形数据样式
            let json = [], that = this;
            this.data.forEach((item, index) => {
                let chilrenClass = that.isNull(item.isChildren) || item.isChildren === false ? 'el-icon-arrow-right' : 'el-icon-arrow-right showChildren';
                json.push({ ...item, chilrenClass, hoverClass: '', rowLevel: '', index });
                if (item.isChildren === true) {
                    item.children.forEach(e => {
                        let rowChecked = that.isNull(that.checkedJson) ? false : that.checkedJson.findIndex(item => item[that.rowKey] === e[that.rowKey]) > -1 ? true : false;
                        json.push({ ...e, parentId: item[this.rowKey], rowLevel: ' row--level ', rowChecked });
                    });
                }
            });

            let allChecked = this.$refs.myTableCheckboxAll;
            if (!this.isNull(allChecked)) {
                allChecked.model = this.isNull(json) ? false : this.checkedJson.length === json.length ? true : false;
            }
            return json;
        },
        isNull(str) {                             // 判断是否为空
            if (str === null) return true;
            if (str === undefined) return true;
            if (str === "null") return true;
            if (str.length === 0) return true;
            if (/^\s*$/i.test(str)) return true;
            return false;
        },
        onReset() {                               // 表格重置
            this.tablecolumns = this.mystore.columns = [];
            this.tableFixed = this.mystore.fixedColumns = [];
            this.tableFixedRight = this.mystore.fixedColumnsRight = [];
            this.key = this.key + 1;
            this.$nextTick(() => { this.handleScroll(); });
        },
        onSetScrollTop(top) {                     // 设置滚动条高度
            this.$refs.scrollbar.wrap.scrollTop = top;
        },
        onScrollbar() {                           // 重置滚动条的高度和宽度
            this.$refs["scrollbar"].style.height = '100%';
            this.$refs["scrollbar"].style.width = '100%';
        }
    }
}