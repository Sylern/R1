<!--选择班级弹窗-->
<template>
	<div class="classSelection" ref="classSelection" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
		<dc-dialog width="800" height="550" title="课程选班" @close="closeDialog">
			<div class="contentWrap">
				<div class="tableBox">
                    <myTable ref="myTableCourse" rowKey="id" :data="courseList">
                        <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                            <template v-slot:default="scope">
                                <span>{{ scope.index + 1 }}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="课程" prop="sv_p_name" showTooltip></my-table-cell>
                        <my-table-cell label="班级" prop="sv_class_name" showTooltip>
                            <template v-slot:default="scope">
                                <span>{{ $app.isNull(scope.sv_class_name) ? '' : scope.sv_class_name.join() }}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="分班状态" prop="sv_state" width="120" align="center">
                            <template v-slot:default="scope">
                                <span>{{ scope.sv_state === 0 ? ($app.isNull(scope.sv_class_name) ? '待选班' : '正在选班') : '续课' }}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="操作" prop="handle" width="100" align="center">
                            <template v-slot:default="scope">
                                <el-button :disabled="scope.sv_state === 1" @click.stop="handleSelected(scope)" type="text" size="small">选择班级</el-button>
                            </template>
                        </my-table-cell>
                    </myTable>
                </div>
				<div class="btnWrap">
					<div class="btn btnCancle" @click="closeDialog">取消</div>
					<div class="btn btnSure" @click="handleSubmit">确定</div>
				</div>
			</div>
		</dc-dialog>

        <dc-dialog v-if="dialogSelectClass" width="1000" height="500" title="选择班级" @close="dialogSelectClass = false">
			<div class="contentWrap">
				<div class="tableBox">
                    <myTable ref="myTableClass" @select-all="handleSelectAll" @select="handleSellect" rowKey="sv_guid" :data="tableClassData">
                        <my-table-cell fixed prop="selection" width="40" align="right"></my-table-cell>
                        <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                            <template v-slot:default="scope">
                                <span>{{ scope.index + 1 }}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="班级" prop="sv_class_name"></my-table-cell>
                        <my-table-cell label="类型" prop="sv_business_type" width="80" align="center">
                            <template v-slot:default="scope">
                                <!-- 100一对多，200一对一 -->
                                <span>{{ scope.sv_business_type === 100 ? '一对多' : '一对一' }}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="关联课程" prop="pnamesText" width="200" align="center" showTooltip></my-table-cell>
                        <my-table-cell label="授课老师" prop="teacherText" width="140" align="center" showTooltip></my-table-cell>
                        <my-table-cell label="助教" prop="assistantText" width="140" align="center" showTooltip></my-table-cell>
                        <my-table-cell label="人数/容量" prop="sv_state" width="80" align="center">
                            <template v-slot:default="scope">
                                <span>{{ scope.member_num +'/'+ scope.sv_use_number}}</span>
                            </template>
                        </my-table-cell>
                    </myTable>
                </div>
				<div class="btnWrap">
					<div class="btn btnCancle" @click="dialogSelectClass = false">取消</div>
					<div class="btn btnSure" @click="handleClassSure">确定</div>
				</div>
			</div>
		</dc-dialog>
	</div>
</template>

<style lang="scss" scoped>
@import './classSelection.scss';
</style>
<script src="./classSelection.js"></script>
