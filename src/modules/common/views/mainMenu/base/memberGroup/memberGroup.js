import { stockApi } from "@/api/index.js";
export default {
    name: 'memberGroup',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '导购员选择'
        },
        selectedNumber: {
            type: Number,
            default: 1
        },
        selectedList: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            selectedId: '',
            selectedIds: [],
            queryMembers: {
                // allstore: 0,
                sectkey: '',
                Page: 1,
                PageSize: 999
            },
            listTotalPage: 0,
            memberList: []
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        imgBase() {
            return stockApi.imgBase()
        },
    },
    watch: {
        dialogVisible: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.selectedIds = this.selectedList;
                        this.$refs.memberGroup.focus();
                        this.getMemberList();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handleSearch() {
            this.queryMembers.Page = 1;
            this.getMemberList();
        },
        getMemberList() {
            // if (this.$app.isNull(this.queryMembers.sectkey)) return this.$message.warning('请输入'+ this.$store.getters.memberText +'卡号或手机号')
            stockApi.getMemberList(this.queryMembers).then(res => {
                if (res) {
                    this.memberListStatus = true;
                    if (this.queryMembers.Page === 1) {
                        this.memberList = [];
                    }
                    if (!this.$app.isNull(res.list)) {
                        this.memberList = this.memberList.concat(res.list);
                        this.$nextTick(() => {
                            !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                        })
                    }
                    this.listTotalPage = res.total;
                    if (this.memberList.length === 0) {
                        if (this.$app.isPhoneNumber(this.queryMembers.sectkey)) {
                            this.memberAddTipsStatus = true;
                            return
                        }
                        return this.$message.warning('未查到相关会员')
                    }
                }
            });
        },
        handleMember(item) {
            let index = this.selectedIds.findIndex(e => e.id === item.member_id);
            if (index > -1) return this.selectedIds.splice(index, 1);
            if (this.selectedIds.length === this.selectedNumber) {
                this.selectedIds.splice(0, 1);
                if (this.selectedNumber > 1) this.$message.warning('最多只能选择' + this.selectedNumber + '人')
            }
            this.selectedIds.push({
                id: item.member_id,
                name: item.sv_mr_name
            });
        },
        handleSure() {
            this.$emit('handleBack', this.selectedIds);
            this.closeDialog();
        },
    }
};