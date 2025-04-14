<template>
    <div class="component-edit dcDateEdit">
        <h4>{{ title }}</h4>
        <div class="item">
            <div class="label">文本标题：</div>
            <div class="content"><el-input placeholder="请输入文本标题" :value="label" @input="handleChange($event, 'label')"
                    maxlength="12"></el-input></div>
        </div>
        <div class="item">
            <div class="label">提示语：</div>
            <div class="content"><el-input placeholder="请输入提示语" :value="placeholder"
                    @input="handleChange($event, 'placeholder')" maxlength="12"></el-input></div>
        </div>
        <div class="item">
            <div class="label">是否必填：</div>
            <div class="content">
                <el-radio-group v-removeAria :value="required" @input="handleChange($event, 'required')">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item">
            <div class="label">默认值：</div>
            <div class="content">
                <el-radio-group v-removeAria :value="today" @input="handleChange($event, 'today')">
                    <el-radio :label="true">当天日期</el-radio>
                    <el-tooltip class="item" effect="dark" content="指定日期选择范围，配置范围后，客户端提交数据时只能在此范围内选择一个日期" placement="top">
                        <el-radio :label="false">指定日期<i class="el-icon-question" style="margin-left:2px"></i></el-radio>
                    </el-tooltip>
                </el-radio-group>
            </div>
        </div>
        <div class="item" v-show="!today">
            <div class="label"></div>
            <div class="content">
                <el-form :rules="rules" ref="form">
                    <el-form-item prop="start">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="currentVal" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" @change="handleChange($event, 'value')">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import config, { ID_DATE } from "../config"
export default {
    mixins: [config[ID_DATE].props],
    data() {
        return {
            rules: {
                start: [{
                    validator: (rule, value, callback) => {
                        if (!this.today && !this.start) { callback(new Error("请选择指定日期")) } else { callback() }
                    }, trigger: 'change'
                }]
            },
            currentVal: []
        }
    },
    computed: {
        title() {
            return config[ID_DATE].name
        },
    },
    watch: {
        start: {
            handler(val) {
                if (val && this.end) {
                    this.currentVal = [val, this.end]
                    if (this.value) {
                        this.$emit("change", { pro: 'value', val: "" })
                    }
                } else {
                    this.currentVal = []
                }
            },
            immediate: true
        },
        end: {
            handler(val) {
                if (val && this.start) {
                    this.currentVal = [this.start, val]
                    if (this.value) {
                        this.$emit("change", { pro: 'value', val: "" })
                    }
                } else {
                    this.currentVal = []
                }
            },
            immediate: true
        }
    },
    methods: {
        handleChange(val, pro) {
            if (pro === 'value') {
                const [start, end] = val || []
                this.$emit("change", { pro: 'start', val: start || '' })
                this.$emit("change", { pro: 'end', val: end || '' })
            } else {
                this.$emit("change", { pro, val })
                if (pro === 'today') {
                    this.$emit("change", { pro: 'start', val: "" })
                    this.$emit("change", { pro: 'end', val: "" })
                }
            }
        },
        validate() {
            this.$refs.form.validateField('start')
        },
    }
}
</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>