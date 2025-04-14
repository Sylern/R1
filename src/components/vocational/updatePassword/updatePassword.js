import { stockApi } from "@/api/index.js";
export default {
    props: {
        visible: { type: Boolean, default: true },
    },
    data() {
        return {
            entityPwd: {                        // 修改密码实体
                orgpwd: '',                         // 原密码
                newpwd: '',                         // 新密码
                newpwdTow: ''                       // 确认密码
            },
            entityRulesPwd: {                   // 验证规则
                orgpwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                newpwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                newpwdTow: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    {
                        trigger: 'blur', validator: (rule, value, callback) => {
                            if (value !== this.entityPwd.newpwd) callback(new Error('两次输入密码不一致!')); else callback();
                        }
                    }
                ],
            },
        }
    },
    computed: {
        dialogVisible: {
            get() {
                if (this.visible) this.entityPwd = { orgpwd: '', newpwd: '', newpwdTow: '' };
                return this.visible;
            }, set(value) { this.$emit('update:visible', value); }
        },
    },
    methods: {
        //#region 修改密码事件

        verifyLetterNumber(type) {                              // 只能输入数字和字母
            if (type === 'orgpwd') this.entityPwd.orgpwd = this.$app.verifyLetterNumber(this.entityPwd.orgpwd);
            if (type === 'newpwd') this.entityPwd.newpwd = this.$app.verifyLetterNumber(this.entityPwd.newpwd);
            if (type === 'newpwdTow') this.entityPwd.newpwdTow = this.$app.verifyLetterNumber(this.entityPwd.newpwdTow);
        },
        handleSubmitPwd() {                                     // 确定修改密码
            this.$refs['formPwd'].validate((valid) => {
                if (valid) {
                    let { orgpwd, newpwd } = this.entityPwd;
                    stockApi.UpdateAcountnoPwd({ org_obj: orgpwd, new_obj: newpwd }).then(res => {
                        if (res === null) {
                            this.$message({ message: '修改密码成功', type: 'success' });
                            this.dialogVisible = false;
                        }
                    });
                }
            });
        },

        //#endregion

    }
}
