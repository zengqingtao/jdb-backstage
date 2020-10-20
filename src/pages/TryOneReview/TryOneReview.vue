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
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{ scope.row.orderTime ? timeFn(scope.row.orderTime) : null }}
          </template>
        </el-table-column>
        <el-table-column prop="account" label="京店宝账号">
        </el-table-column>
        <!--<el-table-column prop="name" label="客户姓名">-->
        <!--</el-table-column>-->
        <el-table-column prop="phone" label="客户电话">
        </el-table-column>
        <el-table-column prop="orderNumber" label="未审量">
        </el-table-column>
        <el-table-column label="审核">
          <template slot-scope="scope">
            <el-row class="mg-b-5">
              <el-button type="text" size="small" @click="link(scope.row.id)">查看详情</el-button>
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
import Try from 'api/try'
import untils from 'js/untils'
import { mapMutations } from 'vuex'

export default {
  name: 'TryOneReview',
  data () {
    return {
      search: '', // 京店宝账户搜索
      tableData: [], // 表格数据
      page: { // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
    }
  },
  methods: {
    ...mapMutations(['initQuery']),
    timeFn (val) {
      return untils.formatTime(val)
    },
    pageLoad () {
      Try.listTry({ search: this.search, page: this.page.pageNo, size: this.page.pageSize }).then(res => {
        if (res.code === 200) {
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
    },
    link (id) {
      let child = {pageNo: this.page.pageNo}
      this.initQuery(child)
      this.$router.push({ path: '/TryOneMore/TryOneReview/Details', query: { id } })
    }
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

  .el-dialog__body {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
</style>