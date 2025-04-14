<!--设置多工位服务人员-->
<template>
    <div class="servicerWorkstation" v-if="dialogVisible">
        <dc-dialog width="1000" height="650" title="设置服务人员" @close="closeDialog">
            <div class="contentWrap">
                <div class="subTitle">
                    <span class="tips">同工位业绩平分；多工位业绩独享</span>
                </div>
                <div class="contentListWrap">
                    <div class="workstationWrap">
                        <div class="listHeader">
                            <div class="td1">第一工位</div>
                            <div class="td2">占比</div>
                            <div class="td3" @click="handleEditSwitch(0)">
                                <span>业绩</span>
                                <i class="el-icon-edit"></i>
                            </div>
                        </div>
                        <el-scrollbar ref="workScroll1" class="workstationList">
                            <div class="listWrap">
                                <div class="listItem" v-for="(item, index) in workstationEmployeeList[0]" :key="index" @click.stop="handleEmployeeItem(item, 0)">
                                    <div class="selectedWrap" :class="item.selectedType" v-if="item.isSelected" @click.stop="">
                                        <div class="isLocked" v-if="item.isLocked">
                                            <cmd-icon type="icon-gougou" size="16" color="#999"></cmd-icon>
                                        </div>
                                        <div class="wrap" @click.stop="handleEmployeeIndex($event, item, 0)"></div>
                                        <div class="index">
                                            <div class="line" :style="{ width: item.percent > 0 ? item.percent + '%' : '3px' }"></div>
                                            <el-slider v-model="item.percent" :show-tooltip="false" @change="handleSliderChange(item, 0)"></el-slider>
                                        </div>
                                        <div class="delete" @click="handleDeleteSelected(item, 0)">
                                            <div class="deleteBtn">
                                                <i class="el-icon-close"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="td1">
                                        <div>
                                            <span>{{item.sv_employee_name}}</span>
                                            <span class="appoint" v-if="item.isAppoint">指定</span>
                                        </div>
                                        <div>工号：{{item.sv_employee_number}}</div>
                                    </div>
                                    <div class="td2" v-if="!workstationEdit.type1">
                                        <span v-if="item.isSelected">{{ item.percent }}%</span>
                                    </div>
                                    <div class="td2" v-else @click.stop="">
                                        <el-input v-if="item.isSelected" v-model="item.percent" @focus="$event.currentTarget.select()" @input="handlePercentInput($event, item, 0)"></el-input>
                                    </div>
                                    <div class="td3" v-if="!workstationEdit.type1">
                                        <span v-if="item.isSelected">{{ item.percentValue }}</span>
                                    </div>
                                    <div class="td3" v-else @click.stop="">
                                        <el-input v-if="item.isSelected" v-model="item.percentValue" @focus="$event.currentTarget.select()" @input="handlePercentValueChange($event, item, 0)"></el-input>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="workstationWrap">
                        <div class="listHeader">
                            <div class="td1">第二工位</div>
                            <div class="td2">占比</div>
                            <div class="td3" @click="handleEditSwitch(1)">
                                <span>业绩</span>
                                <i class="el-icon-edit"></i>
                            </div>
                        </div>
                        <el-scrollbar ref="workScroll2" class="workstationList">
                            <div class="listWrap">
                                <div class="listItem" v-for="(item, index) in workstationEmployeeList[1]" :key="index" @click.stop="handleEmployeeItem(item, 1)">
                                    <div class="selectedWrap" :class="item.selectedType" v-if="item.isSelected" @click.stop="">
                                        <div class="isLocked" v-if="item.isLocked">
                                            <cmd-icon type="icon-gougou" size="16" color="#999"></cmd-icon>
                                        </div>
                                        <div class="wrap" @click.stop="handleEmployeeIndex($event, item, 1)"></div>
                                        <div class="index">
                                            <div class="line" :style="{ width: item.percent > 0 ? item.percent + '%' : '3px' }"></div>
                                            <el-slider v-model="item.percent" :show-tooltip="false" @change="handleSliderChange(item, 1)"></el-slider>
                                        </div>
                                        <div class="delete" @click="handleDeleteSelected(item, 1)">
                                            <div class="deleteBtn">
                                                <i class="el-icon-close"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="td1">
                                        <div>{{item.sv_employee_name}}</div>
                                        <div>工号：{{item.sv_employee_number}}</div>
                                    </div>
                                    <div class="td2" v-if="!workstationEdit.type2">
                                        <span v-if="item.isSelected">{{ item.percent }}%</span>
                                    </div>
                                    <div class="td2" v-else @click.stop="">
                                        <el-input v-if="item.isSelected" v-model="item.percent" @focus="$event.currentTarget.select()" @input="handlePercentInput($event, item, 1)"></el-input>
                                    </div>
                                    <div class="td3" v-if="!workstationEdit.type2">
                                        <span v-if="item.isSelected">{{ item.percentValue }}</span>
                                    </div>
                                    <div class="td3" v-else @click.stop="">
                                        <el-input v-if="item.isSelected" v-model="item.percentValue" @focus="$event.currentTarget.select()" @input="handlePercentValueChange($event, item, 0)"></el-input>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="workstationWrap">
                        <div class="listHeader">
                            <div class="td1">第三工位</div>
                            <div class="td2">占比</div>
                            <div class="td3" @click="handleEditSwitch(2)">
                                <span>业绩</span>
                                <i class="el-icon-edit"></i>
                            </div>
                        </div>
                        <el-scrollbar ref="workScroll3" class="workstationList">
                            <div class="listWrap">
                                <div class="listItem" v-for="(item, index) in workstationEmployeeList[2]" :key="index" @click.stop="handleEmployeeItem(item, 2)">
                                    <div class="selectedWrap" :class="item.selectedType" v-if="item.isSelected" @click.stop="">
                                        <div class="isLocked" v-if="item.isLocked">
                                            <cmd-icon type="icon-gougou" size="16" color="#999"></cmd-icon>
                                        </div>
                                        <div class="wrap" @click.stop="handleEmployeeIndex($event, item, 2)"></div>
                                        <div class="index">
                                            <div class="line" :style="{ width: item.percent > 0 ? item.percent + '%' : '3px' }"></div>
                                            <el-slider v-model="item.percent" :show-tooltip="false" @change="handleSliderChange(item, 2)"></el-slider>
                                        </div>
                                        <div class="delete" @click="handleDeleteSelected(item, 2)">
                                            <div class="deleteBtn">
                                                <i class="el-icon-close"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="td1">
                                        <div>{{item.sv_employee_name}}</div>
                                        <div>工号：{{item.sv_employee_number}}</div>
                                    </div>
                                    <div class="td2" v-if="!workstationEdit.type3">
                                        <span v-if="item.isSelected">{{ item.percent }}%</span>
                                    </div>
                                    <div class="td2" v-else @click.stop="">
                                        <el-input v-if="item.isSelected" v-model="item.percent" @focus="$event.currentTarget.select()" @input="handlePercentInput($event, item, 2)"></el-input>
                                    </div>
                                    <div class="td3" v-if="!workstationEdit.type3">
                                        <span v-if="item.isSelected">{{ item.percentValue }}</span>
                                    </div>
                                    <div class="td3" v-else @click.stop="">
                                        <el-input v-if="item.isSelected" v-model="item.percentValue" @focus="$event.currentTarget.select()" @input="handlePercentValueChange($event, item, 2)"></el-input>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="btnWrap">
                <div class="iconWrap" @click.stop="handleClear">
                    <i class="el-icon-delete"></i>
                    <span class="text">清空</span>
                </div>
                <div class="btnSure" @click="handleSure">确定</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './servicerWorkstation.scss';
</style>
<script src="./servicerWorkstation.js"></script>