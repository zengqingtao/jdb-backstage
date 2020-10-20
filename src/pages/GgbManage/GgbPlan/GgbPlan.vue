<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
        </el-col>
        <el-form inline size="small">
          <el-form-item>
            <el-input clearable v-model="search" placeholder="京店宝账号/店铺名称"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="account" label="京店宝账号">
        </el-table-column>
        <el-table-column prop="pain" label="计划名称">
        </el-table-column>
        <el-table-column prop="day" label="时间范围">
        </el-table-column>
        <el-table-column label="优化项目" width="205">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="scope.row.detailName">
              <div class="multiline-1 w200" slot="reference">{{ scope.row.detailName }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="optimizeTime" label="优化时间">
        </el-table-column>
        <el-table-column prop="result" label="优化结果">
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" class="page" v-if="page.total">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          layout="total, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import tableMixins from 'mixins/tableMixins'
  import specialCustomer from 'api/specialCustomer'

  export default {
    name: 'GgbPlan',
    mixins: [tableMixins],
    methods: {
      async pageLoad() {
        const { code, data } = await specialCustomer.getTaskOptimize({ search: this.search, page: this.page.pageNo })
        if (code === 200) {
          const { pageNo, totalCount, results } = data
          this.page.pageNo = pageNo
          this.page.total = totalCount
          this.tableData = results
        } else {
          this.page.pageNo = 1
          this.page.total = null
          this.tableData = []
        }
      }
    },
    created() {
      this.pageLoad()
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/tableMixins";
  .w200 {
    width: 200px;
  }
</style>
