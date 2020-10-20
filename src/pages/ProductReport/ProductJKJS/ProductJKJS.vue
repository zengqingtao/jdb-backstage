<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName" @tab-click="tabSwitch">
        <el-tab-pane label="消费情况" name="1"></el-tab-pane>
        <el-tab-pane label="机构达人入驻" name="2"></el-tab-pane>
      </el-tabs>

      <el-radio-group v-show="activeName === '1'" v-model="type" size="small" @change="typeChange">
        <el-radio-button label="套餐"></el-radio-button>
        <el-radio-button label="个体"></el-radio-button>
      </el-radio-group>

      <el-main>
        <el-row v-if="activeName === '2'">
          <el-col :span="4">
            <b>机构入驻：{{ org || 0 }}</b>
          </el-col>
          <el-col :span="4">
            <b>达人入驻：{{ personal || 0 }}</b>
          </el-col>
          <el-col :span="4">
            <b>达人量：{{ total || 0 }}</b>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <ve-line :data="chartData" :settings="chartSettings"></ve-line>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-table :data="tableData" v-if="activeName === '1'">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="orderCount" label="订单量">
              </el-table-column>
              <el-table-column prop="articleCount" label="购买文章量">
              </el-table-column>
              <el-table-column prop="payMoney" label="付费金额">
              </el-table-column>
              <el-table-column prop="remark" label="备注">
              </el-table-column>
            </el-table>
            <el-table :data="tableData" v-else-if="activeName === '2'">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="orgCount" label="机构入驻量">
              </el-table-column>
              <el-table-column prop="personalCount" label="达人入驻量">
              </el-table-column>
              <el-table-column prop="totalCount" label="添加达人量">
              </el-table-column>
              <el-table-column prop="remark" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>

      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            layout="total, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import report from 'api/report'
import talent from 'api/talent'

export default {
  name: 'ProductJKJS',
  data () {
    this.chartSettings = {
      labelMap: {
        orderCount: '订单量',
        totalCount: '达人量'
      }
    }
    return {
      type: '套餐',
      org: 0,
      personal: 0,
      total: 0,
      activeName: '1',
      tableData: [],
      page: {
        pageNo: 1,
        total: null
      },
      chartData: {
        columns: [],
        rows: []
      },
    }
  },
  methods: {
    typeChange (val) {
      this.page.pageNo = 1
      if (val === '套餐') {
        this.loadSetMealChart()
        this.loadSetMealTable()
      } else {
        this.loadJiShiChart()
        this.loadJiShiTable()
      }
    },
    tabSwitch (val) {
      this.page.pageNo = 1
      this.page.total = null
      if (val.name === '1') {
        if (this.type === '套餐') {
          this.loadSetMealChart()
          this.loadSetMealTable()
        } else {
          this.loadJiShiChart()
          this.loadJiShiTable()
        }
      } else if (val.name === '2') {
        this.loadPersonalChart()
        this.loadPersonalTable()
      }
    },
    loadJiShiChart () {
      report.getJiShi30DayCount().then(res => {
        if (res.code === 200) {
          res.data = res.data.reverse()
          this.chartData.columns = ['date', 'orderCount']
          this.chartData.rows = res.data
        } else {
          this.chartData.columns = []
          this.chartData.rows = []
        }
      })
    },
    loadJiShiTable () {
      report.getJiShiDailyCount({ page: this.page.pageNo }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.results
          this.page.pageNo = res.data.pageNo
          this.page.total = res.data.totalCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    },
    loadPersonalChart () {
      report.get30DaysDarenDailyCount().then(res => {
        if (res.code === 200) {
          this.chartData.columns = ['date', 'totalCount']
          res.data.list = res.data.list.reverse()
          this.chartData.rows = res.data.list
          this.org = res.data.org
          this.personal = res.data.personal
          this.total = res.data.total
        } else {
          this.org = 0
          this.personal = 0
          this.total = 0
          this.chartData.columns = []
          this.chartData.rows = []
        }
      })
    },
    loadPersonalTable () {
      report.getDarenDailyCount({ page: this.page.pageNo }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.results
          this.page.pageNo = res.data.pageNo
          this.page.total = res.data.totalCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    },
    async loadSetMealChart () {
      const res = await talent.getConsume30DaysDailyCount()
      if (res.code === 200) {
        res.data = res.data.reverse()
        this.chartData.columns = ['date', 'orderCount']
        this.chartData.rows = res.data
      } else {
        this.chartData.columns = []
        this.chartData.rows = []
      }
    },
    async loadSetMealTable () {
      const res = await talent.listDailyCount({ page: this.page.pageNo })
      if (res.code === 200) {
        this.tableData = res.data.results
        this.page.pageNo = res.data.pageNo
        this.page.total = res.data.totalCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      if (this.activeName === '1') {
        this.type === '套餐' ? this.loadSetMealTable() : this.loadJiShiTable()
      } else if (this.activeName === '2') {
        this.loadPersonalTable()
      }
    },
  },
  created () {
    this.loadSetMealChart()
    this.loadSetMealTable()
  }
}
</script>

<style lang="scss" scoped>

</style>
