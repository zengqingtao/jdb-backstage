<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6"></el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="请输入要查询的登录手机号" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="phone" label="登录手机号"></el-table-column>
        <el-table-column label="待付款时间">
          <template slot-scope="scope">{{ time(scope.row.paymentTime) }}</template>
        </el-table-column>
        <el-table-column prop="money" label="待付款金额"></el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-row v-if="scope.row.status === 0||scope.row.status===null">
              <el-button type="primary" plain size="mini" @click="followOrder(scope.row.id)">跟单</el-button>
            </el-row>
            <el-row v-else-if="scope.row.status === 1">
              <el-button type="primary" plain size="mini" @click="resultFn(2, scope.row.id)">催付成功</el-button>
              <el-button type="primary" plain size="mini" @click="resultFn(3, scope.row.id)">催付失败</el-button>
            </el-row>
            <el-row v-else>-</el-row>
          </template>
        </el-table-column>
        <el-table-column label="操作时间">
          <template
            slot-scope="scope"
          >{{ scope.row.changeTime ? time(scope.row.changeTime) : null }}</template>
        </el-table-column>
        <el-table-column prop="userName" label="操作人"></el-table-column>
        <el-table-column prop="dbName" label="跟单BD"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ statusFn(scope.row.status) }}</template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import payment from "api/payment";
import untils from "js/untils";
import { mapState } from "vuex";

export default {
  name: "OrderPayment",
  data() {
    return {
      search: "",
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    };
  },
  computed: {
    ...mapState(["jdb_userInfo"])
  },
  methods: {
    pageLoad() {
      payment
        .getPayment({
          id: this.jdb_userInfo.id,
          page: this.page.pageNo,
          size: this.page.pageSize,
          search: this.search
        })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data;
            this.page.pageNo = res.page;
            this.page.total = res.allCount;
          } else {
            this.tableData = [];
            this.page.pageNo = 1;
            this.page.total = null;
          }
        });
    },
    statusFn(status) {
      const statusName =
        status === 1
          ? "已跟单"
          : status === 2
          ? "催单成功"
          : status === 3
          ? "催单失败"
          : "";
      return statusName;
    },
    time(val) {
      return untils.formatTime(val);
    },
    searchFn() {
      this.page.pageNo = 1;
      this.pageLoad();
    },
    followOrder(id) {
      payment.getDocumentary({ id, userId: this.jdb_userInfo.id }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "跟单成功"
          });
          this.pageLoad();
        }
      });
    },
    resultFn(status, id) {
      payment.result({ id, status, userId: this.jdb_userInfo.id }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: status === 2 ? "success" : "error",
            message: status === 2 ? "催付成功" : "催付失败"
          });
          this.pageLoad();
        }
      });
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.pageLoad();
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.pageLoad();
    }
  },
  mounted() {
    this.pageLoad();
  },
  destroyed() {
    Object.assign(this.$data, {
      search: "",
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.header {
  padding: 30px;
  margin-bottom: 20px;
  .el-input {
    width: 75%;
    margin-right: 10px;
  }
}
</style>
