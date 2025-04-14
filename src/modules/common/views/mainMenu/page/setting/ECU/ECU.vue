<template>
	<div class="ECU">
		<template v-if="!isAdd">
			<div class="filterWrap">
				<div class="btnPrimary" @click="handleAdd">新增</div>
			</div>
			<div class="contentWrap">
				<div class="tableWrap">
					<div class="thead">
						<div class="td1">序号</div>
						<div class="td2">电控组名称</div>
						<div class="td3">电控详情</div>
						<div class="td4">操作</div>
					</div>
					<div class="tbody">
						<el-scrollbar style="width: 100%; height: 100%">
							<div class="listWrap">
								<div class="listItem" v-for="(item, index) in tableData" :key="index">
									<div class="td1">{{ query.pageSize * (query.pageIndex - 1) + (index + 1) }}</div>
									<div class="td2">{{ item.sv_name }}</div>
									<div class="td3">
										<div class="itemList">
											<div class="itemBox" :class="{ isSet: data.sv_table_id }" v-for="(data, pos) in item.list" :key="pos">
												<div class="isSetBox" v-if="data.sv_table_id">
													<div class="isSetTop">
														<span>{{ data.sv_electric_num }}</span>
														<i class="el-icon-link"></i>
													</div>
													<div class="tableName">{{ data.sv_table_name }}</div>
												</div>
												<span v-else>{{ data.sv_electric_num }}</span>
											</div>
										</div>
									</div>
									<div class="td4">
										<el-button type="text" @click="handleEditGroup(item)">编辑</el-button>
										<el-button type="text" @click="handleDeleteGroup(item)">删除</el-button>
									</div>
								</div>
								<div class="tableNull" v-if="tableData.length === 0">暂无数据</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
				<div v-if="tableData.length > 0" class="pageWrap">
					<el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
				</div>
			</div>
		</template>
		<div class="addWrap" v-else>
			<div class="addContent">
				<div class="btnBack" @click="handleBackToList">
					<i class="el-icon-back"></i>
					<span>返回</span>
				</div>
				<div class="line">
					<div class="key">
						<span>电控组名称：</span>
					</div>
					<div class="value">
						<el-input v-model="addSubmit.sv_name"></el-input>
					</div>
				</div>
				<div class="line">
					<div class="key">
						<span>通讯端口：</span>
					</div>
					<div class="value">
						<el-select v-model="addSubmit.sv_port">
							<el-option v-for="(item, index) in portList" :key="index" :label="item" :value="item"></el-option>
						</el-select>
					</div>
				</div>
				<div class="line">
					<div class="key">
						<span>电控位：</span>
					</div>
					<div class="value">
						<div class="selectItem" :class="{ isSet: addSubmit.sv_bit === 8 }" @click="handleChangeType(8)">
							<span>8位</span>
						</div>
						<div class="selectItem" :class="{ isSet: addSubmit.sv_bit === 16 }" @click="handleChangeType(16)">
							<span>16位</span>
						</div>
						<div class="selectItem" :class="{ isSet: addSubmit.sv_bit === 32 }" @click="handleChangeType(32)">
							<span>32位</span>
						</div>
						<div class="selectItem" :class="{ isSet: addSubmit.sv_bit === 64 }" @click="handleChangeType(64)">
							<span>64位</span>
						</div>
					</div>
				</div>
				<div class="line">
					<div class="key"></div>
					<div class="value isList">
						<div class="top">
							<div class="listTitle">关联房台</div>
							<div class="btn listBtn" @click="handleShowRelevance">批量关联</div>
						</div>
						<div class="list">
							<div class="itemBox" :class="{ isSet: item.sv_table_id }" v-for="(item, index) in showSumitList" :key="index" @click="handleShowTableSelect(item)">
								<div class="isSetBox" v-if="item.sv_table_id">
									<div class="isSetTop">
										<span>{{ item.sv_electric_num }}</span>
										<i class="el-icon-link"></i>
									</div>
									<div class="tableName">{{ item.sv_table_name }}</div>
								</div>
								<span v-else>{{ item.sv_electric_num }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="addBtnWrap">
				<div class="btnPrimary big" @click="handleSave">保存</div>
			</div>
		</div>

		<dc-dialog title="关联房台" width="520" height="680" v-if="relevanceShow" @close="relevanceShow = false">
			<div class="relevanceContainer">
				<div class="tableWrap">
					<div class="theader">
						<div class="td1">电控序列</div>
						<div class="td2">关联房台</div>
						<div class="td3">操作</div>
					</div>
					<div class="tbody">
						<el-scrollbar style="width: 100%; height: 100%">
							<div class="relevanceListWrap">
								<div class="relevanceListItem" :class="{ isRemain: index % 2 === 1 }" v-for="(item, index) in relevanceData" :key="index">
									<div class="td1">{{ item.sv_electric_num }}</div>
									<div class="td2">
										<span v-if="item.sv_table_id">{{ item.sv_table_name }}</span>
										<div class="btnItem isSelected" v-else @click="handleRelevanceUpdate(item)">
											<i class="el-icon-link"></i>
											<span>选择房台</span>
										</div>
									</div>
									<div class="td3">
										<div class="relevanceBtnWrap" v-if="item.sv_table_id">
											<!-- <div class="btnItem" @click="handleRelevanceUpdate(item)">
												<i class="el-icon-edit"></i>
												<span>修改</span>
											</div> -->
											<div class="btnItem" @click="handleRelevanceDelete(item)">
												<i class="el-icon-delete"></i>
												<span>解除</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
				<div class="btnSaveRelevance">
					<div class="btnPrimary big" @click="handleSaveRelevance">保存</div>
				</div>
			</div>
		</dc-dialog>

		<dc-dialog width="1120" height="680" v-if="tableSelectShow" @close="tableSelectShow = false">
			<div class="tableSelectContainer">
				<div class="topWrap">
					<div class="topLeft">选择房台</div>
					<!-- <div class="topRight"></div> -->
				</div>
				<div class="listContent">
					<div class="menuContent">
						<el-scrollbar style="width: 100%; height: 100%;" v-if="menuList.length > 0">
							<div class="menuWrap">
								<div class="menuItem" :class="{ selected: item.id === queryEntity.regionId }" v-for="(item, index) in menuList" :key="index" @click="handleMenuClick(item.id)">
									<span>{{ item.name }}</span>
								</div>
							</div>
						</el-scrollbar>
					</div>
					<div class="listWrap">
						<el-scrollbar ref="tableListScroll" style="width: 100%; height: 100%">
							<div class="list">
								<div class="listItem" v-for="(item, index) in tableSelectData" :key="index">
									<div class="itemContent" :class="{ disabled: item.disabled }" @click="handleTableClick(item)">
										<div class="itemCheckbox" :class="{ selected: item.selected, disabled: item.disabled }"></div>
										<div class="itemInfoWrap">
											<div class="info">{{ menuList.find((e) => e.id === item.sv_region_id).name }}</div>
											<div class="itemName">{{ item.sv_table_name }}</div>
											<div class="info">容纳人数：{{ item.sv_table_number }}</div>
											<div class="selectedInfo" v-if="item.disabled">
												<i class="el-icon-link"></i>
												<span class="linkItem">{{ addSubmit.sv_electric_num }}</span>
												<span class="linkItem">{{ item.sv_electric_num }}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
				<div class="btnSaveTable">
					<div class="btnPrimary big" @click="handleSaveTable">确定</div>
				</div>
			</div>
		</dc-dialog>
	</div>
</template>

<style lang="scss" scope>
@import './ECU.scss';
</style>
<script src="./ECU.js"></script>
