import Edit from 'wangeditor';
import { editorConfig } from "@/utils/config/config.js";
import { basicApi } from '@/api/index';
export default {
    data() {
        return {
            checkAll: '',
            editor: '',
            queryData: {                        // 获取当前账号的所有消息
                typeId: 5,                          // 消息类型主键Id(业务消息[1,3,4],系统消息2,更新日志5)
                receiverTypes: '',                  // 消息接收者类别(云后台:Web 安卓大屏:AndroidPad 安卓移动端:AndroidPhone  IOSAPP:IosPhone IOSPAD:IosPad)
                pageIndex: 1,                       // 页码
                pageSize: 10                        // 页数
            },
            total: 0,                           // 总数
            listJson: [],                       // 列表数
            entityObj: {                        // 提交消息主体
                sv_message_id: '',                  // 主键Id
                sv_type_id: '',                     // 消息类型主键Id (业务消息1，3，4 系统消息 2 ，更新日志 5)
                sv_message_content: '',             // 消息内容
                sv_message_title: '',               // 消息标题
                sv_receiver_types: [],              // 消息接收者类别(云后台:Web 安卓大屏:AndroidPad 安卓移动端:AndroidPhone  IOSAPP:IosPhone IOSPAD:IosPad)
            },
            entityRules: {
                sv_type_id: [{ required: true, message: '请选择消息类型', trigger: 'blur' }],
                sv_receiver_types: [{ required: true, message: '请选择发布对象', trigger: 'blur' }],
                sv_message_title: [{ required: true, message: '请输入消息标题', trigger: 'blur' }]
            }
        }
    },
    watch: {},
    mounted() {
        this.$nextTick(() => {
            this.editor = new Edit('#editor');
            this.editor.config.menus = editorConfig.menus;
            this.editor.config.uploadImgShowBase64 = true
            this.editor.create();
        });
        this.getMessageBoxInfo();
    },
    methods: {
        handleSubmit() {                                        // 发布
            let html = this.editor.txt.html();
            let dataJson = {
                sv_message_id: this.entityObj.sv_message_id,
                sv_type_id: this.entityObj.sv_type_id,
                sv_message_content: html,
                sv_message_title: this.entityObj.sv_message_title,
                sv_receiver_types: this.entityObj.sv_receiver_types.join(',')
            }

            this.$refs['entityForm'].validate((valid) => {
                if (valid) {
                    if (this.$app.isNull(dataJson.sv_message_id)) {
                        delete dataJson.sv_message_id;
                        basicApi.postInsertToSystemMessageBox(dataJson).then(res => {
                            if (res) { this.$message({ message: '发布成功', type: 'success' }); this.getMessageBoxInfo(); this.handleReset(); }
                        });
                    } else {
                        basicApi.postUpdateSystemMessageBox(dataJson).then(res => {
                            if (res) { this.$message({ message: '发布成功', type: 'success' }); this.getMessageBoxInfo(); this.handleReset(); }
                        });
                    }
                }
            });
        },
        handleReceiverTypes(type) {                             // 选择消息接收类别
            if (this.queryData.receiverTypes === type) return;
            this.queryData.receiverTypes = type;
            this.queryData.pageIndex = 1;
            this.getMessageBoxInfo();
        },
        handleTypeId(type) {                                    // 消息类型主键
            if (this.queryData.typeId === type) return;
            this.queryData.typeId = type;
            this.queryData.pageIndex = 1;
            this.getMessageBoxInfo();
        },
        handleCurrentChange(pageIndex) {                        // 改变页码
            this.queryData.pageIndex = pageIndex;
            this.getMessageBoxInfo();
        },
        handleEdit(id) {                                        // 获取单个详情的信息
            basicApi.getMessageBoxDetailInfo({ messageId: id }).then(res => {
                if (res) {
                    this.entityObj = {
                        sv_message_id: res.sv_message_id, sv_type_id: res.sv_type_id,
                        sv_message_content: res.sv_message_content, sv_message_title: res.sv_message_title,
                        sv_receiver_types: res.sv_receiver_types.split(','),
                    };
                    this.editor.txt.html(res.sv_message_content);
                }
            });
        },
        handleReset() {                                         // 重置
            this.entityObj = {                        // 提交消息主体
                sv_message_id: '',                      // 主键Id
                sv_type_id: '',                         // 消息类型主键Id (业务消息1，3，4 系统消息 2 ，更新日志 5)
                sv_message_content: '',                 // 消息内容
                sv_message_title: '',                   // 消息标题
                sv_receiver_types: [],                  // 消息接收者类别(云后台:Web 安卓大屏:AndroidPad 安卓移动端:AndroidPhone  IOSAPP:IosPhone IOSPAD:IosPad)
            }
            this.editor.txt.html('');
        },
        handleDelete(id) {                                      // 删除
            basicApi.deleteMessageBox({ messageId: id }).then(res => {
                if (res) {
                    this.$message({ message: '删除成功', type: 'success' });
                    this.getMessageBoxInfo();
                }
            });
        },
        getMessageBoxInfo() {                                   // 获取列表
            basicApi.getMessageBoxInfo(this.queryData).then(res => {
                if (res) {
                    this.total = res.total;
                    this.listJson = this.$app.isNull(res.list) ? [] : res.list.map(e => { return { ...e, sv_send_time: this.$app.currentTime(new Date(e.sv_send_time), 'yyyy-MM-dd HH:mm:ss') } });
                }
            });
        }

    }
}
