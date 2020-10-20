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
        <el-table-column prop="subordinateNumber" label="下级用户数">
        </el-table-column>
        <el-table-column prop="subordinateMonthMoney" label="上月下级联盟提成">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row class="mg-b-5">
              <el-button type="text" size="small" @click="link(scope.row.userId)">查看详情</el-button>
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
import { mapMutations } from 'vuex'
import tableMixins from 'mixins/tableMixins'
import cps from 'api/cps'

export default {
  name: 'Subordinate',
  mixins: [tableMixins],
  methods: {
    ...mapMutations(['initQuery']),
    link (userId) {
      let query = { pageNo: this.page.pageNo }
      this.initQuery(query)
      this.$router.push({ path: '/Cps/CpsSubordinate/SubordinateDetails', query: { userId } })
    },
    async pageLoad () {
      const res = await cps.SubordinateList({ page: this.page.pageNo, size: this.page.pageSize, search: this.search })
      if (res.code === 200) {
        this.tableData = res.data
        this.page.pageNo = res.page
        this.page.total = res.allCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    }
  },
  created () {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  @import "~styles/mixin";
</style>