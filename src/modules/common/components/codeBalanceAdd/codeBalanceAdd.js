import { stockApi } from "@/api/index.js";
export default {
    name: 'codeBalanceAdd',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataItem: {
            type: Object,
            default: () => {
                return {
                    sv_scale_name: '',                              // 名称
                    sv_scale_ip: '',                                // IP
                    sv_scale_port: '4001',                          // 端口号
                    sv_scale_format: '',                            // 秤编码
                    sv_scale_brand: '大华',                         // 厂商
                    sv_scale_type: '大华TM-30Ab',                   // 设备类型
                    sv_scale_codeformat: 'FFWWWWWEEEEEC',           // 条码格式
                    sv_scale_remark: '',                            // 备注
                }
            }
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                sv_scale_name: '',                              // 名称
                sv_scale_ip: '',                                // IP
                sv_scale_port: '4001',                          // 端口号
                sv_scale_format: '',                            // 秤编码
                sv_scale_brand: '大华',                         // 厂商
                sv_scale_type: '大华TM-30Ab',                   // 设备类型
                sv_scale_codeformat: 'FFWWWWWEEEEEC',           // 条码格式
                sv_scale_remark: '',                            // 备注
            },
            rules: {
                sv_scale_name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: ['blur', 'change']
                }],
                sv_scale_ip: [{
                    required: true,
                    message: '请输入IP',
                    trigger: ['blur', 'change']
                }],
                sv_scale_port: [{
                    required: true,
                    message: '请输入端口号',
                    trigger: ['blur', 'change']
                }],
                sv_scale_format: [{
                    required: true,
                    message: '请输入秤编码',
                    trigger: ['blur', 'change']
                }],
                sv_scale_brand: [{
                    required: true,
                    message: '请选择厂商',
                    trigger: ['blur', 'change']
                }],
                sv_scale_type: [{
                    required: true,
                    message: '请选择设备类型',
                    trigger: ['blur', 'change']
                }],
                sv_scale_codeformat: [{
                    required: true,
                    message: '请选择条码格式',
                    trigger: ['blur', 'change']
                }]
            },
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        // formData: {
        //     get() { return this.dataItem; }, set(value) {
        //         this.$emit('update:dataItem', this.dataItem);
        //     }
        // }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.initForm();
                        this.$refs.codeBalanceAdd.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                default:
                    // console.log('key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handlerFormat({ target }) {
            target.value = this.$app.verifyNumber(target.value);
        },
        initForm() {                                          // 初始化表格输入
            if (this.isEdit) {
                this.formData = Object.assign(this.dataItem);
                return
            }
            this.formData = {
                sv_scale_name: '',                              // 名称
                sv_scale_ip: '',                                // IP
                sv_scale_port: '4001',                          // 端口号
                sv_scale_format: '',                            // 秤编码
                sv_scale_brand: '大华',                         // 厂商
                sv_scale_type: '大华TM-30Ab',                   // 设备类型
                sv_scale_codeformat: 'FFWWWWWEEEEEC',           // 条码格式
                sv_scale_remark: '',                            // 备注
            }
        },
        handleEnter() {                                       // 确定事件
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.addOrUpdateScale();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        addOrUpdateScale() {
            stockApi.addOrUpdateScale(this.formData).then(res => {
                this.closeDialog();
                this.$emit('successBack', this.isEdit);
            })
        }
    }
};