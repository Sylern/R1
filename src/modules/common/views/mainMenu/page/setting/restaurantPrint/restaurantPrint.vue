<template>
    <div class="restaurantPrint">
        <el-scrollbar class="print_content">
            <el-scrollbar style="width:100%;">
                <div class="listWrap">
                    <div class="item add" @click="addPrint">
                        <span>+新增打印机</span>
                    </div>
                    <div class="item" :class="{'isRowFirst': (index+1)%6 === 0}" v-for="(item,index) in dataList" :key="index">
                        <div class="container">
                            <div class="itemName">
                                <span>{{item.sv_printer_name}}</span>
                                <!-- <cmd-icon type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon> -->
                                <el-popover v-model="item.showPop" placement="bottom" width="100" trigger="manual">
                                    <div class="popBtnList">
                                        <div class="btnItem" @click.stop="editPrint(item)">
                                            <i class="el-icon-edit-outline"></i>
                                            <span>编辑</span>
                                        </div>
                                        <div class="btnItem" @click.stop="deletePrint(item)">
                                            <i class="el-icon-error"></i>
                                            <span>删除</span>
                                        </div>
                                    </div>
                                    <cmd-icon slot="reference" type="icon-tubiao13" color="#666666" size="20" @click="item.showPop = true"></cmd-icon>
                                </el-popover>
                                <!-- <span class="status"></span> -->
                            </div>
                            <div class="itemRow">
                                <div class="key">IP</div>
                                <div class="value">{{item.sv_printer_ip}}</div>
                            </div>
                            <div class="itemRow">
                                <div class="key">端口号</div>
                                <div class="value">{{item.sv_printer_port}}</div>
                            </div>
                            <div class="itemRow">
                                <div class="key">打印机类型</div>
                                <div class="value">{{printTypeText[item.sv_print_type]}}</div>
                            </div>
                            <div class="itemRow">
                                <div class="key">更新日期</div>
                                <div class="value">{{item.sv_modification_date}}</div>
                            </div>
                            <div class="handleWrap">
                                <div class="left" @click.stop="showFoodSetting(item)">
                                    <span class="btnText">关联菜品</span>
                                </div>
                                <div class="right">
                                    <!-- <span class="btnText" @click.stop="editPrint(item)">编辑</span> -->
                                    <span class="btnText ml-10" @click.stop="testPrint(item)">测打</span>
                                    <el-popconfirm title="确定删除吗？" @confirm="deletePrint(item)">
                                        <!-- <span class="btnText ml-10" slot="reference">删除</span> -->
                                    </el-popconfirm>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
            <div class="label_title">标签打印设置</div>
            <el-scrollbar style="width:100%;">
                <div class="listWrap">
                    <div class="item add" @click="addLabelPrint">
                        <span>+新增标签机</span>
                    </div>
                    <div class="item" :class="{'isRowFirst': (index+1)%6 === 0}" v-for="(item,index) in labelDataList" :key="index">
                        <div class="container">
                            <div class="itemName">
                                <span>{{item.sv_printer_name}}</span>
                                <el-popover v-model="item.showPop" placement="bottom" width="100" trigger="manual">
                                    <div class="popBtnList">
                                        <div class="btnItem" @click.stop="editLabelPrint(item)">
                                            <i class="el-icon-edit-outline"></i>
                                            <span>编辑</span>
                                        </div>
                                        <div class="btnItem" @click.stop="deletePrint(item)">
                                            <i class="el-icon-error"></i>
                                            <span>删除</span>
                                        </div>
                                    </div>
                                    <cmd-icon slot="reference" type="icon-tubiao13" color="#666666" size="20" @click="item.showPop = true"></cmd-icon>
                                </el-popover>
                            </div>
                            <div class="itemRow" v-if="item.sv_print_type == 1">
                                <div class="key">IP</div>
                                <div class="value">{{item.sv_printer_ip}}</div>
                            </div>
                            <div class="itemRow" v-if="item.sv_print_type == 0">
                                <div class="key">打印机</div>
                                <div class="value" :title="item.sv_printer_ip">{{item.sv_printer_ip}}</div>
                            </div>
                            <div class="itemRow" v-if="item.sv_print_type == 0">
                                <div class="key">打印份数</div>
                                <div class="value">{{item.sv_print_count}}</div>
                            </div>
                            <div class="itemRow" v-if="item.sv_print_type == 1">
                                <div class="key">端口号</div>
                                <div class="value">{{item.sv_printer_port}}</div>
                            </div>
                            <div class="itemRow">
                                <div class="key">打印机类型</div>
                                <div class="value">{{printTypeText[item.sv_print_type]}}</div>
                            </div>
                            <div class="itemRow">
                                <div class="key">更新日期</div>
                                <div class="value">{{item.sv_modification_date}}</div>
                            </div>
                            <div class="handleWrap">
                                <div class="left" @click.stop="showFoodSetting(item)">
                                    <span class="btnText">关联菜品</span>
                                </div>
                                <div class="right">
                                    <span class="btnText ml-10" @click.stop="testPrintLabel(item)">测打</span>
                                    <el-popconfirm title="确定删除吗？" @confirm="deletePrint(item)">
                                    </el-popconfirm>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </el-scrollbar>

        <!-- 新增编辑打印机 -->
        <dc-dialog v-if="showPrintAddStatus" width="650" height="635" :title="isEdit ? '编辑后厨打印机': '新增后厨打印机'" @close="closeDialog">
            <div class="restaurantPrintAddWrap">
                <div class="contentWrap">
                    <div class="inputWrap">
                        <el-form :model="formData" :rules="rules" ref="form">
                            <el-form-item prop="sv_printer_name" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">方案名称</div>
                                    <el-input ref="cardNumber" v-model.trim="formData.sv_printer_name" placeholder="请输入方案名称"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item prop="manufacturer" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">打印类型</div>
                                    <el-input ref="cardNumber" value="网口" readonly></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_printer_ip" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">IP地址</div>
                                    <el-input v-model.trim="formData.sv_printer_ip" placeholder="请输入IP"></el-input>
                                </div>
                            </el-form-item>

                            <el-form-item prop="sv_printer_port" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">端口号</div>
                                    <el-input v-model.trim="formData.sv_printer_port" placeholder="请输入端口号"></el-input>
                                </div>
                            </el-form-item>

                            <el-form-item prop="sv_labelprint_width" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">打印规格</div>
                                    <el-input ref="cardNumber" value="80mm" readonly></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_is_print_unitprice" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">后厨小计</div>
                                    <el-switch v-model="formData.sv_is_print_unitprice"></el-switch>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_enabled" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">是否启用</div>
                                    <el-switch v-model="formData.sv_enabled"></el-switch>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_remark" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">备注信息</div>
                                    <el-input v-model.trim="formData.sv_remark" placeholder="请输入备注信息"></el-input>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="switchWrap">
                        <div class="switchTitle">请选择需对应打印的票据类型</div>
                        <el-scrollbar class="el_scroll">
                            <div class="switchItem" v-for="(item, index) in addPrintList" :key="index">
                                <span class="key">{{item.name}}</span>
                                <el-switch v-model="item.state"></el-switch>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>

                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>

        <!-- 新增编辑打印机 标签 -->
        <dc-dialog v-if="showLabelAddStatus" width="11" height="6.25" :title="isEdit ? '编辑标签打印机': '新增标签打印机'" @close="closeLabelDialog">
            <div class="printAddWrap">
                <div class="contentWrap">
                    <div class="inputWrap tag_template">
                        <el-form :model="labelFormData" :rules="labelRules" ref="labelForm">
                            <el-form-item prop="sv_printer_name" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">方案名称</div>
                                    <el-input ref="cardNumber" v-model.trim="labelFormData.sv_printer_name" placeholder="请输入方案名称"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_print_type" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">打印类型</div>
                                    <el-select v-model.trim="labelFormData.sv_print_type" @change="handleLabelType" placeholder="请选择打印类型">
                                        <el-option label="驱动" :value="0"></el-option>
                                        <el-option label="网口" :value="1"></el-option>
                                        <!-- <el-option label="蓝牙" :value="2"></el-option> -->
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_printer_ip" class="lineBox" v-if="labelFormData.sv_print_type===0">
                                <div class="inputBox">
                                    <div class="key">打印机</div>
                                    <el-select v-model.trim="labelFormData.sv_printer_ip" placeholder="请选择打印机">
                                        <el-option v-for="item in printDevice" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_printer_ip" class="lineBox" v-if="labelFormData.sv_print_type===1">
                                <div class="inputBox">
                                    <div class="key">IP地址</div>
                                    <el-input v-model.trim="labelFormData.sv_printer_ip" placeholder="请输入IP"></el-input>
                                </div>
                            </el-form-item>

                            <el-form-item prop="sv_printer_port" class="lineBox" v-if="labelFormData.sv_print_type===1">
                                <div class="inputBox">
                                    <div class="key">端口号</div>
                                    <el-input v-model.trim="labelFormData.sv_printer_port" placeholder="请输入端口号"></el-input>
                                </div>
                            </el-form-item>

                            <el-form-item prop="sv_print_count" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">打印份数</div>
                                    <el-input v-model.trim="labelFormData.sv_print_count" @input.native="handleInput"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_enabled" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">是否启用</div>
                                    <el-switch v-model="labelFormData.sv_enabled"></el-switch>
                                </div>
                            </el-form-item>
                            <el-form-item prop="sv_remark" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">备注信息</div>
                                    <el-input v-model.trim="labelFormData.sv_remark" placeholder="请输入备注信息"></el-input>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="switchWrap tag_template">
                        <div class="switchTitle">请选择需对应打印的标签模板</div>
                        <el-scrollbar class="el_scroll">
                            <div class="template_wrap">
                                <div class="template_item" v-for="(item, index) in labelTemplateList" :key="index">
                                    <div class="wrap_head">
                                        <span>{{item.width}}*{{item.height}}mm</span>
                                        <el-switch v-model="item.state" @change="handleChangeState(item)"></el-switch>
                                    </div>
                                    <div class="wrap_body">
                                        <labelTemplate :item="item" name="labelView" />
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>

                <div class="btnWrap">
                    <div class="btnSure" @click="handleLabelEnter">确定</div>
                </div>
            </div>
        </dc-dialog>

        <checkedCommodity :visible.sync="isCheckedCommodity" title="关联菜品" :dataJson="checkedCommodity" @callback="getCheckedCommodity" :importPageSize="1000" :queryEntity="queryEntity"></checkedCommodity>
    </div>
</template>

<style lang="scss" scope>
@import './restaurantPrint.scss';
</style>
<script src="./restaurantPrint.js"></script>