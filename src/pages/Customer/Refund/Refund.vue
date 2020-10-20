<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button type="primary" plain size="small" @click="modalStatus = true">退款申请</el-button>
        </el-col>
        <el-col :span="7" :offset="8" class="text-right">
          <el-input v-model="search" placeholder="客户姓名、联系电话、京店宝账号" size="small" clearable></el-input>
          <el-button class="mg-l-10" type="primary" size="small" @click="SearchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column label="退款类型">
          <template slot-scope="scope">
            {{ scope.row.refundType === 0 ? '京店宝退款' : '押金退款' }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名">
        </el-table-column>
        <el-table-column prop="phone" label="联系方式">
        </el-table-column>
        <el-table-column prop="account" label="京店宝账号">
        </el-table-column>
        <el-table-column prop="giveMoney" label="累计赠送金额">
        </el-table-column>
        <el-table-column prop="balance" label="平台需退款金额">
        </el-table-column>
        <el-table-column prop="money" label="实际退款金额">
        </el-table-column>
        <el-table-column prop="refundReason" label="退款原因">
        </el-table-column>
        <el-table-column label="申请时间">
          <template slot-scope="scope">
            {{ scope.row.createTime ? timeFn(scope.row.createTime) : null }}
          </template>
        </el-table-column>
        <el-table-column prop="alipay" label="支付宝账号">
        </el-table-column>
        <el-table-column prop="alipayName" label="支付宝姓名">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0">
              <el-button type="text" @click="passFn(scope.row.id)">通过</el-button>
              <el-button type="text" @click="rejectShow(scope.row.id)">驳回</el-button>
            </div>
            <!-- <div v-else-if="scope.row.type === 0">待审批</div> -->
            <div v-else-if="scope.row.type === 1">通过</div>
            <div v-else-if="scope.row.type === 2">
              <div>驳回</div>
              <div>驳回原因：{{ scope.row.reason }}</div>
            </div>
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
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog title="退款申请" :visible.sync="modalStatus" width="35%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :rules="form.refundType === 0 ? rules : rules2" :model="form" label-width="125px">
        <el-form-item label="退款类型:" prop="refundType" :rules="[ { required: true, message: '退款类型不能为空'}]">
          <el-radio-group v-model="form.refundType">
            <el-radio :label="0">京店宝余额退款</el-radio>
            <el-radio :label="1">押金余额退款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户姓名:" prop="name" :rules="[ { required: true, message: '客户姓名不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone" :rules="[ { required: true, message: '联系方式不能为空'}]">
          <el-input  v-model="form.phone" placeholder="请输入联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item label="京店宝账号:" prop="account" :rules="[ { required: true, message: '京店宝账号不能为空'}]">
          <el-input v-model="form.account" placeholder="请输入京店宝账号" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="form.refundType === 0" label="累计赠送金额:" prop="giveMoney">
          <el-input v-model.number="form.giveMoney" placeholder="请输入累计赠送金额" clearable @blur="getMoney"></el-input>
        </el-form-item>
        <el-form-item label="平台需退款金额:" prop="balance">
          <el-input v-model.number="form.balance" placeholder="请输入平台需退款金额" clearable @blur="getMoney"></el-input>
        </el-form-item>
        <el-form-item label="实际退款额:">
          <el-input class="w350" v-model="form.money" clearable  disabled></el-input>
          <el-tooltip class="item" effect="dark" :content="form.refundType === 0 ? '实际退款额 =（平台余额 - 累计赠送金额）* 90%' : '实际退款额 = 平台余额 * 90%'" placement="right">
            <i class="el-icon-question font30"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="退款原因:" prop="refundReason" :rules="[ { required: true, message: '退款原因不能为空'}]">
          <el-input v-model="form.refundReason" type="textarea" :rows="3" placeholder="请输入退款原因" clearable></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号:" prop="alipay" :rules="[ { required: true, message: '支付宝账号不能为空'}]">
          <el-input v-model="form.alipay" placeholder="请输入支付宝账号"></el-input>
        </el-form-item>
        <el-form-item label="支付宝姓名:" prop="alipayName" :rules="[ { required: true, message: '支付宝姓名不能为空'}]">
          <el-input v-model="form.alipayName" placeholder="请输入支付宝姓名"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col class="text-center">
          <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">立即提交</el-button>
        </el-col>
        <el-col class="text-center mg-t-10">
          <span class="gray">审批将在15天内完成</span>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="rejectStatus" width="35%" center :close-on-click-modal="false" @close="closeRejectModalFn">
      <el-form ref="rejectForm" :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因:" prop="reason" :rules="[ { required: true, message: '驳回原因不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="rejectForm.reason" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="rejectFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="rejectStatus = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import refund from 'api/refund'
import untils from 'js/untils'

export default {
  name: 'Refund',
  data () {
    const validateGiveMoney = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('累计赠送金额不能为空'))
      } else if(Number(value) < 0) {
        callback(new Error('累计赠送金额必须大于等于0'))
      } else if(!Number(value) && value !== 0) {
        callback(new Error('累计赠送金额必须为数字'))
      } else {
        callback()
      }
    }
    const validateBalance = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('平台需退款金额不能为空'))
      } else if(value <= 0) {
        callback(new Error('平台需退款金额必须大于0'))
      } else if(!Number(value) && value !== 0) {
        callback(new Error('平台需退款金额必须为数字'))
      } else {
        callback()
      }
    }
    return {
      id: '', // 列表ID
      search: '',
      btnStatus: false, // 按钮禁用状态
      modalStatus: false, // 弹窗显示状态
      rejectStatus: false, // 驳回弹窗显示状态
      tableData: [],
      form: {
        refundType: 0, // 退款类型
        name: '', // 客户姓名
        phone: '', // 客户电话
        giveMoney: '', // 累计赠送金额
        account: '', // 京店宝账号
        balance: '', // 平台余额
        money: 0, // 实际退款金额
        refundReason: '', // 退款原因
        alipayName: '', // 支付宝账户
        alipay: '' // 支付宝姓名
      },
      rejectForm: {
        reason: ''
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      rules: {
        giveMoney: [
          { required: true, validator: validateGiveMoney, trigger: 'change' }
        ],
        balance: [
          { required: true, validator: validateBalance, trigger: 'change' }
        ]
      },
      rules2: {
        balance: [
          { required: true, validator: validateBalance, trigger: 'change' }
        ]
      },
    }
  },
  computed: {
    ...mapState(['jdb_userInfo'])
  },
  watch: {
    'form.refundType' (val) {
      if (val === 0) {
        this.form.giveMoney = ''
        this.form.money = 0
      } else {
        this.form.giveMoney = 0
        this.form.money = 0
        this.getMoney()
      }
    }
  },
  methods: {
    timeFn (val) {
      return untils.formatTime(val)
    },
    SearchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    async pageLoad () {
       const res = await refund.getRefundList({ page: this.page.pageNo, size: this.page.pageSize, search: this.search })
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
    closeRejectModalFn () {
      this.rejectStatus = false
      this.btnStatus = false
      this.rejectForm = {
        reason: ''
      }
    },
    passFn (id) {
      refund.refundReview({ type: 1, id, userId: this.jdb_userInfo.id, reason: '' }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.pageLoad()
        }
      })
    },
    rejectShow (id) {
      this.id = id
      this.rejectStatus = true
    },
    rejectFn () {
      this.$refs['rejectForm'].validate(valid => {
        if (valid) {
          this.btnStatus = true
          refund.refundReview({ type: 2, id: this.id, userId: this.jdb_userInfo.id, reason: this.rejectForm.reason }).then(res => {
            this.btnStatus = false
            if (res.code === 200) {
              this.closeRejectModalFn()
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.pageLoad()
            }
          })
        }
      })
    },
    closeModalFn () {
      this.modalStatus = false
      this.btnStatus = false
      this.form = {
        refundType: 0, // 退款类型
        name: '', // 客户姓名
        phone: '', // 客户电话
        giveMoney: '', // 累计赠送金额
        account: '', // 京店宝账号
        balance: '', // 平台余额
        money: 0, // 实际退款金额
        refundReason: '', // 退款原因
        alipayName: '', // 支付宝账户
        alipay: '' // 支付宝姓名
      }
    },
    getMoney () {
      if (this.form.giveMoney !== '' && Number(this.form.giveMoney) >= 0 && this.form.balance !== '' && Number(this.form.balance) >= 0) {
        refund.getRefundMoney({ giveMoney: this.form.giveMoney, balance: this.form.balance }).then(res => {
          this.form.money = res
        })
      }
    },
    submitFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnStatus = true
          let list = this.form
          list.id = this.jdb_userInfo.id
          refund.addRefund({ ...list }).then(res => {
            this.btnStatus = false
            if (res.code === 200) {
              this.closeModalFn()
              this.pageLoad()
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        }
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.pageLoad()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.pageLoad()
    },
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
  }
  .el-dialog {
    .w350 {
      width: 85%;
      margin-right: 10px;
    }
    .font30 {
      font-size: 20px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
  .gray {
    color: #999999;
  }
</style>