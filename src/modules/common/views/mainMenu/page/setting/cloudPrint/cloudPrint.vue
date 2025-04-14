<template>
    <div class="cloudPrint">
        <el-scrollbar class="print_content">
            <div class="listWrap">
                <div class="item add" @click="handleAdd">
                    <span>+新增打印机</span>
                </div>
                <div class="item" :class="{'isRowFirst': (index+1)%6 === 0}" v-for="(item,index) in tabelJson" :key="index">
                    <div class="container">
                        <div class="itemName">
                            <span>{{item.name}}</span>
                            <el-popover ref="cpt_popver" popper-class="cloudPrint_popper" placement="bottom" trigger="click">
                                <div class="popBtnList">
                                    <div class="btnItem" @click.stop="handleEdit(item)">
                                        <i class="el-icon-edit-outline"></i>
                                        <span>编辑</span>
                                    </div>
                                    <div class="btnItem" @click.stop="handleDelete(item)">
                                        <i class="el-icon-error"></i>
                                        <span>删除</span>
                                    </div>
                                </div>
                                <cmd-icon slot="reference" type="icon-tubiao13" color="#666666" size="20"></cmd-icon>
                            </el-popover>
                        </div>
                        <div class="itemRow">
                            <div class="key">终端号</div>
                            <div class="value">{{item.sn}}</div>
                        </div>
                        <div class="itemRow">
                            <div class="key">设备类型</div>
                            <div class="value">{{item.typeName}}</div>
                        </div>
                        <div class="itemRow">
                            <div class="key">设备门店</div>
                            <div class="value">{{item.belong_user_name}}</div>
                        </div>
                        <div class="itemRow">
                            <div class="key">更新日期</div>
                            <div class="value">{{item.modify_time}}</div>
                        </div>
                        <div class="handleWrap">
                            <div class="left">
                                <span @click="handleFoodSetting(item)" v-if="item.type==='1'" class="btnText">关联菜品</span>
                            </div>
                            <div class="right">
                                <span class="btnText ml-10" @click.stop="handlePrint(item)">测打</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>

        <!-- 新增编辑打印机 -->
        <dc-dialog v-if="isAddEdit" width="6.5" height="6.25" :title="isEdit ? '编辑云打印机': '新增云打印机'" @close="isAddEdit=false">
            <div class="printAddWrap">
                <div class="contentWrap">
                    <div class="inputWrap">
                        <el-form :model="entityObj" :rules="rulesEntityObj" ref="form">
                            <el-form-item prop="name" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">打印机名称</div>
                                    <el-input v-model.trim="entityObj.name" placeholder="请输入打印机名称"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item v-if="!isEdit" prop="sn" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">终端号</div>
                                    <el-input v-model.trim="entityObj.sn" placeholder="请输入终端号"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item prop="belong_userid" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">设备门店</div>
                                    <el-select v-model.trim="entityObj.belong_userid" placeholder="请选择设备门店">
                                        <el-option v-for="item in storeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item prop="brand" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">设备品牌</div>
                                    <el-select v-model.trim="entityObj.brand" placeholder="请选择设备品牌">
                                        <el-option v-for="item in brandData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item prop="type" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">设备类型</div>
                                    <el-select v-model.trim="entityObj.type" @change="e=>getPrintList(e)" placeholder="请选择设备类型">
                                        <el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item prop="state" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">是否启用</div>
                                    <el-switch v-model="entityObj.state"></el-switch>
                                </div>
                            </el-form-item>
                            <el-form-item v-if="!isEdit" prop="print_key" class="lineBox">
                                <div class="inputBox">
                                    <div class="key">key</div>
                                    <el-input v-model.trim="entityObj.print_key" placeholder="请输入key"></el-input>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="!$app.isNull(entityObj.type)" class="switchWrap">
                        <div class="switchTitle">请选择对应打印的票据类型</div>
                        <el-scrollbar class="el_scroll">
                            <div class="switchItem" v-for="(item, index) in PrintList" :key="index">
                                <span class="key">{{item.name}}</span>
                                <el-switch v-model="item.state"></el-switch>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>

                <div class="btnWrap">
                    <div class="btnSure" @click="handleSubmit">确定</div>
                </div>
            </div>
        </dc-dialog>

        <checkedCommodity :visible.sync="isCheckedCommodity" title="关联菜品" :dataJson="checkedCommodity" @callback="callbackCommodity" :importPageSize="1000" :queryEntity="queryEntity"></checkedCommodity>
    </div>
</template>

<style lang="scss" scope>
@import './cloudPrint.scss';
</style>
<script src="./cloudPrint.js"></script>