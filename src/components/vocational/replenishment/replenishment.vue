<template>
  <el-dialog title="批量修改商品补货数量" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="360px" center class="system_dialog">
    <div class="replenishment borderTop">
      <div class="item">
        <el-radio class="radio" v-model.trim="max_min_type" :label="1">批量补货至商品库存上限</el-radio>
      </div>
      <div class="item">
        <el-radio class="radio" v-model.trim="max_min_type" :label="2">批量补货至商品库存下限</el-radio>
      </div>
      <div class="item">
        <el-radio class="radio" v-model.trim="max_min_type" :label="3">批量补货数量</el-radio>
        <el-input :disabled="max_min_type!==3" v-model.trim="batch_value" class="input"></el-input>
      </div>
      <div v-if="false" class="item columns">
        <el-radio class="radio" v-model.trim="max_min_type" :label="4">智能补货数量</el-radio>
        <div class="dd">
          <span>近</span>
          <el-input :disabled="max_min_type!==4" class="input" v-model.trim="average_sales"></el-input>
          <label>天内平均销量</label>
        </div>
        <div class="dd">
          <span>补货</span>
          <el-input :disabled="max_min_type!==4" class="input" v-model.trim="sales_volume"></el-input>
          <label>天销量</label>
        </div>
        <div class="waring">* 智能补货数量=日平均销量*补货天数</div>
      </div>
      <div class="foot">
        <!-- <div @click="handleGoodsAllocation" class="btnItem btnPrimary">去调拨</div> -->
        <div @click="handlePurchase" class="btnItem btnBasic">去采购</div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scope>
@import "./replenishment.scss";
</style>
<script src="./replenishment.js"></script>