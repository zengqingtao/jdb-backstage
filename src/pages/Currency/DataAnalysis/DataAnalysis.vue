<template>
  <el-container>
    <el-main class="main">
      <el-header class="header">
        <el-row type="flex" class="row-bg" justify="end">
          <el-col :span="7" class="text-right">
            <el-input v-model="search" placeholder="请输入京店宝账号" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-table :data="tableData" @sort-change="mySortable">
        <el-table-column prop="account" label="京店宝账号">
        </el-table-column>
        <el-table-column sortable="custom" prop="jbConsume7" label="近7天消耗">
          <template slot-scope="scope">
            <span>{{ scope.row.jbConsume7 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbConsume30" label="近1月消耗">
          <template slot-scope="scope">
            <span>{{ scope.row.jbConsume30 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbConsume90" label="近3月消耗">
          <template slot-scope="scope">
            <span>{{ scope.row.jbConsume90 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbConsumeAll" label="累计消耗">
          <template slot-scope="scope">
            <span>{{ scope.row.jbConsumeAll }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbPresent" label="当前余额">
          <template slot-scope="scope">
            <span>{{ scope.row.jbPresent }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbAdd7" label="近7天新增">
          <template slot-scope="scope">
            <span>{{ scope.row.jbAdd7 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbAdd30" label="近1月新增">
          <template slot-scope="scope">
            <span>{{ scope.row.jbAdd30 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbAdd90" label="近3月新增">
          <template slot-scope="scope">
            <span>{{ scope.row.jbAdd90 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="jbAddAll" label="累计新增">
          <template slot-scope="scope">
            <span>{{ scope.row.jbAddAll }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="moneyRecharge" label="累计充值金额">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyRecharge }}元</span>
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
import tableMixins from 'mixins/tableMixins'
import jingbiDataAnalysis from 'api/jingbiDataAnalysis'

export default {
  name: 'DataAnalysis',
  mixins: [tableMixins],
  data () {
    return {
      type: '',
      orderBy: ''
    }
  },
  methods: {
    mySortable (params) {
      const { prop, order } = params
      const arr = ['jbConsume7', 'jbConsume30', 'jbConsume90', 'jbConsumeAll', 'jbPresent', 'jbAdd7', 'jbAdd30', 'jbAdd90', 'jbAddAll', 'moneyRecharge']
      this.orderBy = order ?  order === 'descending' ? 0 : 1 : ''
      this.type = arr.findIndex(item => item === prop) !== -1 ? arr.findIndex(item => item === prop) : ''
      this.pageLoad()
    },
    async pageLoad () {
      const res = await jingbiDataAnalysis.listSearch({
        page: this.page.pageNo,
        size: this.page.pageSize,
        search: this.search,
        type: this.type,
        orderBy: this.orderBy
      })
      if (res.code === 200) {
        this.tableData = res.data
        this.page.pageNo = res.page
        this.page.total = res.allCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
  },
  created () {
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
    .w200 {
      width: 200px;
    }
  }
  .el-dialog__body {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
</style>