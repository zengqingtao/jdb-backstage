<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button type="primary" plain size="small" @click="modalStatus = true">添加任务</el-button>
          <el-button type="primary" plain size="small" @click="AccountStatus = true">添加京东账户</el-button>
          <el-button type="primary" plain size="small" @click="AccountListLoad">查看京东账户</el-button>
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="任务名称/状态" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="name" label="任务名称">
        </el-table-column>
        <el-table-column prop="shopNumber" label="店铺数量">
        </el-table-column>
        <el-table-column prop="failNumber" label="发送失败数量">
        </el-table-column>
        <el-table-column prop="statusString" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.status === 0" @click="deleteFn(scope.row.id)">删除</el-button>
            <el-button type="text" size="small" @click="DetailsShow(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
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

    <el-dialog title="任务添加" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="85px">
        <el-form-item label="任务名称:" prop="name" :rules="[ { required: true, message: '任务名称不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入任务名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务标签:" prop="label" :rules="[ { required: true, message: '任务标签不能为空'}]">
          <el-input v-model="form.label" placeholder="请输入任务标签" clearable></el-input>
        </el-form-item>
        <!--<el-form-item label="发送文字:" prop="content" :rules="[ { required: true, message: '发送文字不能为空'}]">-->
          <!--<el-input type="textarea" :rows="3"  v-model="form.content" placeholder="请输入发送文字"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="图片:">
          <el-upload
            class="upload-demo"
            action="null"
            :file-list="files"
            :on-change="handlePreview"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="3"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="温馨提示:" class="heightColor">
          <div>任务将在每天08:00-21:00自动运行</div>
          <div>若当前无任务并且在运行时间内，任务发布即自动进行</div>
          <div>若当前有任务，任务发布之后，将在已有任务完成之后进行</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看详情" :visible.sync="detailsStatus" width="35%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-row>
        <el-col class="bold">{{ detailsData.name }}</el-col>
        <el-col class="mg-t-10">
          <el-tag>{{ detailsData.label }}</el-tag>
        </el-col>
        <el-col class="mg-t-10 font14 word">{{ detailsData.content }}</el-col>
        <el-col class="mg-t-10">
          <el-row type="flex">
            <el-col class="images" v-if="imageArry && imageArry.length > 0" v-for="(item, index) of imageArry" :key="index">
              <img @click="imageStatus = true" :src="item" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="hr">
        <el-col>全部 <span class="font18">{{ taskShopList.shopNumber }}</span> 个店铺</el-col>
        <el-col>发送成功 <span class="font18">{{ taskShopList.successNumber }}</span> 个店铺</el-col>
        <el-col>发送失败 <span class="font18">{{ taskShopList.failNumber }}</span> 个店铺</el-col>
      </el-row>
      <el-table :data="taskFailData">
        <el-table-column prop="shopName" label="店铺名称">
        </el-table-column>
        <el-table-column label="接收时间">
          <template slot-scope="scope">
            {{ timeFn(scope.row.receiveTime) }}
          </template>
        </el-table-column>
        <el-table-column label="发送结果">
          <template slot-scope="scope">
            <div><span class="redRadius"></span>失败</div>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="失败原因">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="details.total"
            @current-change="detailCurrentChange"
            :current-page="details.pageNo"
            layout="total, prev, pager, next"
            :total="details.total">
          </el-pagination>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看图片" :visible.sync="imageStatus" :width="imgWidth + 'px'" center :close-on-click-modal="false">
      <el-carousel :height="imgHeight + 'px'" ref="carousel" trigger="click" indicator-position="outside" :autoplay="false" @change="changeImages">
        <el-carousel-item name="index" v-for="(item, index) in imageArry" :key="index">
          <img ref="imgItem" :src="item" @load="imgLoad()">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <el-dialog title="添加京东账户" :visible.sync="AccountStatus" width="33%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form label-width="110px">
        <el-upload
          ref="addUpload"
          :headers="{ token }"
          :action="addFileUrl"
          :on-success="addFileSuccessFn"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form>
      <el-table :data="addJDFileTable" v-if="addJDFileTable && addJDFileTable.length > 0" :height="528">
        <el-table-column prop="name" label="京东账户">
        </el-table-column>
        <el-table-column prop="password" label="京东账户密码">
        </el-table-column>
        <el-table-column prop="result" label="失败原因">
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="京东账户列表" :visible.sync="AccountListStatus" width="35%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-row type="flex" class="row-bg mg-b-10" justify="end">
        <el-col class="text-right">
          <el-input style="width: 45% !important;" v-model="accountSearch" placeholder="京东账户" size="small" clearable></el-input>
          <el-button class="mg-l-10" type="primary" size="small" @click="accountSearchFn">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="AccountList">
        <el-table-column prop="name" label="京东账户">
        </el-table-column>
        <el-table-column prop="password" label="京东账户密码">
        </el-table-column>
        <el-table-column label="状态 ">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '未使用' : scope.row.status === 1 ? '正在使用中' : '已过期' }}
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="accountPage.total"
            :pager-count="pageCount"
            @current-change="AccountListCurrentChange"
            :current-page="accountPage.pageNo"
            layout="total, prev, pager, next, jumper"
            :total="accountPage.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </el-container>
</template>

<script>
import task from 'api/task'
import untils from 'js/untils'
import { mapState } from 'vuex'

export default {
  name: 'Thump',
  data () {
    return {
      addFileUrl: task.addJDAccount,
      pageCount: 3,
      imgWidth: '',
      imgHeight: '',
      taskId: '',
      files: [],
      tableData: [],
      taskFailData: [],
      detailsData: {},
      taskShopList: {},
      details: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      search: '',
      imageArry: [],
      imageStatus: false,
      detailsStatus: false,
      modalStatus: false,
      AccountStatus: false,
      AccountListStatus: false,
      AccountList: [],
      btnStatus: false,
      form: {
        userId: '',
        name: '',
        label: '',
        content: '',
      },
      addJDFileTable: [],
      accountSearch: '',
      accountPage: {
        pageNo: 1,
        total: null
      }
    }
  },
  computed: {
    ...mapState(['jdb_userInfo', 'jdb_token'])
  },
  methods: {
    addFileSuccessFn (response) {
      const {code, data, msg} = response
      if (code === 200) {
        this.$message.success(msg || '上传成功')
        this.closeModalFn()
      } else {
        this.addJDFileTable = data
        this.$message.error(msg)
      }
    },
    submitUpload() {
      this.$refs.addUpload.submit()
    },
    changeImages (val) {
      this.imgWidth = this.$refs.imgItem[val].width
      this.imgHeight = this.$refs.imgItem[val].height
    },
    imgLoad () {
      this.imgWidth = this.$refs.imgItem[0].width
      this.imgHeight = this.$refs.imgItem[0].height
    },
    accountSearchFn () {
      this.accountPage.pageNo = 1
      this.AccountListLoad()
    },
    async AccountListLoad () {
      this.AccountListStatus = true
      const res = await task.listJDAccount({ search: this.accountSearch, page: this.accountPage.pageNo, size: 10 })
      if (res.code === 200) {
        this.AccountList = res.data
        this.accountPage.pageNo = res.page
        this.accountPage.total = res.allCount
      } else {
        this.AccountList = []
        this.accountPage.pageNo = 1
        this.accountPage.total = null
      }
    },
    AccountListCurrentChange (val) {
      this.accountPage.pageNo = val
      this.AccountListLoad()
    },
    handleExceed() {
      this.$message.error('当前限制选择 3 个文件')
    },
    handlePreview (file, fileList) {
      this.files = fileList
    },
    handleRemove (file, fileList) {
      this.files = fileList
    },
    async pageLoad () {
      const res = await task.listTask({ page: this.page.pageNo, size: this.page.pageSize, search: this.search })
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
    async DetailsShow (id) {
      const res = await task.taskDetail({ id })
      if (res.code === 200) {
        const { id: taskId, shopNumber, successNumber, failNumber } = res.data.task
        this.detailsData = res.data.task
        this.taskId = taskId
        this.taskShopList = { shopNumber, successNumber, failNumber }
        this.detailsData.img1 ? this.imageArry.push(this.detailsData.img1) : ''
        this.detailsData.img2 ? this.imageArry.push(this.detailsData.img2) : ''
        this.detailsData.img3 ? this.imageArry.push(this.detailsData.img3) : ''
      } else {
        this.imageArry = []
        this.detailsData = {}
        this.taskId = ''
        this.taskShopList = {}
      }
      this.failListLoad()
      this.detailsStatus = true
    },
    async failListLoad () {
      const res = await task.listTaskFail({ taskId: this.taskId, page: this.details.pageNo, size: this.details.pageSize })
      if (res.code === 200) {
        this.taskFailData = res.data
        this.details.pageNo = res.page
        this.details.total = res.allCount
      } else {
        this.taskFailData = []
        this.details.pageNo = 1
        this.details.total = null
      }
    },
    timeFn (val) {
      return untils.formatTime(val)
    },
    closeModalFn () {
      this.imageStatus = false
      this.modalStatus = false
      this.btnStatus = false
      this.detailsStatus = false
      this.AccountStatus = false
      this.AccountListStatus = false
      this.form = {
        userId: '',
        name: '',
        label: '',
        content: '',
      }
      this.accountForm = {
        list: [{ name: '', password: '' }]
      },
      this.detailsData = {}
      this.taskShopList = {}
      this.taskId = ''
      this.taskFailData = []
      this.imageArry = []
      this.AccountList = []
      this.files = []
      this.accountSearch = ''
      this.accountPage = {
        pageNo: 1,
        total: null
      }
      this.addJDFileTable = []
    },
    submitFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.files.length === 3 && this.files) {
            this.btnStatus = true
            let list = new FormData()
            list.append('name', this.form.name)
            list.append('label', this.form.label)
            list.append('content', this.form.content)
            list.append('userId', this.jdb_userInfo.id)
            this.files.forEach((item, index) => {
              const i = index + 1
              if (item.raw) {
                list.append(`picture${i}`,item.raw)
              }
            })
            task.addTask(list).then(res => {
              this.$message({
                type: res.code === 200 ? 'success' : 'error',
                message: res.msg
              })
              this.closeModalFn()
              this.pageLoad()
            })
          } else {
            this.btnStatus = false
            this.$message.error('图片必须为3张')
          }

        }
      })
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    detailSizeChange (val) {
      this.details.pageSize = val
      this.failListLoad()
    },
    detailCurrentChange (val) {
      this.details.pageNo = val
      this.failListLoad()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.pageLoad()
    },
    deleteFn (id) {
      this.$confirm('是否确定删除该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        task.deleteTask({ id }).then(res => {
          this.$message({
            type: res.code === 200 ? 'success' : 'error',
            message: res.msg
          })
          this.pageLoad()
        })
      })
    }
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

  .redRadius {
    margin-right: 5px;
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: red;
  }

  .el-dialog__body {
    color: #333333;
    .word {
      word-break: break-all;
      line-height: 24px;
    }
    .images {
      margin-right: 10px;
      width: 94px;
      height: 94px;
      border: 1px solid #f4f4f4;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .hr {
      border-top: 1px solid #eeeeee;
      border-bottom: 1px solid #eeeeee;
      padding: 20px 0;
      margin: 20px 0;
      text-align: center;
      .font18 {
        font-size: 18px;
      }
    }
  }

  .heightColor {
    margin-left: -20px;
    div {
      white-space: nowrap;
      font-size: 12px;
      height: 20px;
    }
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
</style>