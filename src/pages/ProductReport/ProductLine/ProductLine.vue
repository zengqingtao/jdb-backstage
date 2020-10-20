<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="渠道分析" name="1"></el-tab-pane>
      </el-tabs>

      <el-header class="header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
            <el-form>
              <el-form-item label="当前日期:">
                <el-date-picker
                  @change="loadLineChart"
                  v-model="timer"
                  type="month"
                  format="yyyy-MM"
                  value-format="yyyy-MM"
                  :picker-options="pickerOptions"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-card>
          <el-row>
            <el-col class="text-center mg-b-5">
              <h2>京店宝渠道充值占比</h2>
            </el-col>
          </el-row>
          <VePie :data="chartData" :extend="chartExtend"></VePie>
        </el-card>
      </el-main>

    </el-main>
  </el-container>
</template>

<script>
import report from 'api/report'

export default {
  name: 'ProductLine',
  data () {
    this.chartExtend = {
      tooltip (v) {
        v.formatter = (val) => {
          let title = `<div>${val.marker}<span>${val.data.name}</span></div>`
          return title
        }
        return v
      },
    }
    return {
      activeName: '1',
      dateList: [],
      timer: '',
      chartData: {
        columns: ['title', 'money'],
        rows: []
      },
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < new Date('2018-07')
        }
      }
    }
  },
  methods: {
    loadLineChart () {
      report.channelAnalysis({ date: this.timer }).then(res => {
        if (res.code === 200) {
          this.chartData.rows = res.data.list
        } else {
          this.$message({
            message: res.msg,
            type: 'info'
          })
          this.chartData.rows = []
        }
      })
    },
    loadDate () {
      return new Promise((resolve => {
        report.getDateList().then(res => {
          if (res.code === 200) {
            this.dateList = res.data
            this.timer = res.data[0]
            resolve(this.loadLineChart())
          } else {
            this.dateList = []
          }
        })
      }))
    }
  },
  mounted () {
    this.loadDate()
  }
}
</script>

<style lang="scss" scoped>

</style>