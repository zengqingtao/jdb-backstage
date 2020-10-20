<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="8">
        </el-col>
        <el-col :span="9" class="text-right">
            <el-select v-model="planValue" placeholder="请选择计划类型" size="small">
                <el-option v-for="item in planOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="7" class="text-right">
          <el-input v-model="search" placeholder="请输入要查询的店铺名称" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="SearchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="releaseTime" label="发布时间">
        </el-table-column>
        <el-table-column prop="name" label="店铺">
        </el-table-column>
        <el-table-column prop="type"  label="计划类型">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
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

    <el-dialog title="查询数据" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="111px">
        <el-form-item label="京准通Cookie:" prop="cookie" :rules="[ { required: true, message: '京准通Cookie不能为空'}]">
          <el-input type="textarea" :rows="5" placeholder="请输入京准通Cookie" v-model="form.cookie" clearable></el-input>
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
import adsTask from 'api/adsTask'

export default {
  name: 'Details',
  data () {
    return {
      form: {
        taskId: '',
        cookie: '',
      },
      btnStatus: false,
      modalStatus: false,
      search: '',
      planOptions: [
        {value: -1, label: '全部'},
        {value: 0, label: '全品营销计划'},
        {value: 1, label: '精准爆破计划'},
        {value: 2, label: '爆款投放计划'},
        {value: 3, label: '超级推荐计划'},
      ],
      planValue: -1,
      tableData: [],
      page: {
        pageNo: 1,
        size: 10,
        total: null
      }
    }
  },
  methods: {
    closeModalFn () {
      this.btnStatus = this.modalStatus = false
      this.form = {
        taskId: '',
        cookie: '',
      }
    },
    modalShow (id) {
      this.modalStatus = true
      this.form.taskId = id
    },
    submitFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          adsTask.getAdsTaskDetail(this.form).then(res => {
            this.closeModalFn()
            this.pageLoad()
            this.$message({
              type: res.code === 200 ? 'success' : 'warning',
              message: res.code === 200 ? '操作成功' : res.msg
            })
          })
        }
      })
    },
    async pageLoad () {
      const res = await adsTask.listTaskDetail({ page: this.page.pageNo, size:this.page.size ,name: this.search, type:this.planValue, accountId: this.$route.query.userId })
      if (res.code === 200) {
        const { data: results, page, count } = res.data
        this.page.pageNo = page
        this.page.total = count
        this.tableData = results
      } else {
        this.page.pageNo = 1
        this.page.total = null
        this.tableData = []
        this.$message.error(res.msg)
      }
    },
    SearchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    async changeFn (taskId, status) {
      const res = await adsTask.changeAdsTaskStatus({ taskId, status})
      if (res.code === 200) {
        this.pageLoad()
        this.$message.success('操作成功')
      } else {
        this.$message.success(res.msg)
      }
    },
  },
  async created () {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  @import "~styles/mixin";
  .w220 {
    width: 220px;
  }
</style>
