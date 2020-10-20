<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4"></el-col>
        <el-form size="small" inline>
          <el-form-item label="京店宝手机号:">
            <el-input v-model="search" placeholder="请输入京店宝手机号"></el-input>
            <el-button type="primary" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 + page.pageSize * (page.pageNo - 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联盟用户">
        </el-table-column>
        <el-table-column prop="registerNumber" label="京店宝注册关联用户">
        </el-table-column>
        <el-table-column prop="noRecharge" label="京店宝取消关联用户">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row class="mg-b-5">
              <el-button type="text" size="small" @click="link(scope.row.code, scope.row.phone)">查看详情</el-button>
            </el-row>
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
import tableMixins from 'mixins/tableMixins'
import cps from 'api/cps'
import { mapMutations } from 'vuex'

export default {
  name: 'CpsRegisterNumber',
  mixins: [tableMixins],
  methods: {
    ...mapMutations(['initQuery']),
    async pageLoad() {
      const { code, data, page, allCount } = await cps.cpsRegisterList({ phone: this.search, page: this.page.pageNo })
      this.tableData = code === 200 ? data : []
      this.page.pageNo = code === 200 ? page : 1
      this.page.total = code === 200 ? allCount : null
    },
    link(code, phone) {
      let query = { pageNo: this.page.pageNo }
      this.initQuery(query)
      this.$router.push({ path: '/Cps/CpsRegisterNumber/CpsRegisterNumberDetails', query: { code, phone } })
    }
  },
  created() {
    if (this.$route.query.pageNo) this.page.pageNo = Number(this.$route.query.pageNo)
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .header {
    margin-top: 20px;
    .el-input {
      width: 74%;
      margin-right: 10px;
    }
  }
</style>
