<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-if="tabIndex === '1'">
      <el-table-column prop="pid" label="订单编号"></el-table-column>
      <el-table-column prop="taskId" label="任务编号"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="taskDate" label="执行日期"></el-table-column>
      <el-table-column prop="plant" label="平台"></el-table-column>
      <el-table-column prop="taskType" label="订单类型"></el-table-column>
      <el-table-column label="完成量/发布量">
        <template slot-scope="scope">
          <span>{{scope.row.finishNum}}/{{scope.row.taskNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rqbStatus" label="人气宝状态"></el-table-column>
      <el-table-column prop="powerStatus" label="供应商状态"></el-table-column>
      <el-table-column prop="bdName" label="跟单人员"></el-table-column>
      <el-table-column prop="remark" label="刷量不足"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="toTask(scope.row.taskId)">查看任务</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="tableData" style="width: 100%" v-if="tabIndex === '2'">
      <el-table-column prop="taskId" label="任务编号"></el-table-column>
      <el-table-column prop="publishTime" label="发布时间"></el-table-column>
      <el-table-column prop="url" label="任务链接"></el-table-column>
      <el-table-column prop="plant" label="平台"></el-table-column>
      <el-table-column prop="taskType" label="任务类型"></el-table-column>
      <el-table-column prop="status" label="任务状态"></el-table-column>
      <el-table-column prop="bd" label="跟单人员"></el-table-column>
      <el-table-column prop="date" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="toDayTask(scope.row.taskId,scope.row.taskType)">每日任务</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="tableData" style="width: 100%" v-if="tabIndex === '3'">
      <el-table-column prop="taskDate" label="执行时间"></el-table-column>
      <el-table-column label="点击量">
        <template slot-scope="scope">
          <span>{{scope.row.success}}/{{scope.row.click}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品加购数">
        <template slot-scope="scope">
          <span>{{scope.row.cartFinish}}/{{scope.row.cart}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关注商品数">
        <template slot-scope="scope">
          <span>{{scope.row.attentionProductFinish}}/{{scope.row.attentionProduct}}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺粉丝数">
        <template slot-scope="scope">
          <span>{{scope.row.attentionStoreFinish}}/{{scope.row.attentionStore}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="refund" label="退款金额"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="toDetails(scope.row.taskId,taskType,scope.row.id)"
            v-if="scope.row.send"
          >查看详情</el-button>
          <span v-else>未发送</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="tableData" style="width: 100%" v-if="tabIndex === '4'">
      <el-table-column prop="date" label="执行时间"></el-table-column>
      <el-table-column :label="taskType">
        <template slot-scope="scope">
          <span>{{scope.row.process}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="refundMoney" label="退款金额"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="toDetails(scope.row.taskId,taskType,scope.row.id)"
            v-if="scope.row.send"
          >查看详情</el-button>
          <span v-else>未发送</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="tableData" style="width: 100%" v-if="tabIndex === '5'">
      <el-table-column prop="pid" label="订单编号"></el-table-column>
      <el-table-column prop="taskDate" label="执行日期"></el-table-column>
      <el-table-column prop="taskType" label="订单类型"></el-table-column>
      <el-table-column prop="initial" label="原本数量">
        <template slot-scope="scope">
          <span>{{scope.row.initial || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布量/完成量">
        <template slot-scope="scope">
          <span>{{scope.row.finishNum}}/{{scope.row.taskNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rqbStatus" label="人气宝状态"></el-table-column>
      <el-table-column prop="powerStatus" label="供应商状态"></el-table-column>
      <el-table-column prop="remark" label="刷量不足"></el-table-column>
    </el-table>
    <el-table :data="tableData" style="width: 100%" v-if="tabIndex === '6'">
      <el-table-column prop="pid" label="订单编号"></el-table-column>
      <el-table-column prop="taskId" label="任务编号"></el-table-column>
      <el-table-column prop="jdbAccount" label="账号"></el-table-column>
      <el-table-column prop="taskDate" label="执行日期"></el-table-column>
      <el-table-column prop="platform" label="平台"></el-table-column>
      <el-table-column prop="taskType" label="任务类型"></el-table-column>
      <el-table-column prop='num' label="完成量/发布量"></el-table-column>
      <el-table-column prop="powerStatus" label="供应商状态"></el-table-column>
      <el-table-column prop="bdName" label="跟单人员"></el-table-column>
      <el-table-column prop="status" label="处理状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="toTask(scope.row.taskId)">查看任务</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "OrderTable",
  props: {
    tableData: {
      require: true,
      type: Array
    },
    tabIndex: {
      require: true,
      type: String
    },
    taskType: {
      require: false,
      type: String
    }
  },
  methods: {
    toTask(taskId) {
      this.$emit("toTaskByTaskId", taskId);
    },
    toDetails(taskId, taskType, id) {
      this.$router.push({
        path: "/Rqb/rqbFlow/Details",
        query: { taskId, taskType, id }
      });
    },
    toDayTask(taskId, taskType) {
      this.$router.push({
        path: "/Rqb/rqbFlow/todayTask",
        query: { taskId, taskType }
      });
    }
  }
};
</script>