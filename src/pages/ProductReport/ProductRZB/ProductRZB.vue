<template>
  <el-container>
    <el-main>
      <el-card class="box-card">
        <div slot="header">
          <h4>资料提交来源</h4>
        </div>
        <el-table :data="tableData">
          <el-table-column prop="time">
            <template slot-scope="scope">
              <span :class="scope.$index === 0 ? 'bold' : ''">{{ scope.row.time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="园区推广量">
            <template slot-scope="scope">
              <span class="bold">{{ scope.row.yq }}</span>
              <span v-show="scope.row.yqSort !== 1 && scope.row.yqSort !== undefined" :class="scope.row.yqSort === 2 ? ['el-icon-caret-top', 'red'] : 'el-icon-caret-bottom'"></span>
            </template>
          </el-table-column>
          <el-table-column label="百度推广量">
            <template slot-scope="scope">
              <span class="bold">{{ scope.row.bd }}</span>
              <span v-show="scope.row.bdSort !== 1 && scope.row.bdSort !== undefined" :class="scope.row.bdSort === 2 ? ['el-icon-caret-top', 'red'] : 'el-icon-caret-bottom'"></span>
            </template>
          </el-table-column>
          <el-table-column label="京店宝自然流量">
            <template slot-scope="scope">
              <span class="bold">{{ scope.row.jdb }}</span>
              <span v-show="scope.row.jdbSort !== 1 && scope.row.jdbSort !== undefined" :class="scope.row.jdbSort === 2 ? ['el-icon-caret-top', 'red'] : 'el-icon-caret-bottom'"></span>
            </template>
          </el-table-column>
          <el-table-column label="其他">
            <template slot-scope="scope">
              <span class="bold">{{ scope.row.other }}</span>
              <span v-show="scope.row.otherSort !== 1 && scope.row.otherSort !== undefined" :class="scope.row.otherSort === 2 ? ['el-icon-caret-top', 'red'] : 'el-icon-caret-bottom'"></span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-row class="mg-t-20" type="flex" justify="end">
        <el-date-picker @change="chartLoad" v-model="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="请输入查询时间" size="small" :clearable="false">
        </el-date-picker>
      </el-row>

      <el-row>
        <h4>园区推广</h4>
        <el-col>
          <span class="mg-r-10">提交总量：{{ parkCount.submitNumber || 0 }}</span>
          <span>入驻总量：{{ parkCount.enterNumber || 0 }}</span>
        </el-col>
        <el-col>
          <ve-line :data="parkChart" :settings="chartSettings"></ve-line>
        </el-col>
      </el-row>

      <el-row>
        <h4>百度推广</h4>
        <el-col>
          <span class="mg-r-10">提交总量：{{ baiduCount.submitNumber || 0 }}</span>
          <span>入驻总量：{{ baiduCount.enterNumber || 0 }}</span>
        </el-col>
        <el-col>
          <ve-line :data="baiduChart" :settings="chartSettings"></ve-line>
        </el-col>
      </el-row>

      <el-row>
        <h4>京店宝自然流量</h4>
        <el-col>
          <span class="mg-r-10">提交总量：{{ naturalCount.submitNumber || 0 }}</span>
          <span>入驻总量：{{ naturalCount.enterNumber || 0 }}</span>
        </el-col>
        <el-col>
          <ve-line :data="naturalChart" :settings="chartSettings"></ve-line>
        </el-col>
      </el-row>

      <el-row>
        <h4>其他</h4>
        <el-col>
          <span class="mg-r-10">提交总量：{{ otherCount.submitNumber || 0 }}</span>
          <span>入驻总量：{{ otherCount.enterNumber || 0 }}</span>
        </el-col>
        <el-col>
          <ve-line :data="otherChart" :settings="chartSettings"></ve-line>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import enter from 'api/enter'

export default {
  name: 'ProductRZB',
  data () {
    return {
      date: [],
      tableData: [],
      chartSettings: {
        labelMap: {
          submitNumber: '提交量',
          enterNumber: '入驻量'
        }
      },
      parkCount: {
        submitNumber: 0,
        enterNumber: 0
      },
      parkChart: {
        columns: ['date', 'submitNumber', 'enterNumber'],
        rows: []
      },
      baiduCount: {
        submitNumber: 0,
        enterNumber: 0
      },
      baiduChart: {
        columns: ['date', 'submitNumber', 'enterNumber'],
        rows: []
      },
      naturalCount: {
        submitNumber: 0,
        enterNumber: 0
      },
      naturalChart: {
        columns: ['date', 'submitNumber', 'enterNumber'],
        rows: []
      },
      otherCount: {
        submitNumber: 0,
        enterNumber: 0
      },
      otherChart: {
        columns: ['date', 'submitNumber', 'enterNumber'],
        rows: []
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近31天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    }
  },
  methods: {
    get31Day () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
      end.setTime(end.getTime() - 3600 * 1000 * 24)
      this.date = [start, end]
    },
    async tableLoad() {
      const { code, data } = await enter.getCommitEnterNumber()
      if (code === 200) {
        const { Channel0, Channel1, Channel2, Channel3, commit } = data
        this.tableData = commit
        this.parkCount = { submitNumber: Channel1.submit, enterNumber: Channel1.enter }
        this.baiduCount = { submitNumber: Channel2.submit, enterNumber: Channel2.enter }
        this.naturalCount = { submitNumber: Channel0.submit, enterNumber: Channel0.enter }
        this.otherCount = { submitNumber: Channel3.submit, enterNumber: Channel3.enter }
      } else {
        this.tableData = []
        this.parkCount = this.baiduCount = this.naturalCount = this.otherCount =  { submitNumber: 0, enterNumber: 0 }
      }
    },
    async chartLoad() {
      const [ startDate, endDate ] = this.date && this.date.length === 2 ? this.date : ['', '']
      const { code, data } = await enter.listSummary({ startDate, endDate })
      if (code === 200) {
        const { channel0, channel1, channel2, channel3 } = data
        this.parkChart.rows = channel1
        this.baiduChart.rows = channel2
        this.naturalChart.rows = channel0
        this.otherChart.rows = channel3
      } else {
        this.parkChart.rows = []
        this.baiduChart.rows = []
        this.naturalChart.rows = []
        this.otherChart.rows = []
      }
    }
  },
  async created() {
    await this.get31Day()
    this.tableLoad()
    this.chartLoad()
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    /deep/ .el-card__header {
      border-bottom: none;
    }
    /deep/ .el-card__body {
      padding: 0 20px 10px;
    }
    h4 {
      margin: 0;
    }
    .red {
      color: red;
    }
  }
  .el-row {
    padding: 0 20px;
    .mg-r-10 {
      margin-right: 10px;
    }
  }
</style>
