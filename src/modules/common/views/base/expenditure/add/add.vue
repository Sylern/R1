<!-- 支出录入 -->
<template>
    <div class="expendAdd">
        <div class="menuWrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="支出录入" name="/expendAdd"></el-tab-pane>
                <el-tab-pane label="支出明细" name="/expendList"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="contentWrap" v-if="JurisdictionObj.ExpAdd&&JurisdictionObj.ExpAnalysis">
            <div class="left">
                <div class="topSelect">
                    <div class="selectWrap">
                        <el-select v-model="categorySelected" @change="changeCategory">
                            <el-option :label="item.label" :value="item" v-for="(item,index) in category" :key="index"></el-option>
                        </el-select>
                    </div>
                    <div class="btn" @click="handleCategorySetting">
                        <i class="el-icon-edit-outline"></i>
                        <span>分类设置</span>
                    </div>
                </div>
                <div class="listWrap" v-if="category.length > 0">
                    <div class="listAdd" @click="secondVisible = true">
                        <div class="icon">+</div>
                        <div class="text">添加分类</div>
                    </div>
                    <div class="listItem" :class="{'isSelected': item.isSelected}" v-for="(item, index) in categorySelected.list" :key="index" @click="handleSecondItem(index)">
                        <div class="iconWrap">
                            <i class="icon el-icon-success"></i>
                            <i class="icon el-icon-star-off"></i>
                        </div>
                        <div class="text">{{item.label}}</div>
                    </div>
                </div>
                <div class="containar">
                    <div class="line">
                        <el-input placeholder="请输入金额" v-model="submitData.inputMoney" @keyup.native="handleInputMoney">
                            <template slot="prepend">
                                <div class="key">
                                    <span>总支出</span>
                                    <div class="flag">RMB</div>
                                </div>
                            </template>
                        </el-input>
                    </div>
                    <div class="line date">
                        <!-- <el-input placeholder="请输入金额">
                            <template slot="prepend">
                                <span>日期</span>
                            </template>
                        </el-input> -->
                        <div class="dateTitle">日期</div>
                        <el-date-picker v-model="submitData.dateTime" type="datetime" clear-icon="time" placeholder="选择日期时间" align="right" :picker-options="pickerOptions">
                            <template slot="prepend">
                                <span>日期</span>
                            </template>
                        </el-date-picker>
                    </div>
                    <div class="line">
                        <el-input placeholder="输入最多50字" maxlength="50" v-model="submitData.remark">
                            <template slot="prepend">
                                <span>备注</span>
                            </template>
                        </el-input>
                    </div>
                    <div class="line img_wrap">
                        <div class="line_label">图片(最多上传三张图片)</div>
                        <ImportImg :dataJson="$app.isNull(submitData.imgList)?[]:submitData.imgList" @callback="callbackImportImg" :verifyJson="verifyJson" :typeEntity="typeEntity" class="img"></ImportImg>
                    </div>
                    <div class="btnSure" @click="addExpenditure">
                        <span>确定</span>
                    </div>
                </div>
            </div>
            <div class="center">
                <div class="menuDate">
                    <div class="content">
                        <div class="item" :class="{'isSelected': index === dateMenuPos}" v-for="(item, index) in dateList" :key="index" @click="handleDateChange(index)">
                            <span>{{item.text}}</span>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="dataExpend" ref="dataExpend"></div>
                    <div class="data_null_img" v-if="dataEcharts.length < 1">
                        <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                        <span>暂无数据</span>
                    </div>
                </div>
                <div class="textWrap" v-if="dataEcharts.length > 0">
                    <div class="title">
                        <span>支出排名前10</span>
                    </div>
                    <div class="listWrap">
                        <div class="item" v-for="(item, index) in dataEcharts" :key="index">
                            <div class="name">
                                <span class="dot" :style="{backgroundColor: color[index]}"></span>
                                <span>{{item.name}}</span>
                            </div>
                            <div class="percent">{{$app.moneyFixed(parseFloat(item.value)*100/totalMoney,2)+'%'}}</div>
                            <div class="price">{{item.value}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="title">
                    <span>支出记录（近期5笔）</span>
                </div>
                <div class="listWrap">
                    <div class="item" v-for="(item, index) in expenditureList" :key="index">
                        <div class="main">
                            <div class="itemLeft">
                                <div class="icon">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div class="secondText">{{item.e_expenditureclassname}}</div>
                            </div>
                            <div class="price">
                                <span>¥ {{item.e_expenditure_money}}</span>
                            </div>
                        </div>
                        <div class="other">
                            <div class="cateGory">
                                <span>{{item.categroyText}}</span>
                            </div>
                            <div class="time">
                                <span>{{item.e_expendituredate}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 分类设置 -->
        <el-dialog class="categoryDialog" :close-on-click-modal="false" title="分类设置" width="700px" :visible.sync="categoryPopVisiable">
            <div class="content">
                <div class="left">
                    <div class="titleText">大分类</div>
                    <div class="btnAdd" @click="handleFirstAdd">+</div>
                    <div class="listWrap">
                        <el-scrollbar style="width:100%;height:100%;">
                            <div class="listItem" :class="{'isSelected': popFirstSelected.index === index}" v-for="(item, index) in category" :key="index" @click="handleCategoryPopItem(item)">
                                <div class="itemName">
                                    <span class="flag"></span>
                                    <span class="nameText">{{item.label}}</span>
                                </div>
                                <div class="iconBtn">
                                    <i class="el-icon-edit-outline" @click.stop="handelUpdateFirst(item)"></i>
                                    <i class="el-icon-delete" @click.stop="deleteCategory(item,false)"></i>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="right">
                    <div class="titleText">小分类</div>
                    <div class="btnAdd" @click="secondVisible = true">+</div>
                    <div class="listWrap" v-if="!$app.isNull(popFirstSelected)">
                        <el-scrollbar style="width:100%;height:100%;">
                            <div class="listItem" v-for="(item, index) in popFirstSelected.list" :key="index">
                                <div class="itemName">
                                    <span class="flag"></span>
                                    <span class="nameText">{{item.label}}</span>
                                </div>
                                <div class="iconBtn">
                                    <i class="el-icon-edit-outline" @click.stop="handelUpdateSecond(item)"></i>
                                    <i class="el-icon-delete" @click.stop="deleteCategory(item,true)"></i>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="btnWrap">
                <div class="btnItem btnPrimary" @click="categoryPopVisiable = false">确定</div>
                <div class="btnItem btnPrimary disable" @click="categoryPopVisiable = false">取消</div>
            </div>
        </el-dialog>

        <!-- 添加一级分类弹窗 -->
        <el-dialog class="firstDialog" title="添加大分类" width="400px" :close-on-click-modal="false" :visible.sync="firstVisible">
            <div class="content">
                <el-input placeholder="输入分类名称" v-model="categoryInput"></el-input>
            </div>
            <div class="btnWrap">
                <div class="btnItem btnPrimary small" @click="addCategory()">确定</div>
                <div class="btnItem btnPrimary small disable" @click="firstVisible = false">取消</div>
            </div>
        </el-dialog>

        <!-- 添加二级分类弹窗 -->
        <el-dialog class="secondDialog" title="添加小分类" width="400px" :close-on-click-modal="false" :visible.sync="secondVisible">
            <div class="content" v-if="secondVisible">
                <div class="text">
                    <span>所属大分类 : {{categoryPopVisiable ? popFirstSelected.label: categorySelected.label}}</span>
                </div>
                <div class="inputBox">
                    <el-input placeholder="输入分类名称" v-model="categoryInput"></el-input>
                </div>
            </div>
            <div class="btnWrap">
                <div class="btnItem btnPrimary small" @click="addCategory(categoryPopVisiable ? popFirstSelected.value: categorySelected.value)">确定</div>
                <div class="btnItem btnPrimary small disable" @click="secondVisible = false">取消</div>
            </div>
        </el-dialog>

        <!-- 修改分类弹窗 -->
        <el-dialog class="secondDialog" title="修改分类" width="400px" :close-on-click-modal="false" :visible.sync="updateVisible">
            <div class="content">
                <div class="text" v-if="waitingUpdate.isSecond">
                    <span>所属大分类 : {{waitingUpdate.label}}</span>
                </div>
                <el-input placeholder="输入分类名称" clearable v-model="categoryInput"></el-input>
            </div>
            <div class="btnWrap">
                <div class="btnItem btnPrimary small" @click="submitUpdate">确定</div>
                <div class="btnItem btnPrimary small disable" @click="updateVisible = false">取消</div>
            </div>
        </el-dialog>
    </div>
</template>

<style  lang="sass" scoped>
@import "./add.scss"
</style>
<script src="./add.js"></script>