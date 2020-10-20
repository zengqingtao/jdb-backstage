<template>
  <el-container class="main">
    <el-header class="header">
      <el-row>
        <div>
          <span class="mg-l-10 bold">余额：{{ balance }}</span>
          <span class="mg-l-10 bold">押金余额：{{ deposit }}</span>
          <span class="mg-l-10 bold">可提现余额：{{ usable }}</span>
          <el-button class="mg-l-10" type="text" @click="reLoad">刷新</el-button>
          <el-button class="mg-l-10" size="small" type="primary" plain @click="modalShow">提现</el-button>
        </div>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="date" label="提现时间">
        </el-table-column>
        <el-table-column prop="money" label="提现金额">
        </el-table-column>
        <el-table-column prop="getTime" label="到账时间">
        </el-table-column>
        <el-table-column prop="aliPayNo" label="支付宝流水号">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column prop="username" label="操作人名称">
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

    <el-dialog title="领啦提现" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" :rules="rule" size="small" label-width="85px">
        <el-form-item label="提现金额:" prop="money" required>
          <el-input placeholder="请输入提现金额" v-model.number="form.money" clearable></el-input>
        </el-form-item>
        <el-form-item label="提现密码:" prop="password">
          <el-input type="password" placeholder="请输入提现密码" v-model="form.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="form.remark" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import testGuest from 'api/testGuest'
import tableMixins from 'mixins/tableMixins'
import { mapState } from 'vuex'

export default {
  name: 'LinglaBalance',
  mixins: [tableMixins],
  data () {
    return {
      balance: 0,
      deposit: 0,
      usable: 0,
      form: {
        money: '',
        password: '',
        remark: '',
      },
      rule: {
        money: [{ required: true, message: '提现金额不能为空'},{
          validator: (rule, value, callback) => {
            if (value <= 0) {
              callback(new Error('提现金额必须大于0'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        password: [{ required: true, message: '提现密码不能为空'}]
      }
    }
  },
  computed: {
    ...mapState(['jdb_userInfo'])
  },
  methods: {
    closeModalFn () {
      this.modalStatus = this.btnStatus = false
      this.$refs['form'].resetFields()
    },
    modalShow () {
      this.modalStatus = true
    },
    async reLoad () {
      const res = await testGuest.getLinglaBalance()
      if (res.code === 200) {
        this.balance = res.data.balance
        this.deposit = res.data.deposit
        this.usable = res.data.usable
      } else {
        this.balance = 0
        this.deposit = 0
      }
    },
    async pageLoad () {
      const res = await testGuest.listManageWithdrawRecord({ page: this.page.pageNo })
      if (res.code === 200) {
        this.tableData = res.data.results
        this.page.pageNo = res.data.pageNo
        this.page.total = res.data.totalCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
    submitFn () {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const requestForm = {...this.form, userId: this.jdb_userInfo.id, username: this.jdb_userInfo.name}
          this.btnStatus = true
          const res = await testGuest.withdrawMoney(requestForm)
          if (res.code === 200) {
            this.$message.success('提现成功')
            this.closeModalFn()
            this.pageLoad()
            this.reLoad()
          } else {
            this.btnStatus = false
            this.$message.error(res.msg)
          }
        }
      })
    }
  },
  created () {
    this.pageLoad()
    this.reLoad()
  }
}
</script>

<style lang="scss" scoped>
  @import "~styles/mixin.scss";
</style>