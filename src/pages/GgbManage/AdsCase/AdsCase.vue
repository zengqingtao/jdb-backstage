<template>
  <el-container>
    <el-tabs type="card" v-model="activeName" @tab-click="tabsFn">
      <el-tab-pane label="初级/中级" name="1"></el-tab-pane>
      <el-tab-pane label="高级" name="2"></el-tab-pane>
    </el-tabs>

    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="请输入要查询的京店宝账户" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="SearchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData" key="1" v-if="activeName === '1'">
        <el-table-column prop="releaseTime" label="最新发布时间">
        </el-table-column>
        <el-table-column prop="account" label="京店宝账户">
        </el-table-column>
        <el-table-column prop="name" label="客户姓名">
        </el-table-column>
        <el-table-column prop="phone" label="客户手机号">
        </el-table-column>
        <el-table-column prop="weChat" label="客户微信">
        </el-table-column>
        <el-table-column prop="drainage" label="全品营销发布量">
        </el-table-column>
        <el-table-column prop="blastingVolume" label="精准爆破发布量">
        </el-table-column>
        <el-table-column prop="blastingPut" label="爆款投放发布量">
        </el-table-column>
        <el-table-column prop="superRecommend" label="超级推荐发布量">
        </el-table-column>
        <el-table-column label="任务详情">
          <template slot-scope="scope">
            <el-button type="text" @click="routerLinkFn(scope.row.accountId)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="tableData" key="2" v-else>
        <el-table-column prop="account" label="京店宝账号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="电话">
        </el-table-column>
        <el-table-column label="服务费">
          <template slot-scope="scope">
            <el-button type="text" @click="modalShow(scope.row.advanceId)">查看明细</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="截止日期">
        </el-table-column>
        <el-table-column prop="bdName" label="归属BD">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
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

    <el-dialog title="服务费" :visible.sync="modalStatus" width="40%" z-index="1000" center :close-on-click-modal="false" @close="closeModalFn">
      <el-table :data="modalTable">
        <el-table-column prop="index" label="序号">
        </el-table-column>
        <el-table-column prop="payTime" label="付费时间">
        </el-table-column>
        <el-table-column prop="month" label="购买时长">
        </el-table-column>
        <el-table-column prop="money" label="购买金额">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="modalPage.total"
            @current-change="modalCurrentChange"
            :current-page="modalPage.pageNo"
            layout="total, prev, pager, next, jumper"
            :total="modalPage.total">
          </el-pagination>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import adsTask from 'api/adsTask'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AdsCase',
  data () {
    return {
      advanceId: '',
      modalStatus: false,
      modalTable: [],
      modalPage: {
        pageNo: 1,
        total: null
      },
      activeName: '1',
      search: '',
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    }
  },
  computed: {
    ...mapState(['jdb_userInfo'])
  },
  methods: {
    ...mapMutations(['initQuery']),
    tabsFn (val) {
      this.page.pageNo = 1
      val.name === '1' ? this.pageLoad() : this.advancedPageLoad()
    },
    async pageLoad () {
      const res = await adsTask.listAds({ page: this.page.pageNo, account: this.search })
      if (res.code === 200) {
        const { pageNo, results, totalCount } = res.data
        this.page.pageNo = pageNo
        this.page.total = totalCount
        this.tableData = results
      } else {
        this.page.pageNo = 1
        this.page.total = null
        this.tableData = []
      }
    },
    async advancedPageLoad () {
      const res = await adsTask.listAdvance({ page: this.page.pageNo, account: this.search })
      if (res.code === 200) {
        const { pageNo, results, totalCount } = res.data
        this.page.pageNo = pageNo
        this.page.total = totalCount
        this.tableData = results
      } else {
        this.page.pageNo = 1
        this.page.total = null
        this.tableData = []
      }
    },
    SearchFn () {
      this.page.pageNo = 1
      this.activeName === '1' ? this.pageLoad() : this.advancedPageLoad()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.activeName === '1' ? this.pageLoad() : this.advancedPageLoad()
    },
    routerLinkFn (userId) {
      let child = {pageNo: this.page.pageNo}
      this.initQuery(child)
      this.$router.push({ path: '/ggbManage/AdsCase/Details', query: { userId } })
    },
    closeModalFn() {
      this.modalStatus = false
    },
    async modalShow(advanceId) {
      this.advanceId = advanceId
      await this.modalPageLoad()
      this.modalStatus = true
    },
    async modalPageLoad() {
      const res = await adsTask.listAdvanceDetail({ page: this.modalPage.pageNo, advanceId: this.advanceId })
      if (res.code === 200) {
        const { pageNo, results, totalCount } = res.data
        this.modalPage.pageNo = pageNo
        this.modalPage.total = totalCount
        this.modalTable = results
      } else {
        this.modalPage.pageNo = 1
        this.modalPage.total = null
        this.modalTable = []
        this.$message.error(res.msg)
      }
    },
    modalCurrentChange(val) {
      this.modalPage.pageNo = val
      this.modalPageLoad()
    }
  },
  created () {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  @import "~styles/mixin";
  .el-tabs {
    margin-top: 20px;
  }
  .header{
    padding: 0 30px;
  }

</style>
