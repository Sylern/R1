import { stockApi } from '@/api/index';
import { checkedCommodity } from '@/components/index';
import { mapState } from 'vuex';
export default {
    name: 'goodsSetting',
    components: { checkedCommodity },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataItem: {
            type: Object,
            default: () => {
                return {
                    sv_scale_id: ''
                }
            }
        }
    },
    data() {
        return {
            searchText: '',
            checkedCommodity: [],                       // 选择商品列表
            isCheckedCommodity: false,                  // 打开商品选择列表
            tableData: [],
            total: 0,
            query: {
                sv_scale_id: null,
                keyword: '',
                page: 1,
                pagesize: 10,
            }
        }
    },
    computed: {
        ...mapState(['isCefClient']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.initData();
                    this.query.sv_scale_id = this.dataItem.sv_scale_id;
                    this.getScaleConfigRelationList();
                    this.$nextTick(() => {
                        this.$refs.searchText.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        initData() {
            this.query = {
                sv_scale_id: null,
                keyword: '',
                page: 1,
                pagesize: 10
            }
        },
        addGoods() {
            this.isCheckedCommodity = true;
        },
        pluChange({ target }, index) {                               // 输入改数量
            target.value = this.$app.verifyNumber(target.value);
            this.tableData[index].sv_scale_product_plu = target.value;
            this.tableData.forEach(item => {
                if (item.product_id === this.tableData[index].product_id) {
                    item.sv_scale_product_user_id = ''
                }
            });
        },
        async goodsSetting() {                                            // 下发操作---对接条码秤
            // if (!this.isCefClient) return this.$message.warning('请使用客户端连接使用');
            // if (!this.tableData.length) return this.$message.warning('请选择下发商品');
            // const svScaleIp = this.dataItem.sv_scale_ip;                     // 下发ip
            // const svScalePort = parseInt(this.dataItem.sv_scale_port);       // 下发端口
            // let scalemodel;


            const svScaleIp = this.dataItem.sv_scale_ip;                     // 下发ip
            const svScalePort = parseInt(this.dataItem.sv_scale_port);       // 下发端口
            const scalemodel = this.tableData.filter(e => e.sv_scale_product_id === 0).map(item => {
                if (item.sv_scale_product_plu.length < 4) {
                    item.sv_scale_product_plu = formatZero(item.sv_scale_product_plu, 4)
                }
                let parIntNum = '';                                          // 切割后为整数的字段
                let parFloatNum = '';                                        // 切割后为小数点的字段
                let svPUnitprice = '';                                       // 重组的价格字段
                if (String(item.sv_p_unitprice).indexOf('.') > -1) {
                    item.sv_p_unitprice = item.sv_p_unitprice.toFixed(2)
                    const IntNum = (parIntNum = String(item.sv_p_unitprice).split('.')[0]);
                    const FloatNum = String(item.sv_p_unitprice).split('.')[1];
                    parIntNum = formatZero(IntNum, 4);
                    parFloatNum = formatZero(FloatNum, 2);
                    svPUnitprice = parIntNum + parFloatNum;
                } else {
                    parIntNum = formatZero(String(item.sv_p_unitprice), 4);
                    parFloatNum = formatZero('00', 2);
                    svPUnitprice = parIntNum + parFloatNum;
                }
                const guaranteeperiod = formatZero(item.sv_guaranteeperiod, 3);
                function formatZero(num, len) {
                    if (String(num).length > len) {
                        if (len === 3) { // 3为去质保天数，最大为999
                            return '999'
                        } else {
                            return num
                        }
                    } else {
                        return (Array(len).join(0) + num).slice(-len)
                    }
                }
                const configList =
                    '!0V' +
                    item.sv_scale_product_plu +             // 为PLU序号	（0001~4000）
                    'A' +                                   //
                    (this.dataItem.sv_scale_format) +       // 2位秤编码
                    (item.sv_p_artno) +                     // 为商品代码	（5位）
                    svPUnitprice +                          // 为单价		（6位）	单位为：分/kg [002000此时表示单价为: 20元/kg]
                    '0' +                                   // 0称重计件定重 0：称重		1：计件		2：定重
                    '00' +                                  // 为特殊信息1
                    '00' +                                  // 为特殊信息2
                    '00' +                                  // 为特殊信息3
                    guaranteeperiod +                       // 为有效期3位
                    this.dataItem.sv_scale_format +         // 为店名号2位
                    '00' +                                  // 为部门号2位
                    '0000000000000' +                       // 为13位数字代号13位
                    '00000' +                               // 为皮重5位单位为：g [01000此时表示皮重为:1kg]
                    '00' +                                  // 为标签号[此时表示调用第0号标签]
                    '02' +                                  // 为是否打折[00：不按时间段自动调单价，手动不可以调单价；01：按时间段自动调单价，手动不可以调单价；02：按时间段自动调单价，手动可以调单价]
                    '01' +                                  // 为第一时间段起始时间
                    '06' +                                  // 为第一时间段结束时间
                    '10' +                                  // 为第一时间段内折掉
                    '07' +                                  // 为第二时间段起始时间
                    '12' +                                  // 为第二时间段结束时间
                    '20' +                                  // 为第二时间段内折掉
                    '13' +                                  // 为第三时间段起始时间
                    '18' +                                  // 为第三时间段结束时间
                    '30' +                                  // 为第三时间段内折掉
                    '19' +                                  // 为第四时间段起始时间
                    '24' +                                  // 为第四时间段结束时间
                    '40' +                                  // 为第四时间段内折掉
                    'B' +                                   // 分隔符
                    this.getCode(item.sv_p_name) +          // 商品名字
                    'CDE';                                  // 结尾描述
                let itemmodel = {
                    product_id: item.product_id,
                    boolbarcode: false
                };
                if (typeof Cef !== 'undefined') {
                    const msg = configList;
                    const c1 = Cef.dhSendFastKey(
                        svScaleIp,
                        msg,
                        '',
                        svScalePort
                    )
                    if (c1) {
                        return {
                            product_id: item.product_id,
                            sv_p_unitprice: item.sv_p_unitprice,
                            sv_p_barcode: item.sv_p_barcode,
                            sv_p_artno: item.sv_p_artno,
                            sv_p_name: item.sv_p_name,
                            sv_guaranteeperiod: item.sv_guaranteeperiod,
                            sv_scale_product_id: item.sv_scale_product_id,
                            sv_scale_id: this.dataItem.sv_scale_id,
                            sv_scale_format: this.dataItem.sv_scale_format,
                            sv_scale_product_plu: item.sv_scale_product_plu,
                            sv_scale_product_key: -1,
                            boolbarcode: true,
                            sv_scale_product_user_id: item.sv_scale_product_user_id
                        }
                    }
                }
                return itemmodel
            })
            if (!scalemodel || scalemodel.length === 0) return this.$message.error('下发的商品存在不符合下发规则，下发失败');
            // 将已下发商品传给后台
            let configList = scalemodel.filter(e => e.boolbarcode);
            let defeatedpro = scalemodel.filter(e => !e.boolbarcode).length;
            // for (let i = 0; i < scalemodel.length; i++) {
            //     if (scalemodel[i].boolbarcode) {
            //         configList = configList.concat(scalemodel[i]);
            //     } else {
            //         defeatedpro++;
            //     }
            // }
            const model = {
                sv_scale_id: this.dataItem.sv_scale_id, // 秤id
                sv_scale_name: this.dataItem.sv_scale_name, // 条码秤名
                sv_scale_ip: this.dataItem.sv_scale_ip, // 条码秤ip
                sv_scale_port: this.dataItem.sv_scale_port, // 条码秤端口
                sv_scale_brand: this.dataItem.sv_scale_brand, // 厂商
                sv_scale_type: this.dataItem.sv_scale_type, // 设备类型
                sv_scale_format: this.dataItem.sv_scale_format, // 秤编码
                sv_scale_templete: 1, // 标签模板只有默认一个
                sv_scale_remark: this.dataItem.sv_scale_remark, // 备注信息
                sv_scale_codeformat: this.dataItem.sv_scale_codeformat, // 条码格式
                configList: configList
            };
            stockApi.addOrUpdateScale(model).then(res => {
                this.$message({
                    type: 'success',
                    message: '已下发商品到秤，商品下发失败个数' + defeatedpro
                })
                this.$emit('success');
            });
        },
        async getCode(str) {
            let code = '';
            if (typeof Cef !== 'undefined') {
                code = typeof Cef.getVersion === 'function' ? await Cef.getCode(str) : Cef.getCode(str)
            }
            return code
        },
        getCheckedCommodity(list) {
            let array = list.map(e => {
                return {
                    id: e.product_id,
                    product_id: e.product_id,
                    sv_scale_product_id: 0,
                    sv_scale_product_user_id: '',
                    sv_scale_product_plu: '',                       // PLU
                    sv_p_barcode: e.sv_p_barcode,
                    sv_p_name: e.sv_p_name,
                    sv_p_artno: e.sv_p_artno,                       // 货号
                    sv_p_unitprice: e.sv_p_unitprice,               // 商品售价
                    sv_guaranteeperiod: e.sv_guaranteeperiod,       // 质保天数
                }
            })
            this.tableData = array.concat(this.tableData);
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
        },
        handleCurrentChange(page) {
            this.query.page = page;
            this.getScaleConfigRelationList();
        },
        handleSizeChange(pagesize) {
            this.query.pagesize = pagesize;
            this.query.page = 1;
            this.getScaleConfigRelationList();
        },
        clearInputNumber() {                                        // 清除输入内容
            this.searchText = '';
        },
        handleSearch() {
            this.query.page = 1;
            this.query.pagesize = 10;
            this.getScaleConfigRelationList();
        },
        handlePrevent(e) {                                          // 事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleEnter();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        handleSure() {                                              // 确定按钮点击事件                        
            this.closeDialog();
        },
        //#region
        getScaleConfigRelationList() {                              // 获取条码秤商品列表
            if (this.$app.isNull(this.query.sv_scale_id)) return;
            stockApi.getScaleConfigRelationList(this.query).then(res => {
                if (res) {
                    this.total = res.total;
                    this.tableData = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        return {
                            ...e,
                            id: e.product_id
                        }
                    });
                }
            })
        }
        //#endregion
    }
};