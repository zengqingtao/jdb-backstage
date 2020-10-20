<template>
  <el-container>
    <el-tabs class="tabs" type="card" v-model="activeName" @tab-click="tabsFn">
      <el-tab-pane label="京店宝注册关联用户" name="1">
      </el-tab-pane>
      <el-tab-pane label="京店宝取消关联用户" name="2">
      </el-tab-pane>
    </el-tabs>

    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">归属联盟用户：{{ $route.query.phone }}</el-col>
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
        <el-table-column prop="account" label="京店宝用户">
        </el-table-column>
      </el-table>

      <el-row type="flex" class="row-bg" justify="end">
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

export default {
  name: 'CpsRegisterNumberDetails',
  mixins: [tableMixins],
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {
    tabsFn() {
      this.search = ''
      this.page.pageNo = 1
      this.pageLoad()
    },
    async pageLoad() {
      const request = this.activeName === '1' ? cps.listPhoneByCode : cps.listNoRecharge
      const { code, data, page, allCount,msg } = await request({ phone: this.search, page: this.page.pageNo, code: this.$route.query.code })
      if(code===200){
        this.tableData =  data.map(item => { return { account: item } }) 
        this.page.pageNo =  page 
        this.page.total =  allCount
      }else{
        this.tableData =  []
        this.page.pageNo =  1
        this.page.total =  null
        this.$message.error(msg)
      }
    }
  },
  created() {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .tabs {
    margin-top: 20px;
  }

  .header {
    .el-input {
      width: 74%;
      margin-right: 10px;
    }
  }
</style>
