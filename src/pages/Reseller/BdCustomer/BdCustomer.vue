<template>
  <el-container>
    <el-tabs class="tabs-list" type="card" v-model="moduleId" @tab-click="tabSwitch">
      <el-tab-pane
        v-for="item in parentModule"
        :key="item.id"
        :label="item.name"
        :name="item.id.toString()"
      ></el-tab-pane>
    </el-tabs>
    <template v-if="moduleId === '1'">
      <el-header class="header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6"></el-col>
          <el-col :span="14"  class="flex text-right">
            <el-input v-model="jdbAccount" placeholder="请输入京店宝账号" size="small" clearable></el-input>
            <el-input v-model="searchName" placeholder="请输入查询的BD名称" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-row>
        <el-table :data="tableData">
          <el-table-column prop="bd" label="归属BD ID"></el-table-column>
          <el-table-column prop="name" label="归属BD"></el-table-column>
          <el-table-column prop="account" label="京店宝账号"></el-table-column>
          <el-table-column prop="registerTime" label="注册时间"></el-table-column>
          <el-table-column prop="level" label="当前会员等级"></el-table-column>
          <el-table-column prop="balance" label="账户余额"></el-table-column>
          <el-table-column prop="registerAll" label="累计充值">
            <template slot-scope="scope">{{scope.row.registerAll}}</template>
          </el-table-column>
          <el-table-column prop="isFission" label="是否裂变">
            <template slot-scope="scope">{{scope.row.isFission? `是` : `否`}}</template>
          </el-table-column>
        </el-table>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col class="page">
            <el-pagination
              v-if="page.total"
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
      </el-row>
    </template>
    <template v-if="moduleId === '2'">
      <el-header class="header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6"></el-col>
          <el-col :span="14" class="flex text-right">
            <el-date-picker
              format="yyyy年MM月"
              value-format="yyyy-MM"
              size="small"
              v-model="searchDate"
              type="month"
              placeholder="请选择月份"
            ></el-date-picker>
            <el-input v-model="searchName" placeholder="请输入查询的BD名称" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-row>
        <el-table :data="tableData">
          <el-table-column prop="name" label="BD"></el-table-column>
          <el-table-column prop="distributorCode" label="分销商BD邀请码"></el-table-column>
          <el-table-column prop="recharge" label="本月充值金额"></el-table-column>
          <el-table-column prop="withdraw" label="本月充值退款金额"></el-table-column>
          <el-table-column prop="consume" label="本月消费金额"></el-table-column>
          <el-table-column prop="consumeRefund" label="本月消费退款金额"></el-table-column>
          <el-table-column label="余额明细">
            <template slot-scope="scope">
              <el-row>
                <el-button type="text" @click="checkBalanceDetail(scope)">查看</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col class="page">
            <el-pagination
              v-if="page.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page.pageNo"
              :page-sizes="[10, 20, 50]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-row>
    </template>

    <balance-detail-modal
      v-if="balanceDetailModalToggle"
      :code="activeItemCode"
      @close="balanceDetailModalToggle=false"
    ></balance-detail-modal>
  </el-container>
</template>
<script>
import BalanceDetailModal from "./BalanceDetailModal";
import Reseller from "api/reseller";

export default {
  name: "BdCustomer",
  data() {
    return {
      jdbAccount:'',
      searchName: "", // 基础数据-BD名称
      searchDate: "", // 业绩数据-日期
      moduleId: "1",
      parentModule: [{ name: "基础数据", id: 1 }, { name: "业绩数据", id: 2 }],
      tableData: [],
      page: {
        // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      balanceDetailModalToggle: false,
      activeItemCode: "" // 当前选中的分销商BD邀请码
    };
  },
  created() {
    this.basicsData();
  },
  methods: {
    pageLoad() {
      const apiMap = {
        "1": this.basicsData,
        "2": this.businessData
      };
      apiMap[this.moduleId] ? apiMap[this.moduleId]() : "";
    },
    searchFn() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: null
      };
      this.pageLoad();
    },
    tabSwitch(e) {
      this.tableData = [];
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: null
      };
      this.searchName = ""
      this.jdbAccount = ""
      this.pageLoad();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.pageLoad();
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.pageLoad();
    },
    async basicsData() {
      const results = await Reseller.bdBasicsList({
        page: this.page.pageNo,
        size: this.page.pageSize,
        search: this.searchName,
        jdbAccount: this.jdbAccount
      });
      if (results.code === 200) {
        this.tableData = results.data;
        this.page.total = results.allCount;
      } else {
        this.tableData = [];
        this.page.total = null;
      }
    },
    async businessData() {
      const results = await Reseller.listAchievement({
        page: this.page.pageNo,
        size: this.page.pageSize,
        search: this.searchName,
        date: this.searchDate
      });
      if (results.code === 200) {
        this.tableData = results.data;
        this.page.total = results.allCount;
      } else {
        this.tableData = [];
        this.page.total = null;
      }
    },
    checkBalanceDetail(scope) {
      this.activeItemCode = scope.row.distributorCode;
      this.balanceDetailModalToggle = true;
    }
  },
  components: { BalanceDetailModal }
};
</script>

<style lang="scss" scoped>
.tabs-list {
  margin-top: 30px;
}

.flex {
  display: flex;
  justify-content: flex-end;
}

.header {
  padding: 0 30px;
  .el-input {
    width: 75%;
    margin: 0 10px;
    max-width: 300px;
  }
}
</style>