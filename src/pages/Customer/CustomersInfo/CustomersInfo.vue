<template>
  <el-container>
    <el-tabs v-model="activeName" type="card"  class="tabs">
      <el-tab-pane label="归属商家" name="1"></el-tab-pane>
      <el-tab-pane label="解除归属" name="0"></el-tab-pane>
    </el-tabs>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <!--<el-button type="primary" plain size="small" @click="modalStatus = true, editStatus = false">+添加客户信息</el-button>-->
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <!-- <el-input v-model="search" :placeholder="powerOrderAll ? '请输入客户姓名/登录手机号/BD姓名' : '请输入客户姓名/登录手机号'" size="small" clearable></el-input> -->
          <el-input v-model="search" placeholder="请输入客户姓名/登录手机号/BD姓名" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="account" label="登录手机号">
        </el-table-column>
        <el-table-column prop="name" label="客户姓名">
        </el-table-column>
        <el-table-column prop="phone" label="客户电话">
        </el-table-column>
        <el-table-column prop="we_chat" label="客户微信">
        </el-table-column>
        <el-table-column prop="level" label="会员等级">
        </el-table-column>
        <el-table-column prop="client_type" label="客户类型">
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间">
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间">
        </el-table-column>
        <el-table-column prop="balance" label="账户余额">
        </el-table-column>
        <el-table-column prop="chargeAmount" label="累积充值">
        </el-table-column>
        <el-table-column prop="db_name" :label="activeName === '1' ? 'BD' : '原归属BD'">
        </el-table-column>
        <el-table-column label="操作" width="200" v-if="activeName === '1'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editFn(scope.row)">修改</el-button>
            <el-button class="red" type="text" size="small" @click="deleteFn(scope.row.id)">删除</el-button>
            <el-button class="grey" type="text" @click="relieveFn(scope.row.id)">解除归属</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-if="page.total > 10"
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

    <el-dialog :title="editStatus ? '修改客户信息' : '添加客户信息'" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="登录手机号:" prop="account" :rules="[ { required: true, message: '登录手机号不能为空'}]">
          <el-input v-model="form.account" placeholder="请输入登录手机号" clearable  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名:" prop="name" :rules="[ { required: true, message: '客户姓名不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户电话:" prop="phone" :rules="[ { required: true, message: '客户电话不能为空'}]">
          <el-input v-model="form.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户微信:" prop="weChat" :rules="[ { required: true, message: '客户微信不能为空'}]">
          <el-input v-model="form.weChat" placeholder="请输入客户微信" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import customer from 'api/customer'
import role from 'api/role'
import { mapState } from 'vuex'

export default {
  name: 'CustomersInfo',
  data () {
    return {
      editStatus: false,
      modalStatus: false,
      btnStatus: false,
      search: '',
      tableData: [],
      form: {
        account: '',
        name: '',
        phone: '',
        weChat: '',
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      powerOrderAll: false,
      activeName: '1'
    }
  },
  computed: {
    ...mapState(['jdb_userInfo'])
  },
  watch: {
    activeName(val) {
      this.tableData = []
      this.page = {
          pageNo: 1,
          pageSize: 10,
          total: null
      }
      this.search = ''
      this.pageLoad()
    }
  },
  methods: {
    closeModalFn () {
      this.editStatus = false
      this.modalStatus = false
      this.btnStatus = false
      this.form = {
        account: '',
        name: '',
        phone: '',
        we_chat: '',
        create_time: ''
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
    submitFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let requst = this.editStatus ?  customer.customerChange : customer.customerAdd
          if (!this.editStatus) {
            this.form.id = this.jdb_userInfo.id
          }
          this.btnStatus = true
          requst(this.form).then(res => {
            if (res.code === 200) {
              this.$message({
                message: this.editStatus ? '修改用户成功！' :  '添加用户成功！',
                type: 'success',
              })
              this.closeModalFn()
              this.pageLoad()
            } else {
              this.btnStatus = false
            }
          })
        }
      })
    },
    editFn (row) {
      this.form = {
        id: row.id,
        account: row.account,
        name: row.name,
        phone: row.phone,
        weChat: row.we_chat
      }
      this.editStatus = true
      this.modalStatus = true
    },
    deleteFn (id) {
      this.$confirm('是否确定删除此条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        customer.customerDel({ id }).then(res => {
          if (res && res.code === 200) {
            this.pageLoad()
            this.$message({
              message: '删除成功！',
              type: 'success',
            });
          }
        })
      })
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    pageLoad () {
      let request = {
        '0':customer.removeBelongCustomerList,//解除归属
        '1':customer.customerList//归属商家
      }
      request[this.activeName]({ id: this.jdb_userInfo.id, page: this.page.pageNo, size: this.page.pageSize, search: this.search, belong: this.activeName}).then(res => {
        if (res.code === 200) {
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
    loadRoleInfo () {
      role.getRoleInfo({ id: this.jdb_userInfo.id }).then(res => {
        if (res.code === 200 && res.data.powerOrderAll === 1) {
          this.powerOrderAll = true
        } else {
          this.powerOrderAll = false
        }
      })
    },
    relieveFn(id) {
      this.$confirm('是否确认解除关系?', '提示', {
          confirmButtonText: '解除',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(async () => {
          const { code, msg } = await customer.removeBd({id})
          if(code === 200) {
            this.$message.success(msg)
            this.pageLoad()
          }
        }).catch(() => {
          return false         
        });
    },
   
  },
  mounted () {
    // this.loadRoleInfo()
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  padding-top: 30px;
}
  .header {
    padding-right: 30px;
    .el-input {
      width: 75%;
      margin-right: 10px;
    }
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
</style>
