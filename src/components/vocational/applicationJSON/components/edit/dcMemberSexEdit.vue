<template>
    <div class="component-edit dcMemberSexEdit">
        <h4>{{ title }}</h4>
        <div class="item">
            <div class="label">文本标题：</div>
            <div class="content"><el-input placeholder="请输入文本标题" :value="label" @input="handleChange($event,'label')" maxlength="12"></el-input></div>
        </div>
        <div class="item">
            <div class="label">提示语：</div>
            <div class="content"><el-input placeholder="请输入提示语" :value="placeholder" @input="handleChange($event,'placeholder')" maxlength="12"></el-input></div>
        </div>
        <div class="item">
            <div class="label">是否必填：</div>
            <div class="content">
                <el-radio-group v-removeAria :value="required" @input="handleChange($event,'required')">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item">
            <div class="label">默认值：</div>
            <div class="content">
                <el-select v-model="value" placeholder="请选择" @change="handleChange($event, 'value')">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
    </div>
</template>

<script>
import config, { ID_MEMBER_SEX } from "../config"
export default {
    mixins: [config[ID_MEMBER_SEX].props],
    data() {
        return {
            options: [
                {
                    value:'',
                    label:'无'
                },
                {
                value: 1,
                label: '男'
            }, {
                value: 0,
                label: '女'
            }]
        }
    },
    computed: {
        title() {
            return config[ID_MEMBER_SEX].name
        }
    },
    methods: {
        handleChange(val, pro) {
            this.$emit("change", { pro, val })
        }
    }
}</script>

<style lang="scss" scoped>
@import './common.scss';
</style>