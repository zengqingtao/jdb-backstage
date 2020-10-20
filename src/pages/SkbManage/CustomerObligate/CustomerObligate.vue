<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="end">
        <el-form inline size="small">
          <el-form-item label="分配状态:" class="mg-l-10">
            <el-select size="small" v-model="type" placeholder="请选择分配状态" clearable>
              <el-option label="未分配" :value="0" ></el-option>
              <el-option label="已分配" :value="1" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名/电话/QQ:" class="mg-l-10">
            <el-input v-model="search" placeholder="姓名/电话/QQ" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column label="店铺链接">
          <template slot-scope="scope">
            <a tag="div" :href="scope.row.url" target="_Blank">{{ scope.row.url }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话">
        </el-table-column>
        <el-table-column prop="weChat" label="微信">
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间">
          <template slot-scope="scope">
            {{ scope.row.createTime ? timeFn(scope.row.createTime) : ''}}
          </template>
        </el-table-column>
        <el-table-column label="跟进BD">
          <template slot-scope="scope">
            <div v-if="scope.row.bdName">{{ scope.row.bdName }}</div>
            <div v-else-if="editStatus">
              <el-select v-model="scope.row.BDChange" filterable  placeholder="请选择" size="small" clearable @change="handleBD(scope.row.id, scope.row.BDChange)">
                <el-option
                  v-for="item in BDList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div v-else>无</div>
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
import testGuest from 'api/testGuest'
import role from 'api/role'
import { mapState } from 'vuex'
import untils from 'js/untils'

export default {
  name: 'CustomerObligate',
  data () {
    return {
      editStatus: false,
      type: '',
      search: '', // 姓名/电话/QQ
      tableData: [], // 表格数据
      page: { // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      id: '', // 列表ID
      BDId: '', // 选择BDId
      BDList: [], // BD下拉列表
      roleInfo: {}
    }
  },
  computed: {
    ...mapState(['jdb_userInfo'])
  },
  methods: {
    timeFn (val) {
      return untils.formatTime(val)
    },
    async canAddBdFn () {
      const res = await testGuest.canAddBd()
      this.editStatus = res
    },
    async loadRoleInfo () {
      const res = await role.getRoleInfo({ id: this.jdb_userInfo.id })
      this.roleInfo = res.data
    },
    pageLoad () {
      testGuest.listTestGuestCustomer({ type: this.type, id: this.jdb_userInfo.id, search: this.search, page: this.page.pageNo, size: this.page.pageSize }).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          res.data.forEach(item => {
            item.BDChange = ''
          })
          this.tableData = res.data
          this.page.pageNo = res.page
          this.page.total = res.allCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    },
    BDLoad () {
      testGuest.listBdIdAndName().then(res => {
        if (res.code === 200) {
          this.BDList = res.data
        } else {
          this.BDList = []
        }
      })
    },
    handleBD (id, bdId) {
      if (bdId) {
        let BdName = this.BDList.filter(item => item.id === bdId)
        this.$confirm(`是否将${BdName[0].name}选为跟进BD?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          testGuest.select({ id, bdId }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功！'
              });
              this.pageLoad()
            }
          })
        })
      }
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.pageLoad()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
  },
  created () {
    this.type = this.$route.query.type || this.$route.query.type === 0 ? this.$route.query.type : this.type
    this.loadRoleInfo()
    this.pageLoad()
    this.BDLoad()
    this.canAddBdFn()
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
  }

  .el-dialog__body {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
</style>
