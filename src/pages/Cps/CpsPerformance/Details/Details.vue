<template>
  <el-container>
    <el-main class="main">
      <div class="Moth titleName">{{ titleName }}</div>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="本月业绩" name="1">
          <el-row>
            <el-col>
              <div class="Moth">本月消费累计金额：{{ MothTotalMoney || 0 }} 元</div>
            </el-col>
          </el-row>
          <el-row v-if="tableData && tableData.length > 0">
            <el-col>
              <ve-line :data="chartData" :settings="chartSettings"></ve-line>
            </el-col>
            <el-col class="tips">图表数据为减去实际退款额后的数据</el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-table :data="tableData">
                <el-table-column prop="date" label="充值日期">
                </el-table-column>
                <el-table-column label="充值金额">
                  <template slot-scope="scope">
                    {{ scope.row.amount ?  scope.row.amount : 0 }}
                  </template>
                </el-table-column>
                <el-table-column label="充值客户数">
                  <template slot-scope="scope">
                    {{ scope.row.userIdNum ?  scope.row.userIdNum : 0 }}
                  </template>
                </el-table-column>
                <el-table-column label="充值退款金额">
                  <template slot-scope="scope">
                    {{ scope.row.rechargeMoney ?  scope.row.rechargeMoney : 0 }}
                  </template>
                </el-table-column>
                <el-table-column label="充值退款客户数">
                  <template slot-scope="scope">
                    {{ scope.row.rechargeNum ?  scope.row.rechargeNum : 0 }}
                  </template>
                </el-table-column>
                <el-table-column label="消费金额">
                  <template slot-scope="scope">
                    {{ scope.row.salesAmount ?  scope.row.salesAmount : 0 }}
                  </template>
                </el-table-column>
                <el-table-column label="消费客户数">
                  <template slot-scope="scope">
                    {{ scope.row.userAmountNum ?  scope.row.userAmountNum : 0 }}
                  </template>
                </el-table-column>
                <el-table-column label="消费退款金额">
                  <template slot-scope="scope">
                    {{ scope.row.returnAmount ?  scope.row.returnAmount : 0 }}
                  </template>
                </el-table-column>
                <el-table-column label="消费退款客户数">
                  <template slot-scope="scope">
                    {{ scope.row.returnUsers ?  scope.row.returnUsers : 0 }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg"justify="end">
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
        </el-tab-pane>
        <el-tab-pane label="历史业绩" name="2">
          <div style="margin-bottom: 20px">
            <el-button type="primary" size="small" plain @click="prevYear">上一年</el-button>
            <el-button type="primary" size="small" @click="toYear">今年</el-button>
            <el-button type="primary" size="small" plain @click="nextYear">下一年</el-button>
          </div>
          <el-table :data="historicalData">
            <el-table-column prop="month" label="月份">
            </el-table-column>
            <el-table-column label="充值金额">
              <template slot-scope="scope">
                {{ scope.row.amount ?  scope.row.amount : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="充值客户数">
              <template slot-scope="scope">
                {{ scope.row.userIdNum ?  scope.row.userIdNum : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="充值退款金额">
              <template slot-scope="scope">
                {{ scope.row.rechargeMoney ?  scope.row.rechargeMoney : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="充值退款客户数">
              <template slot-scope="scope">
                {{ scope.row.rechargeNum ?  scope.row.rechargeNum : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="消费金额">
              <template slot-scope="scope">
                {{ scope.row.salesAmount ?  scope.row.salesAmount : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="消费客户数">
              <template slot-scope="scope">
                {{ scope.row.userAmountNum ?  scope.row.userAmountNum : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="消费退款金额">
              <template slot-scope="scope">
                {{ scope.row.returnAmount ?  scope.row.returnAmount : 0 }}
              </template>
            </el-table-column>
            <el-table-column label="消费退款客户数">
              <template slot-scope="scope">
                {{ scope.row.returnUsers ?  scope.row.returnUsers : 0 }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import cps from 'api/cps'

export default {
  name: 'Details',
  data () {
    this.chartSettings = {
      labelMap: {
        salesAndReturnAmount: '本日消费金额',
      }
    }
    return {
      titleName: '', // BD详情姓名
      activeName: '1',
      MothTotalMoney: '', // 本月累计金额
      chartData: { // 线状图数据
        columns: ['date', 'salesAndReturnAmount'],
        rows: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      historicalForm: {
        invitationCode: '',
        year: ''
      },
      historicalData: [] // 历史业绩表格数据
    }
  },
  computed: {
    tableData () {
      if (!this.chartData.rows.length) return []
      let page = this.page.pageNo
      let size = this.page.pageSize
      let list = this.chartData.rows.filter((item, index) => {
        return index >= (size * (page - 1)) && index < (size * page)
      })
      return list
    }
  },
  methods: {
    ThisMonthLoad () {
      cps.cpsGetThisMonth({ invitationCode: this.historicalForm.invitationCode }).then(res => {
        if (res && res.code === 200) {
          this.MothTotalMoney = res.orderMoney
          this.chartData.rows = res.data
          this.page.total = res.data.length
        } else {
          this.MothTotalMoney = 0
          this.chartData.rows = []
          this.page.total = null
          this.$message.error(res.msg)
        }
      })
    },
    Historical () {
      cps.cpsHistorical(this.historicalForm).then(res => {
        if (res && res.code === 200) {
          this.historicalData = res.data
        } else {
          this.historicalData = []
        }
      })
    },
    nextYear () {
      this.historicalForm.year = Number(this.historicalForm.year) + 1
      this.Historical()
    },
    toYear () {
      this.historicalForm.year = new Date().getFullYear()
      this.Historical()
    },
    prevYear () {
      this.historicalForm.year = Number(this.historicalForm.year) - 1
      this.Historical()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
    },
    handleSizeChange (val) {
      this.page.pageSize = val
    }
  },
  created () {
    if (this.$route.query.invitationCode && this.$route.query.name) {
      this.historicalForm.invitationCode = this.$route.query.invitationCode
      this.titleName = this.$route.query.name
    }
  },
  mounted () {
    this.historicalForm.year = new Date().getFullYear()
    this.ThisMonthLoad()
    this.Historical()
  },
  destroyed () {
    Object.assign(this.$data, {
      titleName: '', // BD详情姓名
      activeName: '1',
      MothTotalMoney: '', // 本月累计金额
      chartData: { // 线状图数据
        columns: ['date', 'salesAndReturnAmount'],
        rows: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      historicalForm: {
        invitationCode: '',
        year: ''
      },
      historicalData: [] // 历史业绩表格数据
    })
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 30px 0 0 0;
    .Moth {
      font-size: 22px;
      color: #333333;
    }
    .titleName {
      margin: 0 0 10px 10px;
    }
    .el-tabs__item.is-active {
      background-color: #3489fe;
    }
  }
  .tips {
    text-align: center;
    font-size: 13px;
    color: #333333;
    margin-bottom: 20px;
  }
</style>