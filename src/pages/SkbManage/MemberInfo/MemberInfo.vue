<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="end">
        <el-form inline>
          <el-form-item v-show="jdb_userInfo.role !== 'BD'" label="用户来源:" class="mg-l-10">
            <el-select size="small" v-model="osType" placeholder="请选择" clearable>
              <el-option label="京店宝" :value="1"></el-option>
              <el-option label="京大师" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员类型:" class="mg-l-10">
            <el-select size="small" v-model="vip" placeholder="请选择" clearable>
              <el-option label="免费会员" value="1"></el-option>
              <el-option label="Plus会员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" class="mg-l-10">
            <el-select size="small" v-model="valid" placeholder="请选择" clearable>
              <el-option label="审核中" value="0"></el-option>
              <el-option label="正常使用" value="1"></el-option>
              <el-option label="已过期" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号:" class="mg-l-10">
            <el-input class="w200" v-model="search" placeholder="请输入账号" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="jdbAccount" label="账号">
        </el-table-column>
        <el-table-column prop="source" label="来源">
        </el-table-column>
        <el-table-column prop="memberType" label="会员类型">
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间">
        </el-table-column>
        <el-table-column prop="vipType" label="折扣">
        </el-table-column>
        <el-table-column prop="startTime" label="开通时间">
        </el-table-column>
        <el-table-column prop="cycle" label="周期">
        </el-table-column>
        <el-table-column prop="money" label="费用">
        </el-table-column>
        <el-table-column prop="endTime" label="到期时间">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="所属BD">
          <template slot-scope="scope">
            {{ scope.row.bdName ? scope.row.bdName : '无' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-col v-if="userInfo.role !== 'BD'">{{ scope.row.lockName || '—' }}</el-col>
              <el-col v-else>
                <span v-if="scope.row.lockName && scope.row.bdName !== '无' || scope.row.bdName === userInfo.name">{{ scope.row.lockName || '—' }}</span>
                <el-button type="primary" v-else size="small" @click="fromLoadFn(scope.row.id)">跟进</el-button>
              </el-col>
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
import testGuest from 'api/testGuest'
import { mapState } from 'vuex'

export default {
  name: 'MemberInfo',
  data () {
    return {
      osType: '',
      vip: '',
      valid: '',
      search: '', // 京店宝账号/会员类型/状态
      tableData: [], // 表格数据
      page: { // 分页数据
        pageNo: 1,
        total: null
      },
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    async fromLoadFn (accountId) {
      const { code, msg } = await testGuest.addBd({ accountId })
      if (code === 200) {
        this.$message.success(msg || '跟进成功')
        this.pageLoad()
      } else {
        this.$message.error(msg || '跟进失败')
      }
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    pageLoad () {
      testGuest.getMemberLog({ osType: this.osType, page: this.page.pageNo, jdbAccount	: this.search, vip: this.vip, valid: this.valid }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.results
          this.page.pageNo = res.data.pageNo
          this.page.total = res.data.totalCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
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
