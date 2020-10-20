<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-button type="primary" size="small" plain @click="operation(1)">新增白名单</el-button>
        </el-col>
        <el-form inline size="small">
          <el-form-item>
            <el-input clearable v-model="search" placeholder="京店宝账号"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="account" label="京店宝账号"></el-table-column>
        <el-table-column prop="deadline" label="截止时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="operation(2, scope.row.account, scope.row.id)">编辑</el-button>
            <el-button type="text" class="red" @click="deleteAccount(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" class="page" v-if="page.total > 10">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          layout="total, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </el-row>
    </el-main>
    <el-dialog title="新增白名单" :visible.sync="modalStatus" width="30%" center>
      <div class="title">广告宝白名单用户，在发布初中级计划时，无2999元的门槛</div>
      <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="京店宝账号" prop="account">
          <el-input v-model="form.account" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            v-model="form.deadline"
            style="width: 100%;"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="modalStatus = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitFn">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import specialCustomer from 'api/specialCustomer'
import { mapState } from 'vuex'

export default {
    name: 'GgbWhiteList',
    data() {
        return {
            type: 1, // 1：新增 2：修改,
            form: {
                account: '',
                deadline: ''
            },
            disabled: false,
            rules: {
                account: [
                    {
                        required: true,
                        message: '请输入京店宝账号',
                        trigger: 'blur'
                    }
                ],
                deadline: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            chooseId: '',
            modalStatus: false,
            tableData: [],
            page: {
                pageNo: 1,
                pageSize: 10,
                total: null
            },
            search: '',
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            }
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        operation(type, account = undefined, id = undefined) {
            this.modalStatus = true
            if (type === 1) return
            this.form.account = account
            this.disabled = true
            this.chooseId = id
        },
        async pageLoad() {
            let {
                code,
                data,
                msg,
                allCount
            } = await specialCustomer.listByAccount({
                page: this.page.pageNo,
                search: this.search,
                size: this.page.pageSize
            })
            if (code === 200) {
                this.tableData = data
                this.page.total = allCount
            } else if (code === 204) {
                this.tableData = []
                this.page.total = 0
                this.$message.error(msg)
            } else {
                this.$message.error(msg)
            }
        },
        submitFn() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    let operationFn = this.disabled
                        ? specialCustomer.changeWhiteList({
                              id: this.chooseId,
                              deadline: this.form.deadline
                          })
                        : specialCustomer.saveWhiteList(this.form)
                    let { code, msg } = await operationFn
                    if (code === 200) {
                        this.modalStatus = false
                        this.$message.success(msg)
                        this.pageLoad()
                    } else {
                        this.$message.error(msg)
                    }
                }
            })
        },
        async deleteAccount(id) {
            let { code, msg } = await specialCustomer.deleteWhiteList({ id })
            if (code === 200) {
                this.$message.success(msg)
                this.search = ''
                this.tableData.length === 1 && this.page.total > 10
                    ? this.page.pageNo--
                    : ''
                this.pageLoad()
            } else {
                this.$message.error(msg)
            }
        },
        handleCurrentChange(val) {
            this.search = ''
            this.page.pageNo = val
            this.pageLoad()
        },
        searchFn() {
            this.page.pageNo = 1
            this.pageLoad()
        }
    },
    watch: {
        modalStatus(val) {
            if (!val) {
                this.form = { account: '', deadline: '' }
                this.disabled = false
            }
        }
    },
    created() {
        this.pageLoad()
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/tableMixins';
.title {
    text-align: center;
    padding-bottom: 20px;
    color: #999;
}
</style>
