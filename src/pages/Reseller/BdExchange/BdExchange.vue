<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="dialogVisible=true">新增调整</el-button>
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="请输入京店宝账号" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="createTime" label="时间">
          <template slot-scope="scope">{{time(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column prop="userPhone" label="京店宝账号"></el-table-column>
        <el-table-column prop="bdName" label="归属BD"></el-table-column>
        <el-table-column prop="operator" label="操作人"></el-table-column>
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

    <el-dialog title="新增调整" :visible.sync="dialogVisible" width="30%" center>
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item
          label="京店宝账号："
          prop="userPhone"
          :rules="[{ required: true, message: '请输入京店宝账号', trigger: 'blur' }]"
        >
          <el-input v-model="form.userPhone" placeholder="请输入京店宝账号"></el-input>
        </el-form-item>
        <el-form-item
          label="归属BD："
          prop="bdName"
          :rules="[{required:true,message:'请选择归属BD',trigger:'blur'}]"
        >
          <el-input v-model="form.bdName" placeholder="请输入归属BD"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import Reseller from 'api/reseller'
import untils from '@/assets/js/untils'
export default {
  name: 'ShareCode',
  data() {
    return {
      search: '',
      tableData: [],
      page: {
        // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      form: {
        userPhone: '',
        bdName: ''
      },
      dialogVisible: false
    }
  },
  created() {
    this.pageLoad()
  },
  methods: {
    time(val) {
      return untils.formatTime(val)
    },
    searchFn() {
      this.page.pageNo = 1
      this.pageLoad()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.pageLoad()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    async pageLoad() {
      const results = await Reseller.listExchangeBd({
        page: this.page.pageNo,
        userPhone: this.search
      })
      if (results.code === 200) {
        this.tableData = results.data
        this.page.total = results.allCount
        this.page.total = results.size
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = 0
      }
    },
    submitForm(formName) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let params = {
            userPhone: this.form.userPhone,
            bdName: this.form.bdName
          }
          const { data, code, msg, size } = await Reseller.exchageBd(params)
          if (code === 200) {
            this.$message.success(`调整成功`)
            this.pageLoad()
            this.$set(this, 'form', { userPhone: '', bdName: '' })
            this.dialogVisible = false
          }
        } else {
          return false
        }
      })
    }
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
  width: 100%;
}
</style>