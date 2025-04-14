import base from '@/api/base';
import { mapMutations, mapState } from 'vuex';
import { ImportImg, ImgPopover } from "@/components/index";
import { basicApi } from "@/api/index.js";
export default {
    name: 'customDiscount',
    components: { ImportImg, ImgPopover },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imgBase: base.imgUrl,
            frontImgBase: base.frontImgBase,
            isLoading: false,
            feedback_message_id: 0,                 // 消息id
            queryData: {
                sv_source_type: 100,                    // 请求类型    PC网页=100
                Page: 1,
                PageSize: 10,
                distributor_id: 1,                      // 商户所属代理商 1表示德客
                start_date: '',
                end_date: ''
            },
            hasMoreData: false,
            feedbackDataList: [],
            feedbackText: '',
            feedbackImgList: [],
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'feedback', isCompress: true } },
            verifyJson: { fileNumber: 5, photoExt: ['.jpg', '.png'], fileSize: 1024, viewElement: 'click' },       // 上传图片组件的验证条件
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$root.$on('feedbackMessage', this.getMessage_Record_List)
                    this.queryData.Page = 1;
                    this.feedbackDataList = [];
                    this.getMessage_Record_List();
                }else {
                    this.$root.$off('feedbackMessage', this.getMessage_Record_List)
                }
            }
        }
    },
    methods: {
        ...mapMutations(['update']),
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
        },
        callbackImportImg(val) {                                    // 上传图片组件回调函数
            this.feedbackImgList = val;
        },
        handleGetMore() {
            if (this.isLoading) return;
            this.queryData.Page++;
            this.getMessage_Record_List('getMore');
        },
        getMessage_Record_List(type = 'init') {
            this.isLoading = true;
            if (type === 'init') this.queryData.Page = 1;
            basicApi.getMessage_Record_List(this.queryData).then(res => {
                this.update({
                    key: 'feedbackCount',
                    data: 0
                })
                this.isLoading = false;
                if (res) {
                    this.feedback_message_id = this.$app.isNull(res.values) ? 0 : res.values;
                    let dataList = this.$app.isNull(res.list) ? [] : res.list.reverse();
                    if (type === 'init') this.feedbackDataList = [];
                    this.feedbackDataList = dataList.concat(this.feedbackDataList);
                    this.hasMoreData = this.feedbackDataList.length < res.total;
                    let oldHeight = type === 'getMore' ? this.$refs.scrollContent.wrap.scrollHeight : 0;
                    let newHeight = 0;
                    this.$nextTick(() => {
                        if (!!this.$refs.scrollContent) {
                            newHeight = this.$refs.scrollContent.wrap.scrollHeight;
                            let wrapHeight = type === 'getMore' ? 100 : 0;
                            this.$refs.scrollContent.wrap.scrollTop = newHeight - oldHeight - wrapHeight;
                            this.$refs.scrollContent.update();
                        }
                    })
                }
            });
        },
        updateBack_Message_Recor(item, argus, type) {
            if (argus === 1 && item.title.sv_system_msg.type1 !== 0) return;
            if (argus === 2 && item.title.sv_system_msg.type2 !== 0) return;
            basicApi.updateBack_Message_Recor({ id: item.sv_record_id, type: type }).then(res => {
                item.title.sv_system_msg['type' + argus] = type;
                this.$message.success('已提交');
            });
        },
        handleFeedbackSubmit() {                                    // 提交反馈
            if (this.$app.isNull(this.feedbackText)) return this.$message.warning('请输入反馈内容');
            let query = {
                title: {
                    sv_ordinary_msg: {
                        text: this.feedbackText,
                        img: this.feedbackImgList
                    }
                },
                sv_source_type: 100,
                sv_feedback_message_id: this.feedback_message_id
            }
            basicApi.addFeedBack_Message(query).then(res => {
                if (res) this.feedback_message_id = res;            // 新增则会返回聊天id
                this.feedbackText = '';
                this.feedbackImgList = [];
                this.$message.success('已提交');
                this.getMessage_Record_List();
            });
        },

        handlePrevent(e) {                                          // 输入框事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleEnter();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
    }
};