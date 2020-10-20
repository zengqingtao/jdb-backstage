<template>
  <el-dialog
    title="余额明细查看"
    :visible.sync="modalStatus"
    width="60%"
    center
    :close-on-click-modal="false"
    @close="closeModalFn"
  >
    <el-form inline size="small">
      <el-form-item>
        <el-input placeholder="请输入京店宝账号" v-model="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchDate"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchFn">确定</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table :data="tableData">
        <el-table-column prop="account" label="京店宝账号"></el-table-column>
        <el-table-column prop="isFission" label="是否裂变">
          <template slot-scope="scope">
            <span>{{scope.row.isFission === 0 ? `否` : '是'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="orderFrom" label="所属产品"></el-table-column>
        <el-table-column prop="orderType" label="收支类型"></el-table-column>
        <el-table-column prop="orderDesc" label="描述"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="balance" label="余额"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-pagination
        class="paging"
        v-show="page.total"
        @current-change="handleCurrentChange"
        :current-page="page.pageNo"
        :page-size="page.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
    </el-row>
  </el-dialog>
</template>
<script>
import Reseller from "api/reseller";

export default {
  data() {
    return {
      modalStatus: true,
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      search: "",
      searchDate: []
    };
  },
  props: {
    code: {
      type: String
    }
  },
  computed: {
    searchStartDate() {
      if (!this.searchDate) return "";
      return this.searchDate[0] ? this.searchDate[0] : "";
    },
    searchEndDate() {
      if (!this.searchDate) return "";
      return this.searchDate[1] ? this.searchDate[1] : "";
    }
  },
  created() {
    this.getBalanceDetail();
  },
  methods: {
    searchFn() {
      this.page.pageNo = 1;
      this.getBalanceDetail();
    },
    async getBalanceDetail() {
      const results = await Reseller.listDetail({
        code: this.code,
        page: this.page.pageNo,
        size: this.page.pageSize,
        search: this.search,
        start: this.searchStartDate || "",
        end: this.searchEndDate || ""
      });
      if (results.code === 200) {
        this.tableData = results.data;
        this.page.total = results.allCount;
      } else {
        this.tableData = [];
      }
    },
    closeModalFn() {
      this.$emit("close");
    },
    handleCurrentChange(index) {
      this.page.pageNo = index;
      this.getBalanceDetail();
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-form {
  display: flex;
  align-items: center;
  justify-content: center;
}

.paging {
  margin-top: 20px;
}
</style>