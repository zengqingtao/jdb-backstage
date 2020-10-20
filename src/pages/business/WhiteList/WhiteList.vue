<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button
            type="primary"
            plain
            size="small"
            @click="modalStatus = true, editStatus = false"
          >+添加白名单</el-button>
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="auditsNum" placeholder="请输入要查询的登录手机号" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="account" label="登录手机号"></el-table-column>
        <el-table-column prop="store" label="店铺名称"></el-table-column>
        <el-table-column prop="whilelistPower" label="权限"></el-table-column>
        <el-table-column prop="startTime" label="有效期开始时间"></el-table-column>
        <el-table-column prop="endTime" label="有限期结束时间"></el-table-column>
        <el-table-column prop="addTime" label="添加时间"></el-table-column>
        <el-table-column prop="changeTime" label="修改时间"></el-table-column>
        <el-table-column prop="level" label="折扣">
          <template slot-scope="scope">
            <span>{{scope.row.level === 2? '8折' : scope.row.level === 3? '9折':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editFn(scope.row)">修改</el-button>
            <el-button class="red" type="text" size="small" @click="deleteFn(scope.row.id)">删除</el-button>
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
      :title="editStatus ? '修改角色' : '添加角色'"
      :visible.sync="modalStatus"
      width="30%"
      center
      :close-on-click-modal="false"
      @close="closeModalFn"
    >
      <el-form ref="form" :model="form" label-width="130px">
        <el-form-item label="折扣:" prop="level" :rules="[ { required: true, message: '请选择折扣'}]">
          <el-radio-group v-model="form.level">
            <el-radio label="2">8折</el-radio>
            <el-radio label="3">9折</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="登录手机号:"
          prop="account"
          :rules="[ { required: true, message: '登录手机号不能为空'}]"
        >
          <el-input v-model="form.account" placeholder="请输入登录手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="店铺名称:" prop="store" :rules="[ { required: true, message: '店铺名称不能为空'}]">
          <el-input v-model="form.store" placeholder="请输入店铺名称" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="联系人名称:"
          prop="name"
          :rules="[ { required: true, message: '联系人名称不能为空'}]"
        >
          <el-input v-model="form.name" placeholder="请输入联系人名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone" :rules="[ { required: true, message: '联系电话不能为空'}]">
          <el-input v-model="form.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="权限:"
          prop="whilelistPower"
          :rules="[ { required: true, message: '权限不能为空'}]"
        >
          <el-input v-model="form.whilelistPower" placeholder="请输入权限" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="有效期开始时间:"
          prop="startTime"
          :rules="[ { required: true, message: '有效期开始时间不能为空'}]"
        >
          <el-date-picker
            v-model="form.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择白名单有效期开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="有效期结束时间:"
          prop="endTime"
          :rules="[ { required: true, message: '有效期结束时间不能为空'}]"
        >
          <el-date-picker
            v-model="form.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择白名单有效期结束时间"
          ></el-date-picker>
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
import wlielist from '@/api/wlielist'
import { mapState } from 'vuex'
import { constants } from 'crypto';

let vmData = {
  btnStatus: false, // 按钮禁用状态
  userId: '', // 登录用户ID
  id: '', // 列表ID
  editStatus: false, // 弹窗是否修改
  modalStatus: false, // 弹窗显示状态
  auditsNum: '',  // 查询达人号
  tableData: [],
  form: {
    account: '', // 账户
    store: '', // 店铺名称
    name: '', // 权限
    phone: '', // 联系人电话
    whilelistPower: '', // 权限
    startTime: '', // 有效开始时间
    endTime: '', // 有效结束时间
    level: ''
  },
  page: {
    pageNo: 1,
    pageSize: 10,
    total: null
  },
}

const pageLoad = () => {
  // 获取列表数据
  wlielist.getwhilelistpage({ id: vmData.userId, page: vmData.page.pageNo, size: vmData.page.pageSize }).then(res => {
    if (res && res.code === 200) {
      vmData.tableData = res.data
      vmData.page.pageNo = res.page
      vmData.page.total = res.allCount
    } else {
      vmData.tableData = []
      vmData.page.pageNo = 1
      vmData.page.total = null
    }
  })
}

export default {
  name: 'WhiteList',
  data () {
    return vmData
  },
  computed: {
    ...mapState(['jdb_userInfo'])
  },
  methods: {
    closeModalFn () {
      vmData.btnStatus = false
      vmData.editStatus = false
      vmData.form = {
        account: '', // 账户
        store: '', // 店铺名称
        name: '', // 权限
        phone: '', // 联系人电话
        whilelistPower: '', // 权限
        startTime: '', // 有效开始时间
        endTime: '', // 有效结束时间
        level: ''
      }
    },
    search () { // 搜索
      if (!vmData.auditsNum) {
        pageLoad()
      } else {
        wlielist.getWhilelist({ id: vmData.userId, account: vmData.auditsNum }).then(res => { // 精准搜索
          if (res && res.code === 200) {
            vmData.tableData = []
            vmData.tableData.push(res.data)
            vmData.page.pageNo = 1
            vmData.page.total = 1
          } else {
            vmData.page.pageNo = 1
            vmData.tableData = []
            vmData.page.total = null
          }
        })
      }
    },
    handleSizeChange (val) {
      vmData.page.pageSize = val
      pageLoad()
    },
    handleCurrentChange (val) {
      vmData.page.pageNo = val
      pageLoad()
    },
    editFn (row) {
      vmData.form = { ...row }
      vmData.form.level = String(vmData.form.level)
      vmData.editStatus = true
      vmData.modalStatus = true
    },
    submitFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let requst = vmData.editStatus ? wlielist.changeWlilelist : wlielist.addWlilelist
          if (!vmData.editStatus) {
            vmData.form.id = this.jdb_userInfo.id
          }
          vmData.btnStatus = true
          requst(vmData.form).then(res => {
            if (res && res.code === 200) {
              vmData.modalStatus = false
              vmData.btnStatus = false
              pageLoad()
              this.$message({
                message: vmData.editStatus ? '修改用户成功！' : '添加用户成功！',
                type: 'success',
              });
            } else {
              vmData.btnStatus = false
            }
          })
        }
      })
    },
    deleteFn (id) {
      this.$confirm('是否确定删除此条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        wlielist.deleteWlilelist({ id }).then(res => {
          if (res && res.code === 200) {
            pageLoad()
            this.$message({
              message: '删除成功！',
              type: 'success',
            });
          }
        })
      })
    }
  },
  created () {
    vmData.userId = this.jdb_userInfo.id
  },
  mounted () {
    pageLoad()
  },
  destroyed () {
    Object.assign(this.$data, {
      btnStatus: false, // 按钮禁用状态
      userId: '', // 登录用户ID
      id: '', // 列表ID
      editStatus: false, // 弹窗是否修改
      modalStatus: false, // 弹窗显示状态
      auditsNum: '',  // 查询达人号
      tableData: [],
      form: {
        account: '', // 账户
        store: '', // 店铺名称
        name: '', // 权限
        phone: '', // 联系人电话
        whilelistPower: '', // 权限
        startTime: '', // 有效开始时间
        endTime: '' // 有效结束时间
      },
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
@import "~styles/mixin.scss";
</style>
