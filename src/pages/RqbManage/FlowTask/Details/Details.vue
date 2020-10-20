<template>
  <el-container>
    <el-main class="main">
      <el-row type="flex" class="row-bg">
        <el-col :span="3">
          <span>任务编号：{{taskId}}</span>
        </el-col>
        <el-col :span="4">
          <span>京店宝账号：{{jdbAccount}}</span>
        </el-col>
        <el-col :span="4">
          <span>客户微信：{{wechat}}</span>
        </el-col>
      </el-row>


      <FlowTaskTable :tabIndex="'5'" :tableData='tableData'></FlowTaskTable>

      <el-row
        type="flex"
        class="row-bg"
        justify="end"
        v-if="pagination.totalCount > pagination.size"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10,20,50]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.totalCount"
        ></el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import rqbManage from "api/rqbManage";
import FlowTaskTable from "../FlowTaskTable";
import { mapMutations } from "vuex";
export default {
  components: {
    FlowTaskTable
  },
  data() {
    return {
      pagination: {
        page: 1,
        size: 10,
        totalCount: 0
      },
      tableData: [],
      taskId: this.$route.query.taskId,
      jdbAccount: "",
      wechat: "",
      taskDateId: this.$route.query.id
    };
  },
  created() {
    this.listManageTaskByTaskId();
    this.initQuery({
      taskId: this.$route.query.taskId,
      taskType: this.$route.query.taskType
    });
  },
  methods: {
    ...mapMutations(["initQuery"]),
    init() {
        (this.pagination = {
          page: 1,
          size: 10,
          totalCount: 100
        });
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.listManageTaskByTaskId();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.listManageTaskByTaskId();
    },

    async listManageTaskByTaskId() {
      const params = {
        page: this.pagination.page,
        size: this.pagination.size,
        taskId: this.taskId,
        taskDateId: this.taskDateId,
      };
      const { data, code, msg } = await rqbManage.listManageTaskByTaskId(
        params
      );
      if (code === 200) {
        const { list, jdbAccount, wechat } = data;
        this.tableData = list.results;
        this.pagination.page = list.pageNo;
        this.pagination.totalCount = list.totalCount;
        this.jdbAccount = jdbAccount;
        this.wechat = wechat;
      } else {
        this.tableData = [];
        this.$message.error(msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.row-bg {
  padding: 15px 0;
}
</style>