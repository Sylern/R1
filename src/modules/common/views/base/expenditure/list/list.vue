<!-- 支出明细 -->
<template>
    <div class="expendList">
        <div class="menuWrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="支出录入" name="/expendAdd"></el-tab-pane>
                <el-tab-pane label="支出明细" name="/expendList"></el-tab-pane>
            </el-tabs>
        </div>
         <div class="contentWrap" v-if="JurisdictionObj.ExpAdd&&JurisdictionObj.ExpInfo">
            <div class="selectWrap">
                <div class="main">
                    <div class="item">
                        <div class="key">选择门店：</div>
                        <div class="select">
                           <el-select v-model="query.user_id" filterable placeholder="请选择">
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="key">选择分类：</div>
                        <div class="select">
                            <el-select v-model="query.EcategoryId" placeholder="请选择">
                                <el-option label="全部" value="-1"></el-option>
                                <el-option v-for="item in category" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                            <el-select v-model="query.second_category_id" placeholder="请选择" style="margin-left:20px">
                                <el-option v-for="item in secondCategoryJson" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="key">选择日期：</div>
                        <date-time-picker :paramData="paramData" allSelect @change="handleChangeTime"></date-time-picker>
                    </div>
                </div>
            </div>
            <div class="tableWrap">
                <div class="btnWrap">
                    <div class="btnItem btnPrimary" @click="handleExport">导出报表</div>
                </div>
                <div class="tableBox SheetTable">
                    <myTable ref="myTable" rowKey="id" :data="dataJson">
                        <my-table-cell label="序号" prop="序号" width="80" align="center">
                            <template v-slot:default="scope">
                                <span>{{(query.PageIndex-1)*query.PageSize+ scope.index+1}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="支出分类" prop="e_expenditurename"></my-table-cell>
                        <my-table-cell label="支出金额" prop="e_expenditure_money" align="center">
                            <template v-slot:default="scope">
                                <span>¥{{$app.moneyFixed(scope.e_expenditure_money,2)}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="操作时间" prop="e_expendituredate" align="center"></my-table-cell>
                        <my-table-cell label="图片" prop="e_expenditurepic" align="center">
                            <template v-slot:default="row">
                                <div class="img_cell" @click.stop="()=>{return false}">
                                    <ImgPopover v-for="item in row.e_expenditurepic" :key="item" :src="item" class="img_wrap" />
                                </div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="支出人员" prop="e_expenditure_operation" align="center"></my-table-cell>
                        <my-table-cell label="备注说明" prop="e_expenditure_node" showTooltip></my-table-cell>
                        <my-table-cell label="操作" prop="handle" width="180" align="center">
                            <template v-slot:default="scope">
                                <el-button type="text" size="small" @click="updateRow(scope.index)">修改</el-button>
                                <el-button type="text" size="small" @click="deleteRow(scope.index)">删除</el-button>
                            </template>
                        </my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap" v-if="total > 0">
                    <div class="totalNum">
                        <span>共 </span>
                        <span class="red">{{total}}</span>
                        <span> 笔 | 共 </span>
                        <span class="red">¥{{totalMoney}}</span>
                    </div>
                    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.PageIndex" :page-sizes="[10,20,30,40,50]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
        </div>
        <!-- 修改支出明细 -->
        <el-drawer title="修改支出明细" class="drawerWrap" :visible.sync="updateWindowStatus" direction="rtl" size="400px" :modal="false" :destroy-on-close="true">
            <div class="categroySelect">
                <el-select v-model="updateCategorySelected" placeholder="请选择" @change="changeCategory">
                    <el-option v-for="item in category" :label="item.label" :value="item" :key="item.value"></el-option>
                </el-select>
            </div>
            <div class="listWrap">
                <div class="listAdd" @click="secondVisible = true">
                    <div class="icon">+</div>
                    <div class="text">添加分类</div>
                </div>
                <div class="listItem" :class="{'isSelected': item.isSelected}" v-for="(item, index) in updateCategorySelected.chilren" :key="index" @click="handleSecondItem(index)">
                    <div class="iconWrap">
                        <i class="icon el-icon-success"></i>
                        <i class="icon el-icon-star-off"></i>
                    </div>
                    <div class="text">{{item.label}}</div>
                </div>
            </div>
            <div class="containar">
                <div class="line">
                    <el-input v-model="updateData.e_expenditure_money" type="number" clearable placeholder="请输入金额">
                        <template slot="prepend">
                            <div class="key">
                                <span>总支出</span>
                                <div class="flag">RMB</div>
                            </div>
                        </template>
                    </el-input>
                </div>
                <div class="line">
                    <el-input v-model="updateData.e_expendituredate" clearable disabled>
                        <template slot="prepend">
                            <span>日期</span>
                        </template>
                    </el-input>
                </div>
                <div class="line">
                    <el-input v-model="updateData.e_expenditure_node" clearable placeholder="输入最多50字" maxlength="50">
                        <template slot="prepend">
                            <span>备注</span>
                        </template>
                    </el-input>
                </div>

                <div class="line img_wrap">
                    <div class="line_label">图片(最多上传三张图片)</div>
                    <ImportImg :dataJson="$app.isNull(updateData.imgList)?[]:updateData.imgList" @callback="callbackImportImg" :verifyJson="verifyJson" :typeEntity="typeEntity" class="img_view"></ImportImg>
                </div>
                <div class="btnSure" @click="submitUpdate">
                    <span>确定</span>
                </div>
            </div>
        </el-drawer>
        <!-- 添加二级分类弹窗 -->
        <el-dialog class="secondDialog" title="添加小分类" width="400px" :close-on-click-modal="false" :visible.sync="secondVisible">
            <div class="content">
                <div class="text">
                    <span>所属大分类 : {{updateCategorySelected.label}}</span>
                </div>
                <div class="inputBox">
                    <el-input placeholder="输入分类名称" v-model="categoryInput"></el-input>
                </div>
            </div>
            <div class="btnWrap">
                <div class="btnItem btnPrimary small" @click="addSecond">确定</div>
                <div class="btnItem btnPrimary small disable" @click="secondVisible = false">取消</div>
            </div>
        </el-dialog>
    </div>
</template>

<style  lang="sass" scoped>
@import "./list.scss"
</style>
<script src="./list.js"></script>