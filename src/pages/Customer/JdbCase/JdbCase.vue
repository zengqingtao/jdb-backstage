<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="7" class="text-right">
          <el-input v-model="search" placeholder="请输入sku" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="parent-main" v-for="(item, index) in tableData" :key="index">
      <el-card class="child-main">
        <el-row type="flex" justify="space-between" class="row-bg mg-t-10">
          <el-col :span="10" :offset="1">
            <el-col :span="7" class="titleImg">
              <img :src="item.jdbCase.url" width="80" height="80">
              <div class="seven" v-if="item.jdbCase.haveRelease === 1">近7天发布过人气</div>
            </el-col>
            <p class="mg-t-0"><b>{{ item.jdbCase.title }}</b></p>
            <el-col :span="10">
              <p class="mg0">sku:<span>{{ item.jdbCase.sku }}</span></p>
              <p>关键词:<span>{{ item.jdbCase.keyWord }}</span></p>
            </el-col>
          </el-col>
        </el-row>

        <el-row class="mg-t-10">
          <el-col>
            <el-tabs type="card" v-model="item.type" @tab-click="typeChange">
              <el-tab-pane label="近7天" name="0">
              </el-tab-pane>
              <el-tab-pane label="近10天" name="1">
              </el-tab-pane>
              <el-tab-pane label="近15天" name="2">
              </el-tab-pane>
            </el-tabs>
            <ve-line v-if="item.type === '0'" :data="item.chartData7" :settings="chartSettings" :extend="chartExtend" ></ve-line>
            <ve-line v-else-if="item.type === '1'" :data="item.chartData10" :settings="chartSettings" :extend="chartExtend" ></ve-line>
            <ve-line v-else-if="item.type === '2'" :data="item.chartData15" :settings="chartSettings" :extend="chartExtend" ></ve-line>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-table :data="item.jdbCaseMonitor15.data" height="300">
              <el-table-column label="时间">
                <template slot-scope="scope">{{ timeFn(scope.row.rankingTime) }}</template>
              </el-table-column>
              <el-table-column prop="pcPosition" label="电脑端位置">
              </el-table-column>
              <el-table-column prop="pcRanking" label="电脑端排名">
              </el-table-column>
              <el-table-column prop="phonePosition" label="手机端位置">
              </el-table-column>
              <el-table-column prop="phoneRanking" label="手机端排名">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
    </el-main>

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
  </el-container>
</template>

<script>
import jdbCase from 'api/jdbCase'
import untils from 'js/untils'

export default {
  name: 'JdbCase',
  data () {
    this.chartExtend = {
      tooltip (v) {
        v.formatter = (val) => {
          let temp1 = ''
          let temp2 = ''
          val.forEach(item => {
            if (item.seriesIndex === 0) {
              if (!Number.isInteger(item.value[1])) {
                temp1 = `<div>${item.value[0]}</div><div>${item.marker}PC端排名: 不在查询范围内</div>`
              } else {
                temp1 = `<div>${item.value[0]}</div><div>${item.marker}PC端排名: ${item.value[1]}</div>`
              }
            } else if (item.seriesIndex === 1) {
              if (!Number.isInteger(item.value[1])) {
                temp2 = `<div>${item.marker}移动端排名: 不在查询范围内</div>`
              } else {
                temp2 = `<div>${item.marker}移动端排名: ${item.value[1]}</div>`
              }
            }
          })
          let title = temp1 + temp2
          return title
        }
        return v
      },
      yAxis (v) {
        v.forEach((item, index) => {
          item.axisLabel.formatter = (val, index) => {
            let arr = []
            if (index === 0 && val < 1 ) {
              return ['']
            } else if (index === 0 && val > 1) {
              return [`第${Math.floor(val)}名`]
            } else if (!Number.isInteger(val)) {
              arr.push(`不在查询范围内`)
            } else {
              arr.push(`第${val}名`)
            }
            return arr
          }
          item.inverse = true
          item.minInterval = 1
          item.min = 'dataMin'
          item.max = 'dataMax'
          if (index === 0) {
            item.name = '排名'
            item.nameLocation = 'start'
            item.nameTextStyle = {
              fontSize: 16,
              fontWeight: 'bold',
            }
          }
        })
        return v
      }
    }
    this.chartSettings = {
      metrics: ['pcRanking', 'phoneRanking'],
      labelMap: {
        pcRanking: 'PC端排名',
        phoneRanking: '移动端排名'
      }
    }
    return {
      search: '',
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    }
  },
  methods: {
    typeChange () {
      this.$forceUpdate()
    },
    timeFn (val) {
      return untils.formatDay(val)
    },
    async pageLoad () {
      const res = await jdbCase.listJdbCase({ page: this.page.pageNo, size: this.page.pageSize, search: this.search })
      if (res.code === 200) {
        this.tableData = res.data
        this.page.pageNo = res.page
        this.page.total = res.allCount
        this.tableData.forEach(item => {
          item.type = '0'
          item.chartData7 = {}
          item.chartData7.columns = ['rankingTime', 'pcRanking', 'phoneRanking']
          item.chartData7.rows = []
          item.chartData10 = {}
          item.chartData10.columns = ['rankingTime', 'pcRanking', 'phoneRanking']
          item.chartData10.rows = []
          item.chartData15 = {}
          item.chartData15.columns = ['rankingTime', 'pcRanking', 'phoneRanking']
          item.chartData15.rows = []
          let maxArr7 = []
          let max7 = 0
          let maxArr10 = []
          let max10 = 0
          let maxArr15 = []
          let max15 = 0
          item.jdbCaseMonitor7.data.forEach(data => {
            maxArr7.push(data.pcRanking)
            maxArr7.push(data.phoneRanking)
          })
          item.jdbCaseMonitor10.data.forEach(data => {
            maxArr10.push(data.pcRanking)
            maxArr10.push(data.phoneRanking)
          })
          item.jdbCaseMonitor15.data.forEach(data => {
            maxArr15.push(data.pcRanking)
            maxArr15.push(data.phoneRanking)
          })
          maxArr7 = Array.from(new Set(maxArr7))
          max7 = Math.max(...maxArr7) + 1.1
          maxArr10 = Array.from(new Set(maxArr10))
          max10 = Math.max(...maxArr10) + 1.1
          maxArr15 = Array.from(new Set(maxArr15))
          max15 = Math.max(...maxArr15) + 1.1
          item.jdbCaseMonitor7.data.forEach(data => {
            let list = {}
            list.rankingTime = this.timeFn(data.rankingTime)
            list.pcRanking = data.pcRanking === 0 ? max7 : data.pcRanking
            list.phoneRanking = data.phoneRanking === 0 ? max7 : data.phoneRanking
            item.chartData7.rows.unshift(list)
          })
          item.jdbCaseMonitor10.data.forEach(data => {
            let list = {}
            list.rankingTime = this.timeFn(data.rankingTime)
            list.pcRanking = data.pcRanking === 0 ? max10 : data.pcRanking
            list.phoneRanking = data.phoneRanking === 0 ? max10 : data.phoneRanking
            item.chartData10.rows.unshift(list)
          })
          item.jdbCaseMonitor15.data.forEach(data => {
            let list = {}
            list.rankingTime = this.timeFn(data.rankingTime)
            list.pcRanking = data.pcRanking === 0 ? max15 : data.pcRanking
            list.phoneRanking = data.phoneRanking === 0 ? max15 : data.phoneRanking
            item.chartData15.rows.unshift(list)
          })
        })
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.pageLoad()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    }
  },
  created () {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  @import "~styles/mixin";
  .seven {
    border: 1px solid red;
    text-align: center;
    color: red;
    font-weight: 600;
    font-size: 12px;
    padding: 5px;
    margin-left: -15px;
    width: 110px;
  }
  .el-tabs__item.is-active {
    background-color: #3489fe;
  }
</style>