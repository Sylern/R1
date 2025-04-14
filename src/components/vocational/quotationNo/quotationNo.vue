<template>
    <el-dialog title="引用单号" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="1000px" center class="system_dialog">
        <div slot="title" class="el-dialogTitle">
            <div class="name">引用单号</div>
            <!-- <div class="content">暂不支持商品面料，安全类别，年份，季节、款号等标签打印，请单独选择商品进行打印，敬请期待下个版本更新</div> -->
        </div>
        <div class="quotationNo borderTop">
            <div class="left">
                <div v-for="item in typeData" :key="item.id" class="dl">
                    <div @click="handleType(item)" class="dd" :class="{active:checkedType.id===item.id}">
                        <dd>{{item.label}}</dd>
                    </div>
                </div>
            </div>
            <div class="right tablePagin queryTable">
                <div class="right_top ">
                    <date-time-picker :paramData="dateTime"  @change="handleChangeTime" needTimePicker></date-time-picker>
                    <div class="searchInput">
                        <el-input @keyup.enter.native="handleReset" placeholder="请输入单据编码" clearable v-model.trim="keywards">
                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                </div>
                <div class="myTable">
                    <myTable ref="myTable" rowKey="id" :data="tableData">
                        <my-table-cell  prop="单选" width="40" align="right">
                            <template v-slot:default="scope">
                                <el-radio class="radio" v-model.trim="checkedRowId" :label="scope.id">{{''}}</el-radio>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="单据名称" prop="name"></my-table-cell>
                        <my-table-cell label="单据状态" prop="sv_pc_statestr"></my-table-cell>
                        <my-table-cell label="单据编号" prop="sv_pc_noid" width="200">
                            <template v-slot:default="scope">
                                <span class="copy" v-copy="scope.sv_pc_noid" title="复制"><i class="el-icon-document-copy" ></i>{{scope.sv_pc_noid}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="单据日期" prop="sv_pc_cdate" align="center"></my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap">
                    <el-pagination @current-change="handleCurrentChange" :page-size="pagesize" background layout="prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
                <div class="foot">
                    <div class="btnItem btnPrimary" @click="handleSubmit">确定</div>
                </div>
            </div>

            <!-- <div class="right tablePagin">
                <div class="right_top">
                    <div class="query queryFilter">
                        <date-time-picker @change="handleChangeTime" needTimePicker></date-time-picker>
                        <el-input @change="handleReset" v-model.trim="keywards" placeholder="请输入单据编码" style="width: 280px;" clearable>
                            <template slot="append">
                                <el-button>搜索</el-button>
                            </template>
                        </el-input>

                    </div>
                    <el-button @click="handleSubmit" type="primary" style="width:90px;height:60px">确定</el-button>
                </div>
                <el-table ref="multipleTable" @row-click="handleRow" :data="tableData" class="elementTable">
                    <el-table-column label="操作" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio class="notLabel" v-model.trim="checkedRow" :label="scope.row">''</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="单据名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sv_pc_noid" label="单据编号">
                        <template slot-scope="{row}">
                            <div>
                                <span v-copy="row.sv_pc_noid">
                                    <i class="el-icon-document-copy"></i>
                                    {{row.sv_pc_noid}}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sv_pc_cdate" label="单据日期" align="center"></el-table-column>
                    <div slot="append" class="tableBottomRight">
                        <el-pagination @current-change="handleCurrentChange" :page-size="pagesize" background layout="prev, pager, next, jumper" :total="total"></el-pagination>
                    </div>
                </el-table>
            </div> -->
        </div>
    </el-dialog>
</template>

<style lang="sass" scoped>@import "./quotationNo.scss"
</style>
<script src="./quotationNo.js"></script>