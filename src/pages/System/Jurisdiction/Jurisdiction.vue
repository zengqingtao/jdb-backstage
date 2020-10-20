<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button type="primary" plain size="small" @click="modalStatus = true">+添加用户</el-button>
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="auditsNum" placeholder="请输入要查询的用户名|角色" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="用户名称"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="manageName" label="角色"></el-table-column>
        <el-table-column prop="invicationCode" label="邀请码"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="mg-r-5" type="text" size="small" @click="editModalFn(scope)">修改</el-button>
            <!--<el-button class="red" type="text" size="small" @click="deleteUser(scope)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog
      title="添加用户"
      :visible.sync="modalStatus"
      width="30%"
      center
      :close-on-click-modal="false"
      @close="closeModalFn"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户名称:" prop="name" :rules="[ { required: true, message: '用户名称不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入用户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password" :rules="[ { required: true, message: '密码不能为空'}]">
          <el-input v-model="form.password" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="manage" :rules="[ { required: true, message: '请选择角色'}]">
          <el-select v-model="form.manage" placeholder="请选择角色" filterable clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone" :rules="[ { required: true, message: '手机号不能为空'}]">
          <el-input v-model="form.phone" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addUser" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="edit" width="30%" center :close-on-click-modal="false">
      <el-form ref="edform" :model="edform" label-width="120px">
        <el-form-item label="用户名称:" prop="name" :rules="[ { required: true, message: '用户名称不能为空'}]">
          <el-input v-model="edform.name" placeholder="请输入用户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="manage" :rules="[ { required: true, message: '请选择角色'}]">
          <el-select v-model="edform.manage" placeholder="请选择角色" filterable clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码:" prop="name" :rules="[ { required: true, message: '手机号码不能为空'}]">
          <el-input v-model="edform.phone" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="分销商主管:" v-if="distributorManageToggle">
          <el-select v-model="edform.distributorManage" placeholder="请选择角色" filterable clearable>
            <el-option
              v-for="item in manageOptions"
              :key="item.roleName"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="editUser" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="edit = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import management from '@/api/management'
import role from '@/api/role'

export default {
  name: 'Jurisdiction',
  data () {
    return {
      btnStatus: false, // 按钮禁用状态
      edit: false, // 弹窗是否修改状态
      modalStatus: false, // 弹窗显示状态
      auditsNum: '',  // 查询的用户名|角色
      tableData: [],
      form: {
        name: '', // 用户名称
        password: '', // 密码
        manage: '', // 角色Id
        phone: '' // 手机号
      },
      edId: '', // 修改用户信息ID
      edform: {
        name: '',
        manage: '',
        phone: '',
        distributorManage: ''
      },
      roleOptions: [],
      manageOptions: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      distributorManageToggle: false
    }
  },
  methods: {
    //   获取分销商主管
    getDistributorManage () {
      management.getDistributorManage().then(res => {
        if (res.code === 200) {
          this.manageOptions = res.data
        } else {
          this.manageOptions = []
        }
      })
    },
    getManage () {
      role.roleInfo().then(res => { // 获取角色信息
        if (res && res.code === 200) {
          this.roleOptions = res.data
        } else {
          this.roleOptions = []
        }
      })
    },
    // 获取主管
    closeModalFn () {
      this.btnStatus = false
      this.form = {
        name: '', // 用户名称
        password: '', // 密码
        manage: '', // 角色Id
        phone: '' // 手机号
      }
    },
    addUser () { // 添加用户
      let that = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          that.btnStatus = true
          management.addUser(this.form).then(res => {
            if (res && res.code === 200) {
              that.modalStatus = false
              that.btnStatus = false
              management.getUserPage({ search: '', page: this.page.pageNo, size: this.page.pageSize }).then(res => { // 获取列表
                if (res && res.code === 200) {
                  this.tableData = res.data
                  this.page.pageNo = res.page
                  this.page.total = res.allCount
                } else {
                  this.tableData = []
                  this.page.pageNo = 1
                  this.page.total = null
                }
              })
              that.$message({
                message: '添加用户成功！',
                type: 'success',
              });
            } else {
              that.btnStatus = false
            }
          })
        }
      })
    },
    editModalFn (scope) { // 获取用户信息（修改弹窗）
      this.distributorManageToggle = scope.row.manageName === `分销商BD` ? true : false
      this.edit = true
      this.edId = scope.row.id
      this.edform.name = scope.row.name
      this.edform.manage = scope.row.manage
      this.edform.phone = scope.row.phone
      this.edform.distributorManage = Number(scope.row.distributorManage) ? Number(scope.row.distributorManage) : ''
    },
    editUser () { // 修改用户
      let that = this
      this.$refs['edform'].validate(valid => {
        if (valid) {
          that.btnStatus = true
          management.changeUser({ id: this.edId, name: this.edform.name, manage: this.edform.manage, phone: this.edform.phone, distributorManage: this.edform.distributorManage }).then(res => {
            if (res && res.code === 200) {
              this.edit = false
              that.btnStatus = false
              management.getUserPage({ search: '', page: this.page.pageNo, size: this.page.pageSize }).then(res => { // 获取列表
                if (res && res.code === 200) {
                  this.tableData = res.data
                  this.page.pageNo = res.page
                  this.page.total = res.allCount
                } else {
                  this.tableData = []
                  this.page.pageNo = 1
                  this.page.total = null
                }
              })
              that.$message({
                message: '修改用户成功！',
                type: 'success',
              });
            } else {
              that.btnStatus = false
            }
          })
        }
      })
    },
    deleteUser (scope) { // 删除用户
      this.$confirm('是否确定删除此条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        management.delete({ id: scope.row.id, name: scope.row.name }).then(res => {
          if (res && res.code === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success',
            });
            management.getUserPage({ search: '', page: this.page.pageNo, size: this.page.pageSize }).then(res => { // 获取列表
              if (res && res.code === 200) {
                this.tableData = res.data
                this.page.pageNo = res.page
                this.page.total = res.allCount
              } else {
                this.tableData = []
                this.page.pageNo = 1
                this.page.total = null
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    search () { // 模糊搜索
      let that = this
      management.getUserPage({ search: this.auditsNum, page: 1, size: this.page.pageSize }).then(res => { // 获取列表
        if (res && res.code === 200) {
          that.tableData = res.data
          that.page.pageNo = res.page
          that.page.total = res.allCount
        } else {
          that.tableData = []
          that.page.pageNo = 1
          that.page.total = null
        }
      })
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      management.getUserPage({ search: '', page: this.page.pageNo, size: this.page.pageSize }).then(res => { // 获取列表
        if (res && res.code === 200) {
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
    handleCurrentChange (val) {
      this.page.pageNo = val
      management.getUserPage({ search: '', page: this.page.pageNo, size: this.page.pageSize }).then(res => { // 获取列表
        if (res && res.code === 200) {
          this.tableData = res.data
          this.page.pageNo = res.page
          this.page.total = res.allCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
          this.page.total = null
        }
      })
    }
  },
  mounted () {
    this.getManage()
    this.getDistributorManage()
    management.getUserPage({ search: '', page: this.page.pageNo, size: this.page.pageSize }).then(res => { // 获取列表
      if (res && res.code === 200) {
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
  destroyed () {
    Object.assign(this.$data, {
      btnStatus: false, // 按钮禁用状态
      edit: false, // 弹窗是否修改状态
      modalStatus: false, // 弹窗显示状态
      auditsNum: '',  // 查询的用户名|角色
      tableData: [],
      form: {
        name: '', // 用户名称
        password: '', // 密码
        manage: '', // 角色Id
        phone: '' // 手机号
      },
      edId: '', // 修改用户信息ID
      edform: {
        name: '',
        manage: ''
      },
      roleOptions: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
    })
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

.el-select {
  width: 100% !important;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
</style>
