<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="请输入查询的手机号" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="wechat" label="微信号">
        </el-table-column>
        <el-table-column label="注册时间">
          <template slot-scope="scope">
            {{ time(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="rechargeMoney" label="本月客户充值金额">
        </el-table-column>
        <el-table-column prop="thisMonthMoney" label="本月客户消费金额">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row class="mg-b-5">
              <el-button type="text" size="small" @click="link(scope.row.invitationCode, scope.row.name)">查看详情</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
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
    </el-main>
  </el-container>
</template>

<script>
import cps from 'api/cps'
import untils from '@/assets/js/untils'
import { mapMutations } from 'vuex'

export default {
  name: 'CpsPerformance',
  data () {
    return {
      search: '', // 手机号搜索
      tableData: [],
      page: { // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
    }
  },
  methods: {
    ...mapMutations(['initQuery']),
    time (val) {
      return untils.formatTime(val)
    },
    pageLoad () {
      cps.getPassCps({ search: this.search, page: this.page.pageNo, size: this.page.pageSize }).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.data
          this.page.pageNo = res.page
          this.page.total = res.allCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    },
    link (invitationCode, name) {
      let query = { pageNo: this.page.pageNo }
      this.initQuery(query)
      this.$router.push({ path: '/Cps/CpsPerformance/Details', query: { invitationCode, name } })
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.pageLoad()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.pageLoad()
    },
  },
  mounted () {
    if (this.$route.query.pageNo) {
      this.page.pageNo = Number(this.$route.query.pageNo)
    }
    this.pageLoad()
  },
  destroyed () {
    Object.assign(this.$data, {
      search: '', // 手机号搜索
      tableData: [],
      page: { // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
    })
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
</style>