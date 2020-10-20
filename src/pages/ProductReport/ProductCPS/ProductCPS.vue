<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName" @tab-click="tabSwitch">
        <el-tab-pane label="用户注册" name="1"></el-tab-pane>
        <el-tab-pane label="消费情况" name="2"></el-tab-pane>
        <el-tab-pane label="数据报表" name="3"></el-tab-pane>
      </el-tabs>

      <el-card class="mg-b-10" v-if="activeName === '3'">
        <el-row class="main3" type="flex" justify="space-between">
          <el-col>
            <h1>{{ reportData.rechargeMonth }}</h1>
            <p>充值金额</p>
          </el-col>
          <el-col>
            <h1>{{ reportData.consumeMonth }}</h1>
            <p>消费金额</p>
          </el-col>
          <el-col>
            <h1>{{ reportData.amountMonth }}</h1>
            <p>联盟用户佣金</p>
          </el-col>
          <el-col>
            <h1>{{ reportData.discountMonth }}</h1>
            <p>商家优惠金额</p>
          </el-col>
        </el-row>
      </el-card>

      <el-main>
        <el-row v-if="activeName === '1'">
          <el-col :span="4">
            <b>总用户量：{{ allAcount }}</b>
          </el-col>
        </el-row>

        <el-row v-else-if="activeName === '2'">
          <el-col :span="4">
            <b>本月累计充值：{{ thisMonthMoney }}</b>
          </el-col>
          <el-col :span="4">
            <b>本月累计消费：{{ thisMonthSaleMoney }}</b>
          </el-col>
        </el-row>

        <el-header class="header" v-else-if="activeName === '3'">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
            </el-col>
            <el-form inline size="small">
              <el-form-item>
                <el-date-picker :clearable="false" class="w200" v-model="date" type="month" value-format="yyyy-MM"></el-date-picker>
              </el-form-item>
              <el-form-item class="mg-l-10">
                <el-input clearable v-model="search" placeholder="联盟用户"></el-input>
                <el-button type="primary" @click="searchFn">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-header>

        <el-row v-if="activeName === '1' || activeName === '2'">
          <el-col>
            <ve-line v-if="activeName === '1'" :data="chartData" :settings="chartSettings" :extend="chartExtend"></ve-line>
            <ve-line v-else-if="activeName === '2'" :data="OrderChartData" :settings="OrderChartSettings"></ve-line>
            <el-col class="tips" v-show="activeName === '2'">图表数据为减去实际退款额后的数据</el-col>
          </el-col>
        </el-row>

        <el-row v-if="activeName === '1'">
          <el-col>
            <el-table :data="tableData" key="tableData">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="registerCount" label="注册人数">
              </el-table-column>
              <el-table-column prop="shareRegisterNumber" label="分享注册数">
              </el-table-column>
              <el-table-column prop="remarks" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row v-else-if="activeName === '2'">
          <el-col>
            <el-table :data="OrderData" key="OrderData">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="amount" label="充值金额">
              </el-table-column>
              <el-table-column prop="rechargeMoney" label="充值退款金额">
              </el-table-column>
              <el-table-column prop="salesAmount" label="消费金额">
              </el-table-column>
              <el-table-column prop="returnAmount" label="消费退款金额">
              </el-table-column>
              <el-table-column prop="note" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row v-else-if="activeName === '3'">
          <el-col>
            <el-table :data="reportData.list" key="reportData">
              <el-table-column prop="userPhone" label="京店联盟用户">
              </el-table-column>
              <el-table-column prop="recharge" label="充值金额">
              </el-table-column>
              <el-table-column prop="lastMonthRecharge" label="上月未消费充值金额">
              </el-table-column>
              <el-table-column prop="consume" label="消费金额">
              </el-table-column>
              <el-table-column prop="ratio" label="分佣比例">
              </el-table-column>
              <el-table-column prop="amount" label="京店联盟用户佣金">
              </el-table-column>
              <el-table-column prop="discount" label="商家优惠金额">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>

      <el-row type="flex" class="row-bg"justify="end" v-if="activeName === '1'">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>

      <el-row type="flex" class="row-bg"justify="end" v-else-if="activeName === '2'">
        <el-col class="page">
          <el-pagination
            v-show="OrderPage.total"
            @size-change="OrderSizeChange"
            @current-change="OrderCurrentChange"
            :current-page="OrderPage.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="OrderPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="OrderPage.total">
          </el-pagination>
        </el-col>
      </el-row>

      <el-row type="flex" class="row-bg"justify="end" v-else-if="activeName === '3'">
        <el-col class="page">
          <el-pagination
            v-show="reportPage.total"
            @size-change="reportSizeChange"
            @current-change="reportCurrentChange"
            :current-page="reportPage.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="reportPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="reportPage.total">
          </el-pagination>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import report from 'api/report'
import untils from 'js/untils'

export default {
  name: 'ProductCPS',
  data () {
    this.chartExtend = {
      yAxis (v) {
        v.forEach(item => {
          item.minInterval = 1
        })
        return v
      }
    }
    this.chartSettings = {
      labelMap: {
        allRegisterNumber: '全部注册人数',
        shareRegisterNumber: '分享注册人数'
      }
    }
    this.OrderChartSettings = {
      labelMap: {
        amount: '充值金额',
        salesAndReturnAmount: '消费金额'
      }
    }
    return {
      activeName: '1',
      allAcount: 0,
      thisMonthMoney: 0,
      thisMonthSaleMoney: 0,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      OrderPage: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      chartData: {
        columns: ['date', 'allRegisterNumber', 'shareRegisterNumber'],
        rows: []
      },
      tableData: [],
      OrderChartData: {
        columns: [],
        rows: []
      },
      OrderData: [],
      search: '',
      date: '',
      reportData: {},
      reportPage: {
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    }
  },
  methods: {
    chartDataLoad () {
      report.reportFromRegister().then(res => {
        if (res.code === 200) {
          this.allAcount = res.data.allAcount
          res.data.orderList = res.data.orderList.reverse()
          this.chartData.rows = res.data.orderList
        } else {
          this.allAcount = 0
          this.chartData.columns = []
          this.chartData.rows = []
        }
      })
    },
    tableDataLoad () {
      report.reportFromRegisterEveryDay({ page: this.page.pageNo, size: this.page.pageSize }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.orderList
          this.page.pageNo = res.page
          this.page.total = res.allCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    },
    OrderChartDataLoad () {
      report.reportOrder().then(res => {
        if (res.code === 200) {
          this.thisMonthSaleMoney = res.orderMoney
          this.thisMonthMoney = res.money
          this.OrderChartData.columns = res.title
          res.data = res.data.reverse()
          this.OrderChartData.rows = res.data
        } else {
          this.thisMonthSaleMoney = 0
          this.thisMonthMoney = 0
          this.OrderChartData.columns = []
          this.OrderChartData.rows = []
        }
      })
    },
    OrderDataLoad () {
      report.reportOrderEveryDay({ page: this.OrderPage.pageNo, size: this.OrderPage.pageSize }).then(res => {
        if (res.code === 200) {
          this.OrderData = res.data
          this.OrderPage.pageNo = res.page
          this.OrderPage.total = res.allCount
        } else {
          this.OrderData = []
          this.OrderPage.pageNo = 1
          this.OrderPage.total = null
        }
      })
    },
    reportDataLoad () {
      report.reckonReport({ page: this.reportPage.pageNo, size: this.reportPage.pageSize, search: this.search, date: this.date }).then(res => {
        if (res.code === 200) {
          this.reportData = res.data
          this.reportPage.pageNo = res.page
          this.reportPage.total = res.allCount
        } else {
          this.reportData = {}
          this.reportPage.pageNo = 1
          this.reportPage.total = null
        }
      })
    },
    searchFn() {
      this.reportPage.pageNo = 1
      this.reportDataLoad()
    },

    getdatatime(){
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth()
      month = month < 10 ? `0${month}` : month
      this.date = `${year}-${month}`
    },
    tabSwitch (val) {
      if (val.name === '1') {
        this.chartDataLoad()
        this.tableDataLoad()
      } else if (val.name === '2') {
        this.OrderDataLoad()
        this.OrderChartDataLoad()
      } else if (val.name === '3') {
        this.getdatatime()
        this.reportDataLoad()
      }
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.tableDataLoad()
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.tableDataLoad()
    },
    OrderSizeChange (val) {
      this.OrderPage.pageSize = val
      this.OrderDataLoad()
    },
    OrderCurrentChange (val) {
      this.OrderPage.pageNo = val
      this.OrderDataLoad()
    },
    reportSizeChange (val) {
      this.reportPage.pageSize = val
      this.reportDataLoad()
    },
    reportCurrentChange (val) {
      this.reportPage.pageNo = val
      this.reportDataLoad()
    }
  },
  mounted () {
    this.chartDataLoad()
    this.tableDataLoad()
  }
}
</script>

<style lang="scss" scoped>
  .header {
    margin-bottom: 20px;
    .el-input {
      width: 75%;
      margin-right: 10px;
    }
    .w200 {
      width: 200px;
    }
  }
  .tips {
    text-align: center;
    font-size: 13px;
    color: #333333;
    margin-bottom: 20px;
  }

  .main3 {
    .el-col {
      text-align: center;
      h1, p {
        margin: 5px 0;
      }
    }
  }

</style>
