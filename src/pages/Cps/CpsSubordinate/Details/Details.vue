<template>
  <el-container>
    <el-tabs class="mg-t-20" type="card" v-model="tabIndex" @tab-click="tabChange">
      <el-tab-pane label="上月记录" name="0">
      </el-tab-pane>
      <el-tab-pane label="历史明细" name="1">
      </el-tab-pane>
      <el-tab-pane label="贡献统计" name="2">
      </el-tab-pane>
    </el-tabs>
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
        <template v-if="tabIndex === '0'">
          <el-table-column prop="monthMoney" label="上月提成">
          </el-table-column>
          <el-table-column prop="subordinateMonthMoney" label="上月贡献下级联盟提成">
          </el-table-column>
        </template>
        <template v-else-if="tabIndex === '1'">
          <el-table-column prop="date" label="月份">
          </el-table-column>
          <el-table-column prop="monthMoney" label="提成">
          </el-table-column>
          <el-table-column prop="subordinateMonthMoney" label="贡献下级联盟提成">
          </el-table-column>
        </template>
        <template v-else-if="tabIndex === '2'">
          <el-table-column prop="monthMoney" label="累计提成">
          </el-table-column>
          <el-table-column prop="subordinateMonthMoney" label="累计贡献下级联盟提成">
          </el-table-column>
        </template>
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
import tableMixins from 'mixins/tableMixins'

export default {
  name: 'Details',
  mixins: [tableMixins],
  data () {
    return {
      tabIndex: '0'
    }
  },
  methods: {
    async pageLoad () {
      const request = [cps.SubordinateLastMonthList, cps.historySubordinate, cps.listStatistics]
      const res = await request[this.tabIndex]({ userId: this.$route.query.userId, page: this.page.pageNo, size: this.page.pageSize, search: this.search })
      if (res.code === 200) {
        this.tableData = res.data
        this.page.pageNo = res.page
        this.page.total = res.allCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
        this.$message.error(res.msg)
      }
    },
    tabChange () {
      this.pageLoad()
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