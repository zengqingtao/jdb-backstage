<template>
  <el-container>
    <el-main class="main">
      <div class="Moth titleName">{{ titleName }}</div>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="本月业绩" name="1">
          <el-row>
            <el-col>
              <div class="Moth">本月充值累计金额：{{ MothTotalMoney || 0 }} 元</div>
            </el-col>
          </el-row>
          <el-row v-if="MothTotalMoney">
            <el-col class="pd-r-30">
              <ve-line :data="chartData" :legend-visible="false"></ve-line>
              <el-col class="tips">图表为剔除退款额后的数据</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-table :data="tableData">
                <el-table-column prop="date" label="充值日期">
                </el-table-column>
                <el-table-column label="充值金额">
                  <template slot-scope="scope">
                    {{ scope.row.rechargeMoney ?  scope.row.rechargeMoney : 0 }}
                  </template>
                </el-table-column>
                <el-table-column prop="rechargeNum" label="充值客户数">
                </el-table-column>
                <el-table-column label="充值退款金额">
                  <template slot-scope="scope">
                    {{ scope.row.refundMoney ?  scope.row.refundMoney : 0 }}
                  </template>
                </el-table-column>
                <el-table-column prop="refundNum" label="充值退款客户数">
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
            <el-table-column prop="date" label="月份">
            </el-table-column>
            <el-table-column prop="money" label="充值金额">
            </el-table-column>
            <el-table-column prop="proportion" label="提成比例">
            </el-table-column>
            <el-table-column label="提成金额">
              <template slot-scope="scope">
                {{ scope.row.extract.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="modalTableLoad(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <el-dialog title="月份充值明细" :visible.sync="modalStatus" width="50%" center :close-on-click-modal="false" @close="closeModalFn">
      <h4>{{ `${titleName} ${modalDate} 累计充值金额：${modalAccountMonth} 元` }}</h4>
      <el-table :data="tableDataView" height="400">
        <el-table-column prop="date" label="充值日期">
        </el-table-column>
        <el-table-column label="充值金额">
          <template slot-scope="scope">
            {{ scope.row.rechargeMoney ?  scope.row.rechargeMoney : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="rechargeNum" label="充值客户数">
        </el-table-column>
        <el-table-column label="充值退款金额">
          <template slot-scope="scope">
            {{ scope.row.refundMoney ?  scope.row.refundMoney : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="refundNum" label="充值退款客户数">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="modalPage.total"
            @current-change="modalCurrentChange"
            :current-page="modalPage.pageNo"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="modalPage.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import Order from '@/api/order'

export default {
  name: 'Achievement',
  data () {
    return {
      modalStatus: false,
      modalDate: '',
      modalAccountMonth: 0,
      modalTableData: [],
      tableDataView: [],
      modalPage: {
        pageNo: 1,
        total: null
      },
      titleName: '', // BD详情姓名
      activeName: '1',
      MothTotalMoney: '', // 本月累计金额
      chartData: { // 线状图数据
        columns: ['date', 'money'],
        rows: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      historicalForm: {
        id: '',
        year: ''
      },
      historicalData: [] // 历史业绩表格数据
    }
  },
  computed: {
    ...mapState(['jdb_userInfo']),
    tableData () {
      if (!this.chartData.rows.length) return []
      let arry = this.chartData.rows.concat() // 数组深拷贝
      arry = arry.reverse()
      let page = this.page.pageNo
      let size = this.page.pageSize
      let list = arry.filter((item, index) => {
        return index >= (size * (page - 1)) && index < (size * page)
      })
      return list
    }
  },
  methods: {
    modalLoad({ date }) {
    },
    async modalTableLoad({ date }) {
      this.modalDate = date
      const { code, data } = await  Order.getThisMothOrder({ id: this.historicalForm.id, date })
      this.modalTableData = code === 200 ? data.list : []
      this.modalAccountMonth = code === 200 ? data.accountMonth ? data.accountMonth : 0 : 0
      this.tableDataView = code === 200 ? data.list.concat().reverse().splice(0, 11) : []
      this.modalPage.total = this.modalTableData.length
      await this.modalTablePageLoad()
      this.modalStatus = true
    },
    modalCurrentChange(val) {
      this.modalPage.pageNo = val
      this.modalTablePageLoad()
    },
    modalTablePageLoad () {
      let page = this.modalPage.pageNo
      let size = 10
      this.tableDataView = this.modalTableData.concat().reverse().filter((item, index) => {
        return index >= (size * (page - 1)) && index < (size * page)
      })
    },
    closeModalFn() {
      this.modalDate = ''
      this.modalStatus = false
      this.modalTableData = []
      this.modalPage = {
        pageNo: 1,
        total: null
      }
    },
    historical () { // 历史业绩
      Order.historical(this.historicalForm).then(res => {
        if (res && res.code === 200) {
          this.historicalData = res.data
        } else {
          this.historicalData = []
        }
      })
    },
    nextYear () {
      this.historicalForm.year = Number(this.historicalForm.year) + 1
      this.historical()
    },
    toYear () {
      this.historicalForm.year = new Date().getFullYear()
      this.historical()
    },
    prevYear () {
      this.historicalForm.year = Number(this.historicalForm.year) - 1
      this.historical()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
    },
    handleSizeChange (val) {
      this.page.pageSize = val
    },
    pageLoad () {
      Order.getThisMothOrder({ id: this.historicalForm.id }).then(res => { // 查询本月数据
        if (res && res.code === 200) {
          this.MothTotalMoney = res.data.accountMonth
          this.chartData.rows = res.data.list
          this.page.total = res.data.list.length
        }else{
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    if (this.$route.query.id && this.$route.query.name) {
      this.historicalForm.id = this.$route.query.id
      this.titleName = this.$route.query.name
    } else {
      this.historicalForm.id =  this.jdb_userInfo.id
      this.titleName = this.jdb_userInfo.name
    }
    this.pageLoad()
  },
  mounted () {
    this.historicalForm.year = new Date().getFullYear()
    this.historical()
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
