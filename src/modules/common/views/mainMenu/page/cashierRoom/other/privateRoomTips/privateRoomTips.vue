<!--预结弹窗提醒列表弹窗-->
<template>
    <div class="privateRoomTips" ref="privateRoomTips" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1000" height="650" title="房台预结提醒" @close="closeDialog" zIndex="3001">
            <div class="tableWrap">
                <myTable ref="myTable" rowKey="id" :data="tableData">
                    <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                        <template v-slot:default="row">
                            <span>{{row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="房台名称" prop="sv_table_name" width="200" showTooltip></my-table-cell>
                    <my-table-cell label="房台区域" prop="sv_region_name"></my-table-cell>
                    <my-table-cell label="开台人数" prop="sv_table_use_number" align="center"></my-table-cell>
                    <my-table-cell label="开台时间" prop="sv_table_opendate" width="200" align="center"></my-table-cell>
                    <my-table-cell label="预计预结时间" prop="preknot_date" width="200" align="center"></my-table-cell>
                </myTable>
            </div>
            <div class="totalInfo">共<span class="red">{{ tableData.length }}</span>张房台待预结</div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './privateRoomTips.scss';
</style>
<script src="./privateRoomTips.js"></script>