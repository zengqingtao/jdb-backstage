<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4"></el-col>
        <el-form inline size="small">
          <el-form-item class="mg-l-10">
            <el-input clearable v-model="search" placeholder="任务名称/短信内容"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="orderNumber" label="任务号">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称">
        </el-table-column>
        <el-table-column prop="signature" label="短信签名">
        </el-table-column>
        <el-table-column prop="phoneNumber" label="号码数量">
        </el-table-column>
        <el-table-column label="短信内容">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="400"
              trigger="hover"
              :content="scope.row.content">
              <div class="contentMsg" slot="reference">{{ scope.row.content }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="定时发送">
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
  </el-container>
</template>

<script>
import tableMixin from 'mixins/tableMixins'
import report from 'api/report'

export default {
  name: 'Details',
  mixins: [tableMixin],
  methods: {
    async pageLoad () {
      const { code, data, page, allCount } = await report.FailTaskList({ page: this.page.pageNo, search: this.search, userId: this.$route.query.userId })
      this.tableData = code === 200 ? data : []
      this.page.pageNo = code === 200 ? page : 1
      this.page.total = code === 200 ? allCount : null
    }
  },
  created() {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .header {
    .el-input {
      width: 74%;
      margin-right: 10px;
    }
  }
  .contentMsg {
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
