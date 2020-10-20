<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6"></el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="请输入京店宝账号" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="phoneNumber" label="京店宝账号">
        </el-table-column>
        <el-table-column label="近7天投放任务量">
          <template slot-scope="scope">
            {{ scope.row.count || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="投放效果">
          <template slot-scope="scope">
            <el-row class="mg-b-5">
              <el-button type="text" size="small" @click="link(scope.row.jdbUserId)">查看详情</el-button>
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
import renqibao from 'api/renqibao'
import { mapState, mapMutations } from 'vuex'

let vmData = {
  userId: '', // 登录用户ID
  search: '', // 京店宝账户搜索
  tableData: [], // 表格数据
  page: { // 分页数据
    pageNo: 1,
    pageSize: 10,
    total: null
  },
}
export default {
  name: 'Popularity',
  data () {
    return vmData
  },
  computed: {
    ...mapState(['jdb_userInfo'])
  },
  methods: {
    ...mapMutations(['initQuery']),
    link (userId) {
      let child = {pageNo: vmData.page.pageNo}
      this.initQuery(child)
      this.$router.push({ path: '/Customer/Popularity/Details', query: { userId } })
    },
    tableLoad () {
      renqibao.getRenqibaoList({ search: vmData.search, userId: vmData.userId, page: vmData.page.pageNo, size: vmData.page.pageSize }).then(res => {
        if (res.code === 200) {
          vmData.tableData = res.data
          vmData.page.pageNo = res.page
          vmData.page.total = res.allCount
        } else {
          vmData.tableData = []
          vmData.page.pageNo = 1
          vmData.page.total = null
        }
      })
    },
    searchFn () {
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
  },
  created () {
    vmData.userId = this.jdb_userInfo.id
  },
  mounted () {
    if (this.$route.query.pageNo) {
      vmData.page.pageNo = Number(this.$route.query.pageNo)
    }
    this.tableLoad()
  },
  destroyed () {
    Object.assign(this.$data, {
      userId: '', // 登录用户ID
      search: '', // 京店宝账户搜索
      tableData: [], // 表格数据
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

  .el-dialog__body {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
</style>