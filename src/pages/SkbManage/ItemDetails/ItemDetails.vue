<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="end">
        <el-form inline size="small">
          <el-form-item label="用户来源:" class="mg-l-10">
            <el-select size="small" v-model="osType" placeholder="请选择" clearable>
              <el-option label="京店宝" :value="1"></el-option>
              <el-option label="京大师" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称:" class="mg-l-10">
            <el-input class="w200" v-model="title" placeholder="请输入活动名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号:" class="mg-l-10">
            <el-input v-model="jdbAccount" placeholder="请输入账号" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="jdbAccount" label="账号">
        </el-table-column>
        <el-table-column prop="source" label="来源">
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            {{ scope.row.manageTitle || scope.row.title }}
            <el-popover placement="top" width="200" trigger="click" v-if="scope.row.manageTitle">
              <el-row>
                <el-col>原标题：{{ scope.row.title }}</el-col>
                <el-col>修改后标题：{{ scope.row.manageTitle }}</el-col>
                <el-col>修改原因：{{ scope.row.reason }}</el-col>
              </el-row>
              <i slot="reference" class="el-icon-question pointer"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
        </el-table-column>
        <el-table-column prop="status" label="活动进度">
        </el-table-column>
        <el-table-column prop="allCount" label="活动份数">
        </el-table-column>
        <el-table-column prop="applyCount" label="申请数">
        </el-table-column>
        <el-table-column prop="orderCount" label="下单数">
        </el-table-column>
        <el-table-column prop="refundCount" label="已返款数">
        </el-table-column>
        <el-table-column prop="cancelCount" label="已取消资格数">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="modalShow(scope.row.id)">查看统计情况</el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <el-dialog title="统计情况" :visible.sync="modalStatus" width="50%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-row type="flex">
        <el-col>活动名称：{{ modalData.title }}</el-col>
        <el-col>活动进度：{{ modalData.status }}</el-col>
        <el-col>活动份数：{{ modalData.totalCount }}</el-col>
      </el-row>
      <el-row class="mg-t-20" type="flex">
        <el-col>账号：{{ modalData.jdbAccount }}</el-col>
        <el-col>来源：{{ modalData.source }}</el-col>
        <el-col>开始时间：{{ modalData.startTime }}</el-col>
      </el-row>
      <el-row class="mg-t-20" type="flex" justify="end">
        <el-form inline size="small">
          <el-form-item label="活动日期:" class="mg-l-10">
            <el-date-picker
              v-model="changeTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="请输入要查询充值时间"
              size="small"
              :picker-options="pickerOptions"
              clearable>
            </el-date-picker>
            <el-button class="mg-l-10" type="primary" size="small" @click="modalShow(orderId)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <ve-line class="mg-t-20" v-if="chartData && chartData.rows.length > 0" :data="chartData" :settings="chartSettings"></ve-line>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="!modalData.lastId" type="primary" size="small" :loading="btnStatus" plain @click="modalShow(modalData.lastId, true)">上一条</el-button>
        <el-button :disabled="!modalData.nextId" type="primary" size="small" :loading="btnStatus" plain @click="modalShow(modalData.nextId, true)">下一条</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import testGuest from 'api/testGuest'

export default {
  name: 'ItemDetails',
  data () {
    return {
      chartSettings: {
        labelMap: {
          applyCount: '申请数',
          cancelCount: '已取消资格数',
          orderCount: '下单数',
          payBackCount: '已返款数',
        }
      },
      orderId: '',
      chartData: {
        columns: [],
        rows: []
      },
      changeTime: [],
      modalData: {},
      modalStatus: false,
      btnStatus: false,
      osType: '',
      title: '', // 活动名称
      jdbAccount: '', // 京店宝账户
      tableData: [],
      page: { // 分页数据
        pageNo: 1,
        total: null
      },
    }
  },
  computed: {
    pickerOptions () {
      const startTimestamp = Date.parse(this.modalData.startTime) - 3600 * 1000 * 24
      return {
        disabledDate(time) {
          const timestamp = time.getTime()
          if (timestamp > startTimestamp) {
            return false
          } else {
            return true
          }
        }
      }
    }
  },
  methods: {
    async modalShow (orderId, clean) {
      this.orderId = orderId
      this.changeTime = clean ? [] : this.changeTime
      const [startTime, endTime] = this.changeTime? this.changeTime : ['', '']
      const res = await testGuest.getOrderTaskDayRecord({ orderId, startTime, endTime, osType: this.osType, jdbAccount: this.jdbAccount, title: this.title })
      if (res.code === 200) {
        this.modalData = res.data
        if (res.data.rows) {
          const columns = Object.keys(res.data.rows[0])
          this.chartData = { columns, rows: res.data.rows }
        } else {
          this.chartData = { columns: [], rows: [] }
        }
      } else {
        this.modalData = {}
        this.chartData = { columns: [], rows: [] }
      }
      this.modalStatus = true
    },
    closeModalFn () {
      this.orderId = ''
      this.changeTime = []
      this.modalData = {}
      this.chartData = { columns: [], rows: [] }
      this.modalStatus = this.btnStatus = false
    },
    async pageLoad () {
      const res = await testGuest.getOrderTask({ osType: this.osType, page: this.page.pageNo, title: this.title, jdbAccount: this.jdbAccount })
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
      this.pageLoad()
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
  },
  mounted () {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .header {
    padding: 30px;
    margin-bottom: 20px;
    .el-input {
      width: 75%;
      margin-right: 10px;
    }
  }
  .w200 {
    width: 200px !important;
  }
</style>