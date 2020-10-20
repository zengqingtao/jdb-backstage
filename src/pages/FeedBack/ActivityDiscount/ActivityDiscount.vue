<template>
  <el-container>
    <el-main class="main">
      <el-header class="header">
        <el-button type="primary" plain size="small" @click="modalStatus = true">添加活动用户</el-button>
      </el-header>
      <el-table :data="tableData">
        <el-table-column prop="account" label="京店宝账号">
        </el-table-column>
        <el-table-column prop="rechargeTime" label="充值时间">
        </el-table-column>
        <el-table-column prop="rechargeMoney" label="充值金额">
        </el-table-column>
        <el-table-column prop="giveTime" label="赠送时间">
        </el-table-column>
        <el-table-column prop="giveMoney" label="赠送金额">
        </el-table-column>
        <el-table-column prop="balanceGiveMoney" label="可用赠送金额">
        </el-table-column>
        <el-table-column prop="userGiveMoney" label="已用赠送金额">
        </el-table-column>
        <el-table-column prop="userName" label="操作人">
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
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog title="添加活动用户" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" size="small" label-width="110px">
        <el-form-item label="京店宝账号:" prop="account" :rules="[ { required: true, message: '京店宝账号不能为空'}]">
          <el-input placeholder="请输入京店宝账号" v-model="form.account" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单号:" prop="orderId" :rules="[ { required: true, message: '订单号不能为空'}]" >
          <el-row type="flex">
            <el-input placeholder="请输入订单号" v-model="form.orderId" clearable @blur="searchOrderFn"></el-input>
          </el-row>
        </el-form-item>
        <el-form-item label="充值时间:" prop="date">
          <el-input disabled placeholder="充值时间" v-model="form.date"></el-input>
        </el-form-item>
        <el-form-item label="充值金额:" prop="money">
          <el-input disabled placeholder="充值金额" v-model="form.money"></el-input>
        </el-form-item>
        <el-form-item label="赠送金额:">
          <el-input disabled v-model="form.money"></el-input>
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
import tableMixins from 'mixins/tableMixins'
import discount from 'api/discount'
import untils from 'js/untils'

export default {
  name: 'ActivityDiscount',
  mixins: [tableMixins],
  data () {
    return {
      form: {
        account: '',
        orderId: '',
        date: '',
        money: ''
      }
    }
  },
  methods: {
    async pageLoad () {
      const res = await discount.discountList({ page: this.page.pageNo, size: this.page.pageSize ,search:""})
      if (res.code === 200) {
        this.tableData = res.data
        this.page.pageNo = res.page
        this.page.total = res.allCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
    closeModalFn () {
      this.modalStatus = this.btnStatus = false
      this.resetForm();
    },
    async searchOrderFn () {
      if (!this.form.orderId || !this.form.account) return
      const res = await discount.searchOrder({ orderId: this.form.orderId, account: this.form.account })
      if (res.code === 200) {
        const { money, createTime } = res.data
        const date = untils.formatTime(createTime)
        this.form = {
          ...this.form,
          date,
          money
        }
        return true
      } else if (res.code === 204) {
        this.$message.error(res.msg)
        return false
      }
    },
    async submitFn () {
      let bool = await this.searchOrderFn()
      if(!bool) return
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.btnStatus = true
          const params = {
            ...this.form,
            giveMoney:this.form.money,
            id:this.$store.state.jdb_userInfo.id
          }
          const res = await discount.discountAdd(params)
          this.btnStatus = false
          if (res.code === 200) {
            this.closeModalFn()
            this.$message.success(res.msg || '添加成功！')
            this.pageLoad()
          }
        } 
      })
    },
    resetForm(){
      this.$refs['form'].resetFields();
    }
  },
  created () {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .el-date-editor.el-input, .el-date-editor.el-input__inner, .el-select {
    width: 100% !important;
  }
</style>
