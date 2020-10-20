<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName" @tab-click="tabSwitch">
        <el-tab-pane label="流量sku监控" name="1"></el-tab-pane>
        <el-tab-pane label="快车sku监控" name="2"></el-tab-pane>
      </el-tabs>

      <el-header class="header">
        <el-row type="flex" class="row-bg" justify="end">
          <el-col :span="7" class="text-right">
            <el-input v-model="sku" placeholder="请输入sku" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main class="parent-main" v-if="DeatilsData && DeatilsData.length > 0" v-for="(item, index) in DeatilsData" :key="index">
        <el-card class="child-main">
          <el-row type="flex" class="row-bg mg-t-10">
            <el-col :span="10" :offset="1">
              <el-col :span="7" class="titleImg">
                <img :src="item.sku.url" width="80" height="80">
              </el-col>
              <p class="mg-t-0"><b>{{ item.sku.title }}</b></p>
              <el-col :span="10">
                <p class="mg0">sku:<span>{{ item.sku.sku }}</span></p>
                <p>关键词:<span>{{ item.sku.keyword }}</span></p>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" class="mg-t-10" size="small" @click="checkLaunch(item.sku)">查看投放计划</el-button>
              </el-col>
            </el-col>
          </el-row>

          <el-row v-if="item.monitorList.length > 0">
            <el-col>
              <ve-line :data="item.chartData" :settings="chartSettings" :extend="chartExtend" ></ve-line>
            </el-col>
          </el-row>

          <el-row v-if="item.monitorList.length > 0">
            <el-col>
              <el-table :data="item.monitorList" height="300">
                <el-table-column prop="rankingTime" label="时间">
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

      <el-dialog title="投放计划" :visible.sync="modalStatus" width="45%" center :close-on-click-modal="false" @close="closeModalFn">
        <el-header class="header">
          <el-row type="flex" class="row-bg">
            <el-col>
              <el-col :span="6" class="titleImg">
                <img :src="dialogSkuData.url" width="80" height="80">
              </el-col>
              <p class="mg-t-0"><b>{{ dialogSkuData.title }}</b></p>
              <el-col :span="10">
                <p class="mg0">sku:<span>{{ dialogSkuData.sku }}</span></p>
                <p>关键词:<span>{{ dialogSkuData.keyword }}</span></p>
              </el-col>
            </el-col>
          </el-row>
        </el-header>
        <el-row>
          <el-col>
            <el-table :data="dialogTableData">
              <el-table-column prop="taskDate" label="执行时间">
              </el-table-column>
              <el-table-column label="点击量">
                <template slot-scope="scope">{{ `${scope.row.success || 0} / ${scope.row.click || 0}` }}</template>
              </el-table-column>
              <el-table-column prop="cart" label="加入购物车数">
                <template slot-scope="scope">{{ `${scope.row.cartFinish || 0} / ${scope.row.cart || 0}` }}</template>
              </el-table-column>
              <el-table-column label="关注商品数">
                <template slot-scope="scope">{{ `${scope.row.attentionProductFinish || 0} / ${scope.row.attentionProduct || 0}` }}</template>
              </el-table-column>
              <el-table-column label="关注店铺数">
                <template slot-scope="scope">{{ `${scope.row.attentionStoreFinish || 0} / ${scope.row.attentionStore || 0}` }}</template>
              </el-table-column>
              <el-table-column prop="money" label="金额">
              </el-table-column>
              <el-table-column prop="refund" label="退款金额">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg"justify="end">
          <el-col class="page">
            <el-pagination
              v-show="dialogPage.total"
              @size-change="dialogSizeChange"
              @current-change="dialogCurrentChange"
              :current-page="dialogPage.pageNo"
              :page-sizes="[10, 20, 50]"
              :page-size="dialogPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dialogPage.total">
            </el-pagination>
          </el-col>
        </el-row>
        <!--<span slot="footer" class="dialog-footer">-->
          <!--<el-button type="primary" size="small" plain @click="modalStatus = false">关闭</el-button>-->
        <!--</span>-->
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import renqibao from '../../../../api/renqibao'

let vmData = {
  activeName: '1', // tab页标记
  sku: '', // 查询sku参数
  DeatilsData: [], // 汇总数据
  page: { // 汇总分页数据
    pageNo: 1,
    pageSize: 10,
    total: null
  },
  dataPage: { // 数据表格分页数据
    pageNo: 1,
    total: null
  },
  modalStatus: false, // 弹窗显示状态
  dialogSkuData: {},
  dialogTableData: [], // 弹窗表格数据
  dialogPage: { // 分页数据
    pageNo: 1,
    pageSize: 10,
    total: null
  },
}

export default {
  name: 'Details',
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
    return vmData
  },
  methods: {
    tableLoad () {
      renqibao.getMonitor({ taskType: Number(vmData.activeName), userId: this.$route.query.userId, sku: vmData.sku, page: vmData.page.pageNo, size: vmData.page.pageSize }).then(res => {
        if (res && res.code === 200) {
          vmData.DeatilsData = res.data
          vmData.page.pageNo = res.page
          vmData.page.total = res.allCount
          vmData.DeatilsData.forEach(item => {
            item.chartData = {}
            item.chartData.columns = ['rankingTime', 'pcRanking', 'phoneRanking']
            item.chartData.rows = []
            if (item.monitorList && item.monitorList.length > 0) {
              let maxArr = []
              let max = 0
              item.monitorList.forEach(data => {
                maxArr.push(data.pcRanking)
                maxArr.push(data.phoneRanking)
              })
              maxArr = Array.from(new Set(maxArr))
              max = Math.max(...maxArr) + 1.1
              item.monitorList.forEach(data => {
                let list = {}
                list.rankingTime = data.rankingTime
                list.pcRanking = data.pcRanking === 0 ? max : data.pcRanking
                list.phoneRanking = data.phoneRanking === 0 ? max : data.phoneRanking
                item.chartData.rows.unshift(list)
              })
            }
          })
        } else {
          vmData.DeatilsData = []
          vmData.page.pageNo = 1
          vmData.page.total = null
        }
      })
    },
    searchFn() {
      vmData.page.pageNo = 1
      this.tableLoad()
    },
    handleSizeChange(val) {
      vmData.page.pageSize = val
      this.tableLoad()
    },
    handleCurrentChange(val) {
      vmData.page.pageNo = val
      this.tableLoad()
    },
    tabSwitch () {
      // tab页切换事件
      vmData.sku = ''
      this.tableLoad()
    },
    closeModalFn () {
      vmData.dialogTableData = []
      vmData.dialogPage = {
        pageNo: 1,
        total: null
      }
    },
    checkLaunch (sku) {
      const flowTaskId = sku.flowTaskId
      vmData.dialogSkuData = sku
      renqibao.getPlanList({ userId: this.$route.query.userId, flowTaskId }).then(res => {
        if (res.code === 200) {
          vmData.modalStatus = true
          vmData.dialogTableData = res.data.results
          vmData.dialogPage.pageNo = res.data.pageNo
          vmData.dialogPage.total = res.data.totalCount
        } else {
          vmData.dialogPage.pageNo = 1
          vmData.dialogPage.total = null
          vmData.dialogTableData = []
        }
      })
    },
    dialogSizeChange(val) {
      vmData.dialogPage.pageSize = val
      this.checkLaunch()
    },
    dialogCurrentChange(val) {
      vmData.dialogPage.pageNo = val
      this.checkLaunch()
    }
  },
  mounted () {
    vmData.activeName = '1'
    this.tableLoad()
  },
  destroyed () {
    Object.assign(this.$data, {
      activeName: '1', // tab页标记
      sku: '', // 查询sku参数
      DeatilsData: [], // 汇总数据
      page: { // 汇总分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      dataPage: { // 数据表格分页数据
        pageNo: 1,
        total: null
      },
      modalStatus: false, // 弹窗显示状态
      dialogSkuData: {},
      dialogTableData: [], // 弹窗表格数据
      dialogPage: { // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
    })
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 30px 0 0 0;
    .el-tabs__item.is-active {
      background-color: #3489fe;
    }
    .header {
      height: auto !important;
      .titleImg {
        text-align: center;
      }
      .el-main {
        padding-top: 0 !important;
      }
      .el-input {
        width: 75%;
        margin-right: 10px;
      }
    }
    .parent-main {
      .child-main {
        margin: 20px;
      }
    }
  }
</style>
