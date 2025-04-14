
<template>
  <div class="messageEditing-wrap">
    <div class="title">消息编辑</div>
    <div class="contentWrap">
      <div class="cw_left">
        <el-form :model="entityObj" :rules="entityRules" ref="entityForm" class="form">
          <el-form-item label="消息类型：" class="formItem" prop="sv_type_id">
            <el-radio-group v-removeAria v-model.trim="entityObj.sv_type_id">
              <el-radio :label="5">更新日志</el-radio>
              <el-radio :label="2">系统通知</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发布对象：" class="formItem" prop="sv_receiver_types">
            <el-checkbox-group v-model.trim="entityObj.sv_receiver_types">
              <el-checkbox label="Web">云后台</el-checkbox>
              <el-checkbox label="AndroidPad">安卓大屏</el-checkbox>
              <el-checkbox label="AndroidPhone">安卓移动端</el-checkbox>
              <el-checkbox label="IosPhone">IOS APP</el-checkbox>
              <el-checkbox label="IosPad">IOS ipad</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="消息标题：" prop="sv_message_title">
            <el-input v-model.trim="entityObj.sv_message_title" maxlength="100" placeholder="输入消息标题"></el-input>
          </el-form-item>
        </el-form>
        <div class="editor" id="editor"></div>
        <div class="bottomWrap">
          <el-button @click="handleReset" class="btnItem btnBasic" style="margin-right: 18px;">取消</el-button>
          <el-button @click="handleSubmit" class="btnItem btnPrimary" v-repeatClick>发布</el-button>
        </div>
      </div>
      <div class="cw_right">
        <div class="nav">
          <div :class="{active: queryData.receiverTypes===''}" @click="handleReceiverTypes('')" class="dd">全部</div>
          <div :class="{active: queryData.receiverTypes==='Web'}" @click="handleReceiverTypes('Web')" class="dd">云后台</div>
          <div :class="{active: queryData.receiverTypes==='AndroidPad'}" @click="handleReceiverTypes('AndroidPad')" class="dd">安卓大屏</div>
          <div :class="{active: queryData.receiverTypes==='AndroidPhone'}" @click="handleReceiverTypes('AndroidPhone')" class="dd">安卓移动端</div>
          <div :class="{active: queryData.receiverTypes==='IosPhone'}" @click="handleReceiverTypes('IosPhone')" class="dd">IOS APP</div>
          <div :class="{active: queryData.receiverTypes==='IosPad'}" @click="handleReceiverTypes('IosPad')" class="dd">ipad</div>
        </div>
        <div class="titleBar">
          <div :class="{active: queryData.typeId===5}" @click="handleTypeId(5)" class="dd">更新日志</div>
          <div :class="{active: queryData.typeId===2}" @click="handleTypeId(2)" class="dd">系统通知</div>
        </div>
        <div class="table">
          <el-scrollbar style="height:100%;width:100%">
            <div v-for="item in listJson" :key="item.sv_message_id" class="dl">
              <div class="dl_left">
                <el-tooltip class="item" effect="dark" :content="item.sv_message_title" placement="top-start">
                  <div class="dl_title">{{item.sv_message_title}}</div>
                </el-tooltip>
                <div class="dl_time">{{item.sv_send_time}}</div>
              </div>
              <div class="dl_right">
                <el-button @click="handleEdit(item.sv_message_id)" class="btnBasic edit">编辑</el-button>
                <el-button @click="handleDelete(item.sv_message_id)" class="btnBasic delete">删除</el-button>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-if="total>0" class="pageWrap">
          <el-pagination @current-change="handleCurrentChange" :current-page="queryData.pageIndex" :page-size="queryData.pageSize" layout="prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope>
@import "./messageEditing.scss";
</style>
<script src="./messageEditing.js"></script>
