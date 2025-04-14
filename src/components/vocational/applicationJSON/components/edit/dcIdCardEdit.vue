<template>
    <div class="component-edit dcIdCard">
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
        <!-- <div class="item">
            <div class="label">默认值：</div>
            <div class="content"><el-input :value="value" placeholder="请输入默认值" @input="handleChange($event,'value')"></el-input></div>
        </div> -->
    </div>
</template>

<script>
import config,{ID_IDCARD} from "../config"
export default{
    mixins: [config[ID_IDCARD].props],
    computed: {
        title(){
            return config[ID_IDCARD].name
        }
    },
    methods:{
        handleChange(val,pro){
            this.$emit("change",{pro, val})
        }
    }
}</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>