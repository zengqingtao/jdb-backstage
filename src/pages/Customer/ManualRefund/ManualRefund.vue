<template>
  <div class="container">
    <div class="add-btn">
      <el-button type="primary" size="small" @click="showDialog=true">添加退款</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column prop="jdbAccount" label="登录手机号"></el-table-column>
      <el-table-column prop="project" label="所属产品"></el-table-column>
      <el-table-column prop="taskId" label="任务编号"></el-table-column>
      <el-table-column prop="discount" label="折扣"></el-table-column>
      <el-table-column prop="totalRefund" label="退款总金额"></el-table-column>
      <el-table-column prop="accountRefund" label="账户退款金额"></el-table-column>
      <el-table-column prop="description" label="描述" width="320px"></el-table-column>
      <el-table-column prop="operationTime" label="操作时间" width="102px"></el-table-column>
      <el-table-column prop="operator" label="操作人"></el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="500px"
      center
      :modal-append-to-body="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="登录手机号：" prop="phone">
          <el-input
            v-model="form.phone"
            size="small"
            v-debounce-input="checkPhone"
            debounce-second="0.5"
            placeholder="请输入登录手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属产品：">
          <span>{{form.product}}</span>
        </el-form-item>
        <el-form-item label="任务编号：" prop="taskId">
          <el-input
            v-model="form.taskId"
            size="small"
            v-debounce-input="checkTaskId"
            debounce-second="0.5"
            placeholder="请输入任务编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="会员折扣：">
          <span>{{form.discount | discountText}}</span>
        </el-form-item>
        <el-form-item label="退款金额：" prop="refundAmount">
          <el-input v-model="form.refundAmount" size="small" placeholder="请输入退款金额"></el-input>
        </el-form-item>
        <el-form-item label="账户退款金额：">
          <span>{{accountRefundAmount||0}}元</span>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            maxlength="100"
            rows="6"
            show-word-limit
            placeholder="请描述退款原因，例如缺少的量"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button type="primary" size="small" @click="submitFn" :loading="submitLoading">提 交</el-button>
        <el-button size="small" @click="showDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <y-pagination
      :page="pagination"
      justify="end"
      layout="prev, pager, next"
      @current-change="getPageList"
    ></y-pagination>
  </div>
</template>
<script>
import customer from 'api/customer'
import YPagination from 'components/pagination'
import validateDecorator from 'js/validateDecorator.js'
//做一些符合校验
function phone() {
  this.customerCheck = function (rule, value, callback) {
    console.log('phone', rule)
  }
}
function taskId() {
  this.customerCheck = function (rule, value, callback) {
    console.log('taskId', rule)
  }
}
const phoneValidate = new validateDecorator(new phone()).check
const taskIdValidate = new validateDecorator(new taskId()).check
// 考虑到了空格的影响
const amountValidate = (rule, value, callback) => {
  if (!+value && !isNaN(+value)) {
    callback(new Error('退款金额不能为空，和大于0'))
  } else if (isNaN(+value)) {
    callback(new Error('退款金额输入有误'))
  } else {
    callback()
  }
}
export default {
  components: {
    YPagination
  },
  data() {
    return {
      tableData: [],
      tableLoading: true,
      showDialog: false,
      form: {
        phone: '', //登录手机号
        product: '人气宝', //所属产品
        taskId: '', //任务编号
        discount: '', //会员折扣
        // randomProportion: '', //随机立减比例
        refundAmount: '', //退款金额
        description: '' //描述
      },
      rules: {
        phone: [
          {
            required: true,
            message: '登录手机号不能为空',
            trigger: ['blur', 'change']
          },
          {
            validator: phoneValidate,
            trigger: 'blur'
          }
        ],
        taskId: [
          {
            required: true,
            message: '任务编号不能为空',
            trigger: ['blur', 'change']
          },
          {
            validator: taskIdValidate,
            trigger: 'blur'
          }
        ],
        refundAmount: [
          {
            required: true,
            validator: amountValidate,
            trigger: ['blur', 'change']
          }
        ],
        description: [
          {
            required: true,
            message: '退款描述不能为空',
            trigger: ['blur', 'change']
          }
        ]
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      submitLoading: false
    }
  },
  filters: {
    discountText: function (val) {
      return val === 0.9 ? '九折' : val === 0.8 ? '八折' : '无'
    }
  },
  computed: {
    accountRefundAmount() {
      //退款的账户余额=退款金额*折扣*(1-随机立减比例)
      let num = this.form.refundAmount * this.form.discount
      // this.form.discount *
      // (1 - this.form.randomProportion)
      num = num.toFixed(2)
      return num
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    checkPhone() {
      if (!this.form.phone) return
      //校验登录手机号
      let params = {
        jdbPhone: this.form.phone.trim()
      }
      customer.checkJdbUserByPhone(params).then((res) => {
        if (res.code === 200) {
          phoneValidate.error = ''
        } else {
          phoneValidate.error = res.msg
        }
        //手动校验
        this.$refs.form.validateField('phone')
      })
    },
    checkTaskId() {
      if (!this.form.phone || phoneValidate.error || !this.form.taskId) return
      // if (phoneValidate.error || !this.form.taskId) return
      let params = {
        jdbPhone: this.form.phone.trim(),
        taskId: this.form.taskId.trim()
      }
      customer.getFlowTaskPayInfo(params).then((res) => {
        if (res.code === 200) {
          this.form.discount = res.data.discount
          // this.form.randomProportion = res.data.promotion
          taskIdValidate.error = ''
        } else {
          taskIdValidate.error = res.msg
        }
        this.$refs.form.validateField('taskId')
      })
    },
    submitFn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          let params = {
            jdbPhone: this.form.phone.trim(),
            taskId: this.form.taskId.trim(),
            refundMoney: this.form.refundAmount.trim(),
            content: this.form.description
          }
          customer
            .flowHandleRefund(params)
            .then((res) => {
              this.submitLoading = false
              if (res.code === 200) {
                this.showDialog = false
                this.pagination.pageNo = 1
                this.getPageList()
              } else if (res.code === 8027) {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              this.submitLoading = false
            })
        }
      })
    },
    getPageList() {
      //获取手动退款列表
      this.tableLoading = true
      let params = {
        page: this.pagination.pageNo,
        size: this.pagination.pageSize
      }
      customer
        .listFlowManageRefund(params)
        .then((res) => {
          this.tableLoading = false
          if (res.code === 200) {
            this.tableData = res.data.results
            this.pagination.total = res.data.totalCount
          } else {
            this.tableData = []
            this.pagination.total = null
          }
        })
        .catch((err) => {
          this.tableLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.add-btn {
  /deep/ .el-button {
    margin: 20px 0 20px 30px;
  }
}
/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__body {
  padding: 35px 35px 30px;
}
.btn-group {
  text-align: center;
}
/deep/ .el-textarea .el-input__count {
  height: 20px;
  line-height: 20px;
}
</style>