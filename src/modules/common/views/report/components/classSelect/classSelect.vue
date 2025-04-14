<template>
    <dc-dialog class="classSelectedWrap system_dialog queryFilter" v-if="dialogVisible" :title="title" width="800" height="650" @close="closeDialog">
        <div class="searchInput">
            <el-input :placeholder="`请输入${name}名称`" v-model="queryClass.seachStr" @keyup.enter.native="inputSearch" @clear="inputSearch" clearable></el-input>
        </div>
        <div class="list">
            <div class="tableBox">
                <myTable ref="courseTable" @select-all="handleSelectAll" @select="handleSellect" rowKey="id" :data="list">
                    <my-table-cell fixed prop="selection" width="40" align="right" v-if="!onlySelect"></my-table-cell>
                    <my-table-cell fixed prop="onlySelected" width="40" align="right" v-else>
                        <template v-slot:default="scope">
                            <el-radio class="radio" v-model="checkedRadio" :label="scope">{{''}}</el-radio>
                        </template>
                    </my-table-cell>
                    <my-table-cell fixed label="序号" prop="序号" width="60" align="center">
                        <template v-slot:default="scope">
                            <span>{{ (queryClass.pageIndex - 1) * queryClass.pageSize + scope.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell :label="`${name}名称`" prop="sv_class_name" showTooltip></my-table-cell>
                    <my-table-cell v-if="name=='班级'" label="班级类别" prop="sv_classcategory_name"></my-table-cell>
                    <my-table-cell label="关联课程" prop="sv_course_name" width="180" showTooltip></my-table-cell>
                    <my-table-cell :label="`${name=='班级'?'班级老师':'健身教练'}`" prop="sv_teacher_name" width="180" showTooltip></my-table-cell>
                    <my-table-cell v-if="name=='班级'" label="上课教室" prop="sv_classroom_name"></my-table-cell>
                </myTable>
            </div>
            <div v-if="total > 0" class="pageWrap">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                    :current-page="queryClass.pageIndex" :page-sizes="[10, 20, 30, 40, 50]"
                    :page-size="queryClass.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="total"></el-pagination>
            </div>
        </div>
        <div class="btnWrap">
            <el-button @click="closeDialog" class="btnItem btnBasic">取消</el-button>
            <el-button @click="handleSubmit" class="btnItem btnPrimary" v-repeatClick>确定</el-button>
        </div>
    </dc-dialog>
</template>

<style  lang="sass" scoped>@import "./classSelect.scss"</style>
<script src="./classSelect.js"></script>