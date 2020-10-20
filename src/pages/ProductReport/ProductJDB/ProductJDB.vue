<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName" @tab-click="tabSwitch">
        <el-tab-pane label="网站流量" name="0">
          <el-card class="box-card">
            <div slot="header">
              <h4>今日流量</h4>
            </div>
            <el-table :data="ToDayData">
              <el-table-column prop="time">
              </el-table-column>
              <el-table-column label="浏览量(PV)">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" placement="top" v-if="scope.row.date1">
                    <div slot="content">{{ `峰值日：${scope.row.date1}` }}</div>
                    <span :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val1}` : scope.row.pv_count }}</span>
                  </el-tooltip>
                  <span v-else :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val1}` : scope.row.pv_count }}</span>
                  <span v-show="scope.row.flag1 === 1" class="el-icon-caret-top red"></span>
                </template>
              </el-table-column>
              <el-table-column label="访客数(UV)">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" placement="top" v-if="scope.row.date2">
                    <div slot="content">{{ `峰值日：${scope.row.date2}` }}</div>
                    <span :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val2}` : scope.row.visitor_count }}</span>
                  </el-tooltip>
                  <span v-else :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val2}` : scope.row.visitor_count }}</span>
                  <span v-show="scope.row.flag2 === 1" class="el-icon-caret-top red"></span>
                </template>
              </el-table-column>
              <el-table-column label="IP数">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" placement="top" v-if="scope.row.date3">
                    <div slot="content">{{ `峰值日：${scope.row.date3}` }}</div>
                    <span :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val3}` : scope.row.ip_count }}</span>
                  </el-tooltip>
                  <span v-else :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val3}` : scope.row.ip_count }}</span>
                  <span v-show="scope.row.flag3 === 1" class="el-icon-caret-top red"></span>
                </template>
              </el-table-column>
              <el-table-column label="跳出率">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" placement="top" v-if="scope.row.date4">
                    <div slot="content">{{ `峰值日：${scope.row.date4}` }}</div>
                    <span :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? scope.row.val4 === '--' ? '--' : `${scope.row.val4}%` : scope.row.bounce_ratio === '--' ? '--' : `${scope.row.bounce_ratio}%` }}</span>
                  </el-tooltip>
                  <span v-else :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? scope.row.val4 === '--' ? '--' : `${scope.row.val4}%` : scope.row.bounce_ratio === '--' ? '--' : `${scope.row.bounce_ratio}%` }}</span>
                  <span v-show="scope.row.flag4 === 1" class="el-icon-caret-top red"></span>
                </template>
              </el-table-column>
              <el-table-column label="平均访问时长">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" placement="top" v-if="scope.row.date5">
                    <div slot="content">{{ `峰值日：${scope.row.date5}` }}</div>
                    <span :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val5}` : scope.row.avg_visit_time }}</span>
                  </el-tooltip>
                  <span v-else :class="scope.$index === 0 ? 'bold' : ''">{{ scope.$index === 2 || scope.$index === 5 ? `${scope.row.val5}` : scope.row.avg_visit_time }}</span>
                  <span v-show="scope.row.flag5 === 1" class="el-icon-caret-top red"></span>
                </template>
              </el-table-column>
              <el-table-column label="转化次数">
                <template slot-scope="scope">
                  <span :class="scope.$index === 0 ? 'bold' : ''">--</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-row class="mg-t-20">
            <el-button-group>
              <el-button v-for="(item, index) of btnArr" :key="index" :type="btnActive === index ? 'primary': ''" @click="ChangeDate(index)" size="medium">{{ item }}</el-button>
            </el-button-group>
          </el-row>

          <el-row type="flex" :gutter="20" class="mg-t-10">
            <el-col>
              <el-card class="box-card mg-t-10">
                <div slot="header">
                  <h4>趋势图</h4>
                </div>
                <el-row type="flex" justify="space-between">
                  <el-col>
                    <el-select v-model="metrics" size="mini" placeholder="请选择" @change="loadPopChart">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col class="text-right font14" v-show="btnActive <= 1">
                    <div class="pull-right">
                      <span class="pull-left">对比：</span>
                      <el-checkbox v-model="checked1" @change="checkDate1">前一日</el-checkbox>
                      <el-checkbox v-model="checked7" @change="checkDate7">上周同期</el-checkbox>
                    </div>
                    <!--<el-radio-group v-model="contrast" @change="loadPopChart">-->
                      <!--<el-radio :label="0">当前日期</el-radio>-->
                      <!--<el-radio :label="1">前一日</el-radio>-->
                      <!--<el-radio :label="2">上周同期</el-radio>-->
                    <!--</el-radio-group>-->
                  </el-col>
                </el-row>
                <ve-line :colors="colors" :loading="BDChartLoading" class="mg-t-20" :data="BDChart" :extend="metrics === 'avg_visit_time' ? TimeExtend : metrics === 'bounce_ratio' ? PenExtend : chartExtend"></ve-line>
              </el-card>
            </el-col>

            <el-col>
              <el-card class="box-card mg-t-10">
                <div slot="header">
                  <h4>新老访客</h4>
                </div>
                <el-row class="userListInfo" type="flex" justify="space-around" align="middle">
                  <el-col>
                    <i class="userIcon iconfont icon-kehu_huaban"></i>
                  </el-col>
                  <el-col>
                    <p>新访客</p>
                    <p class="Percentage green">{{ Visitor.newVisitor.ratio || '-' }}%</p>
                  </el-col>
                  <el-col>
                    <p>老访客</p>
                    <p class="Percentage blue">{{ Visitor.oldVisitor.ratio || '-' }}%</p>
                  </el-col>
                </el-row>
                <table class="mg-t-20 userTable" border="1" cellspacing="0">
                  <tbody>
                    <tr>
                      <td>浏览量</td>
                      <td>{{ Visitor.newVisitor.pv_count }}</td>
                      <td>{{ Visitor.oldVisitor.pv_count }}</td>
                    </tr>
                    <tr>
                      <td>访客数</td>
                      <td>{{ Visitor.newVisitor.visitor_count }}</td>
                      <td>{{ Visitor.oldVisitor.visitor_count }}</td>
                    </tr>
                    <tr>
                      <td>跳出率</td>
                      <td>{{ Visitor.newVisitor.bounce_ratio || '-' }}%</td>
                      <td>{{ Visitor.oldVisitor.bounce_ratio || '-' }}%</td>
                    </tr>
                    <tr>
                      <td>平均访问时长</td>
                      <td>{{ Visitor.newVisitor.avg_visit_time || '00:00:00' }}</td>
                      <td>{{ Visitor.oldVisitor.avg_visit_time || '00:00:00' }}</td>
                    </tr>
                    <tr>
                      <td>平均访问页数</td>
                      <td>{{ Visitor.newVisitor.avg_visit_pages }}</td>
                      <td>{{ Visitor.oldVisitor.avg_visit_pages }}</td>
                    </tr>
                  </tbody>
                </table>
              </el-card>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane label="用户注册" name="1" />
        <el-tab-pane label="商品监控" name="2" />
        <!-- <el-tab-pane label="分享注册" name="3" /> -->
      </el-tabs>

      <el-main>
        <el-row v-if="activeName === '1'">
          <el-col :span="4">
            <b>总用户量：{{ registerAcount }}</b>
          </el-col>
        </el-row>

        <el-row v-else-if="activeName === '2'">
          <el-col :span="4">
            <b>排名监控总量：{{ rank }}</b>
          </el-col>
          <el-col :span="4">
            <b>竞品监控总量：{{ competitor }}</b>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <ve-line v-if="activeName === '1'" :data="registerChart" :settings="registerSettings" :extend="chartExtend" :legend-visible="false"></ve-line>
            <ve-line v-else-if="activeName === '2'" :data="itemChart" :settings="itemSettings" :extend="chartExtend"></ve-line>
            <ve-line v-else-if="activeName === '3'" :data="shareChart" :settings="shareSettings" :extend="chartExtend"></ve-line>
          </el-col>
        </el-row>

        <el-row v-if="activeName === '1'">
          <el-col>
            <el-table :data="registerData">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="amount" label="注册人数">
              </el-table-column>
              <el-table-column prop="remark" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row v-else-if="activeName === '2'">
          <el-col>
            <el-table :data="itemData">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="selfCount" label="排名监控量">
              </el-table-column>
              <el-table-column prop="competeCount" label="竞品监控量">
              </el-table-column>
              <el-table-column prop="remark" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row v-else-if="activeName === '3'">
          <el-col>
            <el-table :data="shareData">
              <el-table-column prop="date" label="日期">
              </el-table-column>
              <el-table-column prop="amount" label="分享量">
              </el-table-column>
              <el-table-column prop="otherAmount" label="注册量">
              </el-table-column>
              <el-table-column prop="remark" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>

      <el-row type="flex" class="row-bg"justify="end" v-show="activeName !== '0'">
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
import untils from 'js/untils'

export default {
  name: 'ProductJDB',
  data () {
    this.chartExtend = {
      yAxis (v) {
        v.forEach(item => {
          item.minInterval = 1
        })
        return v
      }
    }
    this.registerSettings = {
      labelMap: {
        amount: '用户注册量',
      }
    }
    this.itemSettings = {
      labelMap: {
        selfCount: '排名监控',
        competeCount: '竞品监控'
      }
    }
    this.colors = ['#0099FF', '#b9dcfd']
    this.TimeExtend = {
      tooltip (v) {
        v.formatter = (val) => {
          let temp1 = ''
          let temp2 = ''
          val.forEach(item => {
            if (item.seriesIndex === 0) {
              temp1 = `<div>${item.name}</div><div>${item.marker}${item.seriesName}: ${untils.getTime(item.value[1])}</div>`
            } else if (item.seriesIndex === 1) {
              temp2 = `<div>${item.marker}${item.seriesName}: ${untils.getTime(item.value[1])}</div>`
            }
          })
          let title = temp1 + temp2
          return title
        }
        return v
      },
      yAxis (v) {
        v.forEach(item => {
          item.minInterval = 1
          item.axisLabel.formatter = (val) => {
            let arr = []
            arr.push(untils.getTime(val))
            return arr
          }
        })
        return v
      }
    }
    this.PenExtend = {
      tooltip (v) {
        v.formatter = (val) => {
          let temp1 = ''
          let temp2 = ''
          val.forEach(item => {
            if (item.seriesIndex === 0) {
              temp1 = `<div>${item.name}</div><div>${item.marker}${item.seriesName}: ${item.value[1]}%</div>`
            } else if (item.seriesIndex === 1) {
              temp2 = `<div>${item.marker}${item.seriesName}: ${item.value[1]}%</div>`
            }
          })
          let title = temp1 + temp2
          return title
        }
        return v
      },
      yAxis (v) {
        v.forEach(item => {
          item.minInterval = 1
          item.axisLabel.formatter = (val) => {
            let arr = []
            arr.push(`${val}%`)
            return arr
          }
        })
        return v
      }
    }
    return {
      activeName: '0',
      page: {
        pageNo: 1,
        total: null
      },
      registerAcount: 0,
      rank: 0,
      competitor: 0,
      registerChart: {
        columns: ['date', 'amount'],
        rows: []
      },
      itemChart: {
        columns: ['date', 'selfCount', 'competeCount'],
        rows: []
      },
      registerData: [],
      itemData: [],
      btnActive: 0,
      btnArr: ['今日', '昨日', '最近7天', '最近30天'],
      metrics: 'pv_count',
      options: [
        {value: 'pv_count', label: '浏览量(PV)'},
        {value: 'visitor_count', label: '访客数(UV)'},
        {value: 'ip_count', label: 'IP数'},
        {value: 'bounce_ratio', label: '跳出率'},
        {value: 'avg_visit_time', label: '平均访问时长'},
        {value: 'trans_count', label: '转化次数'},
        // {value: 'contri_pv', label: '百度推荐贡献浏览量'},
      ],
      checked1: true,
      checked7: false,
      contrast: 1,
      ToDayData: [],
      BDChartLoading: false,
      BDChart: {
        columns: [],
        rows: []
      },
      Visitor: {
        newVisitor: {},
        oldVisitor: {}
      }
    }
  },
  methods: {
    tabSwitch (val) {
      this.page = {
        pageNo: 1,
        total: null
      }
      if (val.name === '0') {
        this.loadToDayPop()
        this.loadPopChart()
        this.loadVisitor()
      } else if (val.name === '1') {
        this.loadRegisterChart()
        this.loadRegisterTable()
      } else if (val.name === '2') {
        this.loadItemChart()
        this.loadItemTable()
      }
    },
    ChangeDate (index) {
      if (index < 2) {
        this.checked1 = true
        this.checked7 = false
        this.contrast = 1
      } else {
        this.checked1 = false
        this.checked7 = false
        this.contrast = 0
      }
      this.btnActive = index
      this.loadVisitor()
      this.loadPopChart()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      if (this.activeName === '1') {
        this.loadRegisterTable()
      } else if (this.activeName === '2') {
        this.loadItemTable()
      }
    },
    loadRegisterChart () {
      report.getTotalRegisterCount().then(res => {
        if (res.code === 200) {
          this.registerAcount = res.data.totalCount
          res.data.list = res.data.list.reverse()
          this.registerChart.rows = res.data.list
        } else {
          this.registerAcount = 0
          this.registerChart.rows = []
        }
      })
    },
    loadRegisterTable () {
      report.getUserRegisterCount({ page: this.page.pageNo }).then(res => {
        if (res.code === 200) {
          this.registerData = res.data.results
          this.page.pageNo = res.data.pageNo
          this.page.total = res.data.totalCount
        } else {
          this.registerData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    },
    loadItemChart () {
      report.get30DaysDailyCount().then(res => {
        if (res.code === 200) {
          this.rank = res.data.totalSelfCount
          this.competitor = res.data.totalCompeteCount
          res.data.list = res.data.list.reverse()
          this.itemChart.rows = res.data.list
        } else {
          this.rank = 0
          this.competitor = 0
          this.itemChart.rows = []
        }
      })
    },
    loadItemTable () {
      report.getMonitorDailyCount({ page: this.page.pageNo }).then(res => {
        if (res.code === 200) {
          this.itemData = res.data.results
          this.page.pageNo = res.data.pageNo
          this.page.total = res.data.totalCount
        } else {
          this.itemData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    },
    loadToDayPop () {
      report.getOutLine().then(res => {
        if (res.code === 200) {
          this.ToDayData = res.data
        }
      })
    },
    checkDate1 (e) {
      if (!this.checked7 && e ) {
        this.contrast = 1
        this.checked7 = false
      } else if (!this.checked7 && !e) {
        this.contrast = 0
      } else if (this.checked7 && e) {
        this.contrast = 1
        this.checked7 = false
      }
      this.loadPopChart()
    },
    checkDate7 (e) {
      if (!this.checked1 && e ) {
        this.contrast = 2
        this.checked1 = false
      } else if (!this.checked1 && !e) {
        this.contrast = 0
      } else if (this.checked1 && e) {
        this.contrast = 2
        this.checked1 = false
      }
      this.loadPopChart()
    },
    loadPopChart () {
      this.BDChartLoading = true
      report.getTimeTrendRpt({ date: this.btnActive, metrics: this.metrics, contrast: this.contrast }).then(res => {
        if (res.code === 200) {
          let result = res.data.body.data[0].result
          let fun =  this.options.filter(item => item.value === this.metrics)
          let date = this.contrast === 0 ? result.timeSpan[0] : result.timeSpan[1]
          let beForeDate = result.timeSpan[0]
          this.BDChart.rows = []
          this.BDChart.columns = this.contrast === 0 ? ['date', `${date} ${fun[0].label}`] : ['date', `${date} ${fun[0].label}`, `${beForeDate} ${fun[0].label}`]
          for (let i = 0; i <= result.items[0].length - 1; i++) {
            let list = {}
            if (this.btnActive < 2) {
              let h = i <= 9 ? 0 : ''
              list.date = `${h}${i}:00~${h}${i}:59`
            } else {
              list.date = result.items[0][i][0]
            }
            if (this.contrast === 0) {
              let arr = result.items[1]
              list[`${date} ${fun[0].label}`] = arr[i][0] === '--' ? 0 : arr[i][0]
            } else {
              let arr = result.items[1]
              let brr = result.items[2]
              list[`${date} ${fun[0].label}`] = brr[i][1] === '--' ? 0 : brr[i][1]
              list[`${beForeDate} ${fun[0].label}`] = arr[i][1] === '--' ? 0 : arr[i][1]
            }
            this.BDChart.rows.push(list)
          }
        } else {
          this.BDChart.rows = []
          this.BDChart.columns = []
        }
        this.BDChartLoading = false
      })
    },
    loadVisitor () {
      report.getVisitorType({ date: this.btnActive }).then(res => {
        if (res.code === 200) {
          this.Visitor.newVisitor = res.data[1]
          this.Visitor.oldVisitor = res.data[0]
        } else {
          this.Visitor.newVisitor = {}
          this.Visitor.oldVisitor = {}
        }
      })
    }
  },
  mounted () {
    this.loadToDayPop()
    this.loadPopChart()
    this.loadVisitor()
  }
}
</script>

<style lang="scss" scoped>
  .el-tabs {
    /deep/ .el-tabs__header {
      padding-left: 0 !important;
    }
  }
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
    .userListInfo {
      > .el-col {
        text-align: center;
        height: 71px;
        border-right: 1px solid #eeeeee;
        &:nth-child(n + 3) {
          border-right: none;
        }
        .userIcon {
          font-size: 80px;
        }
        p {
          margin-top: 0;
        }
        .Percentage {
          font-size: 30px;
         &.green {
           color: #48cb6d;
         }
         &.blue {
           color: #51a8f9;
         }
        }
      }
    }
    .userTable {
      width: 100%;
      border: 1px solid #eeeeee;
      font-size: 12px;
      color: #333333;
      tr {
        td {
          width: 30%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #eeeeee;
        }
      }
    }
    .red {
      color: red;
    }
  }
</style>