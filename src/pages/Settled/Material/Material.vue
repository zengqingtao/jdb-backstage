<template>
  <el-container>
    <el-tabs class="tabs" v-model="activeName" type="card" @tab-click="tabsFn">
      <el-tab-pane label="POP" name="0"></el-tab-pane>
      <el-tab-pane label="自营" name="1"></el-tab-pane>
    </el-tabs>

    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4"></el-col>
        <el-form inline size="small">
          <el-form-item class="mg-l-10" label="手机号:">
            <el-input clearable v-model="search" placeholder="手机号"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="content" :label="activeName === '0' ? '开店区域' : '一级类目'">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="weChat" label="微信号">
        </el-table-column>
        <el-table-column prop="city" label="所在城市">
        </el-table-column>
        <el-table-column prop="connectTime" label="开店沟通时段">
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间">
        </el-table-column>
        <el-table-column prop="shopName" label="店铺名称">
          <template slot-scope="scope">{{ scope.row.shopName ? scope.row.shopName : '-' }}</template>
        </el-table-column>
        <el-table-column prop="shopUrl" label="店铺链接">
          <template slot-scope="scope">
            <a v-if="scope.row.shopUrl" :href="scope.row.shopUrl">{{ scope.row.shopUrl }}</a>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-col v-if="scope.row.status === 0 && scope.row.live === 0">
                <div><el-button type="text" @click="modalShow(scope.row)">录入入驻信息</el-button></div>
                <div><el-button type="text" @click="rejectFn(scope.row.id)">驳回入驻申请</el-button></div>
              </el-col>
              <el-button type="text" @click="modalShow(scope.row)" v-else-if="scope.row.status === 1">修改入驻信息</el-button>
              <p v-else-if="scope.row.live === 1">{{ scope.row.reason }}</p>
            </el-row>
          </template>
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

    <el-dialog :title="editStatus ? '修改入驻信息':'录入入驻信息'" :visible.sync="modalStatus" width="35%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" size="small" :model="form" label-width="90px">
        <el-form-item label="店铺名称:" prop="shopName" :rules="[ { required: true, message: '店铺名称不能为空'}]">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="店铺链接:" prop="shopUrl" :rules="[ { required: true, message: '店铺链接不能为空'}]">
          <el-input v-model="form.shopUrl" placeholder="请输入店铺链接" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="closeModalFn">取消</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import tableMixins from 'mixins/tableMixins'
import enter from 'api/enter'

export default {
  name: 'Material',
  mixins: [tableMixins],
  data () {
    return {
      activeName: '0',
      editStatus: false,
      form: {
        id: '',
        shopName: '',
        shopUrl: ''
      }
    }
  },
  methods: {
    async pageLoad () {
      const { code, data, page, allCount } = await enter.listInfo({ type: this.activeName, page: this.page.pageNo, phone: this.search })
      this.tableData = code === 200 ? data : []
      this.page.pageNo = code === 200 ? page : 1
      this.page.total = code === 200 ? allCount : null
    },
    tabsFn() {
      this.search = ''
      this.pageLoad()
    },
    rejectValidateFn(value) {
      if (value === '' || !value) return false
    },
    rejectFn (id) {
      this.$prompt('请输入驳回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.rejectValidateFn,
        inputErrorMessage: '驳回原因不能为空',
        inputType: 'textarea'
      }).then( async ({ value }) => {
        const { code, msg } = await enter.changeLive({ id, reason: value })
        this.$message({
          type: code === 200 ? 'success' : 'error',
          message: msg
        })
        this.pageLoad()
      })
    },
    modalShow({ id, shopName, shopUrl, status }) {
      this.editStatus = status === 0 ? false : true
      this.form = { id, shopName, shopUrl }
      this.modalStatus = true
    },
    submitFn() {
      this.$refs['form'].validate(async valid => {
        if(valid) {
          this.btnStatus = true
          const { code, msg } = await enter.changeInfo(this.form)
          this.btnStatus = false
          if(code === 200) {
            this.$message.success(msg)
            this.closeModalFn()
            this.pageLoad()
          } else {
            this.$message.error(msg)
          }
        }
      })
    },
    closeModalFn() {
      this.modalStatus = this.editStatus = false
      this.form = {
        shopName: '',
        shopUrl: ''
      }
    }
  },
  created() {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .tabs {
    margin-top: 20px;
  }
  .header {
    .el-input {
      width: 74%;
      margin-right: 10px;
    }
  }
</style>
