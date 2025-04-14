<!--新增-编辑条码秤-->
<template>
    <div class="codeBalanceAdd" ref="codeBalanceAdd" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="4.2" height="7.3" :title="isEdit ? '编辑条码秤': '新增条码秤'" @close="closeDialog">
            <div class="contentWrap">
                <div class="inputWrap">
                    <el-form :model="formData" :rules="rules" ref="form">
                        <el-form-item prop="name" class="lineBox">
                            <div class="inputBox">
                                <div class="key">名称</div>
                                <el-input ref="cardNumber" v-model.trim="formData.sv_scale_name" placeholder="请输入条码秤名称"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item prop="IP" class="lineBox">
                            <div class="inputBox">
                                <div class="key">IP</div>
                                <el-input v-model.trim="formData.sv_scale_ip" placeholder="请输入IP"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="port" class="lineBox">
                            <div class="inputBox">
                                <div class="key">端口号</div>
                                <el-input v-model.trim="formData.sv_scale_port" disabled placeholder="请输入端口号"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item prop="balanceCode" class="lineBox">
                            <div class="inputBox">
                                <div class="key">秤编码</div>
                                <el-input v-model.trim="formData.sv_scale_format" maxlength="2" @input.native="handlerFormat" placeholder="请输入秤编码(2位正整数)"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="manufacturer" class="lineBox">
                            <div class="inputBox">
                                <div class="key">厂商</div>
                                <el-select v-model.trim="formData.sv_scale_brand" placeholder="请选择厂商">
                                    <el-option label="大华" value="大华"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item prop="balanceType" class="lineBox">
                            <div class="inputBox">
                                <div class="key">设备类型</div>
                                <el-select v-model.trim="formData.sv_scale_type" placeholder="请选择设备类型">
                                    <el-option label="大华TM-30Ab" value="大华TM-30Ab"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item prop="codeType" class="lineBox">
                            <div class="inputBox">
                                <div class="key">条码格式</div>
                                <el-select v-model.trim="formData.sv_scale_codeformat" placeholder="请选择条码格式">
                                    <el-option label="FFWWWWWEEEEEC" value="FFWWWWWEEEEEC"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item prop="remark" class="lineBox">
                            <div class="inputBox">
                                <div class="key">备注</div>
                                <el-input v-model.trim="formData.sv_scale_remark" placeholder="请输入备注"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>
<style  lang="scss" scoped>
@import './codeBalanceAdd.scss';
</style>
<script src="./codeBalanceAdd.js"></script>