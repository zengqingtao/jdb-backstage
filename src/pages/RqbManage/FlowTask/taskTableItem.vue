<template>
  <div class="table-item">
    <div class="table-item-header">
      <div class="order-time">{{data.createTime}}</div>
      <div class="order-id">任务编号：{{data.id}}</div>
    </div>
    <el-row class="table-item-content">
      <el-col class="table-item-content-col center" :span="6">{{data.taskUrl}}</el-col>
      <el-col class="table-item-content-col shop-name" :span="4">{{data.shopName}}</el-col>
      <el-col class="table-item-content-col" :span="2">{{data.platformStr}}</el-col>
      <el-col class="table-item-content-col" :span="2">{{data.taskTypeStr}}</el-col>
      <el-col class="table-item-content-col" :span="2">{{data.statusStr}}</el-col>
      <el-col class="table-item-content-col" :span="2">{{data.money}}元</el-col>
      <el-col class="table-item-content-col" :span="2">{{data.jdbAccount}}</el-col>
      <el-col class="table-item-content-col" :span="2">{{data.bdName}}</el-col>
      <el-col class="handle-group" :span="2">
        <div v-if="data.status>1">
          <div class="see-detail">
            <a
              :href="'./#/Rqb/rqbFlow/Details?platform=' 
                + data.platform + '&taskType=' + data.taskType
                + '&taskId=' + data.id"
              target="_blank"
              rel="noopener"
            >查看详情</a>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    data: {
      type: Object
    },
    flowType: {
      type: Number
    }
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
$theme-color: #3489fe;
.table-item {
  box-sizing: border-box;
  margin-bottom: 16px;
  .table-item-header {
    height: 41px;
    background: #fbfbfb;
    box-sizing: border-box;
    font-size: 14px;
    display: flex;
    align-items: center;
    .order-time {
      margin-left: 30px;
    }
    .order-id {
      margin-left: 30px;
    }
  }
  .table-item-content {
    text-align: center;
    height: 98px;
    font-size: 14px;
    background-color: white;
    box-shadow: 0px 3px 24px 0px rgba(200, 200, 200, 0.22);
    border-radius: 0px 0px 10px 10px;
    /deep/ .table-item-content-col {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      line-height: 18px;
      word-break: break-word;
      &.center {
        text-align: left;
        justify-content: start;
        padding-left: 30px;
      }
    }
    .handle-group {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      .release-btn {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: $theme-color;
        border-radius: 4px;
        transition: all 0.7s;
        cursor: pointer;
        margin-top: 6px;
        display: inline-block;
        user-select: none;
        &:hover {
          opacity: 0.5;
        }
      }
      .delete-btn,
      .cancel-btn {
        color: #666;
        // cursor: pointer;
        padding-top: 10px;
        // user-select: none;
      }
      .see-detail a,
      .copy-btn {
        color: #3489fe;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.7s;
        padding-right: 5px;
        line-height: 150%;
        &:hover {
          opacity: 0.5;
        }
      }
      .cancel-btn {
        padding-top: 10px;
      }
    }
  }
}
</style>