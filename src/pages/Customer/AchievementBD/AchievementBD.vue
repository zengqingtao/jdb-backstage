<template>
  <el-container>
    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="name" label="BD">
        </el-table-column>
        <el-table-column label="本月业绩">
          <template slot-scope="scope">
            {{ scope.row.month || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row class="mg-b-5">
              <el-button type="text" size="small" @click="link(scope.row.id, scope.row.name)">查看详情</el-button>
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
import Order from '@/api/order'
import { mapMutations } from 'vuex'

let vmData = {
  account: '', // BD账户搜索
  tableData: [],
  page: { // 分页数据
    pageNo: 1,
    pageSize: 10,
    total: null
  },
}

const pageLoad = () => {
  // 表格加载
  Order.getAllDb({ page: vmData.page.pageNo, size: vmData.page.pageSize }).then(res => {
    if (res && res.code === 200) {
      vmData.tableData = res.data
      vmData.page.pageNo = res.page
      vmData.page.total = res.allCount
    } else {
      vmData.tableData = []
      vmData.page.pageNo = 1
      vmData.page.total = null
    }
  })
}

export default {
  name: 'AchievementBD',
  data () {
    return vmData
  },
  methods: {
    ...mapMutations(['initQuery']),
    link (id, name) {
      let child = {pageNo: vmData.page.pageNo}
      this.initQuery(child)
      this.$router.push({ path: '/Customer/AchievementBD/Details', query: { id, name } })
    },
    handleSizeChange(val) {
      vmData.page.pageSize = val
      pageLoad()
    },
    handleCurrentChange(val) {
      vmData.page.pageNo = val
      pageLoad()
    },
  },
  mounted () {
    pageLoad()
  },
  destroyed () {
    Object.assign(this.$data, {
      account: '', // BD账户搜索
      tableData: [],
      page: { // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__body {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
</style>