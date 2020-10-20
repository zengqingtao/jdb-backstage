<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4"></el-col>
        <el-form inline size="small">
          <el-form-item class="mg-l-10">
            <el-input clearable v-model="search" placeholder="京店宝账号"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="userName" label="京店宝账号">
        </el-table-column>
        <el-table-column prop="giftNumber" label="短信赠送条数">
        </el-table-column>
        <el-table-column prop="buyNumber" label="短信购买条数">
        </el-table-column>
        <el-table-column prop="userNumber" label="短信发送量">
        </el-table-column>
        <el-table-column prop="allNumber" label="短信剩余量">
        </el-table-column>
        <el-table-column prop="rate" label="短信发送成功率">
        </el-table-column>
        <el-table-column prop="money" label="短信购买累计费用">
        </el-table-column>
        <el-table-column prop="noPassNumber" label="审核不通过次数">
        </el-table-column>
        <el-table-column label="审核不通过明细">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetails(scope.row.userId)">查看详情</el-button>
          </template>
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
import { mapMutations } from 'vuex'
import tableMixin from 'mixins/tableMixins'
import report from 'api/report'

export default {
  name: 'SendingReport',
  mixins: [tableMixin],
  methods: {
    ...mapMutations(['initQuery']),
    async pageLoad () {
      const { code, data, page, allCount } = await report.listMerchant({ page: this.page.pageNo, search: this.search })
      this.tableData = code === 200 ? data : []
      this.page.pageNo = code === 200 ? page : 1
      this.page.total = code === 200 ? allCount : null
    },
    linkDetails (userId) {
      let query = { pageNo: this.page.pageNo }
      this.initQuery(query)
      this.$router.push({ path: '/SmsManage/SendingReport/Details', query: { userId } })
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
</style>
