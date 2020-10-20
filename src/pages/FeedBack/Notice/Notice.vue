<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button type="primary" plain size="small" @click="modalStatus = true">添加公告</el-button>
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="公告名称" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="name" label="公告名称">
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{ timeFn(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <pre-view :previewList='[scope.row.content]'>
              <el-button type="text">查看图片</el-button>
            </pre-view>
          </template>
        </el-table-column>
        <el-table-column label="是否跳转">
          <template slot-scope="scope">
            {{ scope.row.havaLink === 0 ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column label="跳转链接">
          <template slot-scope="scope">
            <a :href="scope.row.link" target="_Blank">{{ scope.row.link }}</a>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '未上架' : scope.row.status === 1 ? '已上架' : '已下架' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0 || scope.row.status === 2" type="text" size="small" @click="changeFn(1, scope.row.id)">上架</el-button>
            <el-button v-else-if="scope.row.status === 1" type="text" size="small" @click="changeFn(2, scope.row.id)">下架</el-button>
            <el-button class="red" type="text" size="small" @click="changeFn(3, scope.row.id)">删除</el-button>
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

    <el-dialog title="添加公告" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="85px">
        <el-form-item label="公告名称:" prop="name" :rules="[ { required: true, message: '公告名称不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片:" prop="content" :rules="[ { required: true, message: '图片不能为空'}]">
          <el-upload
            action="null"
            :file-list="form.content"
            :on-change="handlePreview"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否跳转:" prop="haveLink" :rules="[{required: true, message: '是否跳转不能为空'}]">
          <el-radio v-model="form.haveLink" :label="0">否</el-radio>
          <el-radio v-model="form.haveLink" :label="1">是</el-radio>
        </el-form-item>
        <el-form-item v-if="form.haveLink === 1" label="跳转链接:" prop="link" :rules="[{required: true, message: '跳转链接不能为空'}]">
          <el-input v-model="form.link" placeholder="请输入跳转链接" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain :loading="btnStatus" @click="submitFn(0)">保存但不发送</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitFn(1)">立即发送</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
  import notice from 'api/notice'
  import untils from 'js/untils'
  import preView from 'components/preView'

  export default {
    name: 'Notice',
    data () {
      return {
        previewBtn: require('../../../assets/img/preview-btn.png'),
        id: '', // 列表ID
        btnStatus: false, // 按钮禁用状态
        modalStatus: false, // 弹窗显示状态
        search: '',  // 查询达人号
        tableData: [],
        form: {
          content: [],
          name: '',
          haveLink: 0,
          link: '',
        },
        page: {
          pageNo: 1,
          pageSize: 10,
          total: null
        },
        testList: [
          `https://yushu-product-images.oss-cn-beijing.aliyuncs.com/20190308175810.jpeg`,
          `https://yushu-product-images.oss-cn-beijing.aliyuncs.com/1543309875327.gif`,
          `https://yushu-product-images.oss-cn-beijing.aliyuncs.com/1543308780320.jpg`
        ]
      }
    },
    methods: {
      submitFn (status) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let list = new FormData()
            list.append('name', this.form.name)
            list.append('haveLink', this.form.haveLink)
            list.append('link', this.form.link)
            list.append('status', status)
            list.append('content', this.form.content[0].raw)
            this.btnStatus = true
            notice.addNotice(list).then(res => {
              if (res && res.code === 200) {
                this.closeModalFn()
                this.pageLoad()
                this.$message({
                  message: res.msg,
                  type: 'success',
                })
              } else {
                this.btnStatus = false
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
          }
        })
      },
      handlePreview (file, fileList) {
        this.form.content = fileList
      },
      handleRemove (file, fileList) {
        this.form.content = fileList
      },
      handleExceed() {
        this.$message.error('当前限制选择 1 个文件')
      },
      async changeFn (status, id) {
        const showHave = await notice.showHave()
        this.$confirm(`是否${status === 1 ? '上架' : status === 2 ? '下架' : '删除'}当前公告?${showHave && status === 1 ? '上架后其他已上架的公告将即时下架' : ''}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          notice.changeNotice({ id, status }).then(res => {
            if(res.code===200){
              this.$message({
              type:'success',
              message:`公告${status === 1 ? '上架' : status === 2 ? '下架' : '删除'}成功`
            })
            this.pageLoad()
            }else{
              this.$message.error(res.msg)
            }
          })
        }).catch()
      },
      timeFn (val) {
        return untils.formatTime(val)
      },
      closeModalFn () {
        this.modalStatus = this.btnStatus = false
        this.$refs['form'].resetFields()
      },
      async pageLoad () {
        const res = await notice.listNotice({ page: this.page.pageNo, size: this.page.pageSize, search: this.search })
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
      searchFn () { // 搜索
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
    },
    mounted () {
      this.pageLoad()
    },
    components: {
      preView
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

  .imgPointer {
    cursor: pointer;
  }

  /deep/ .el-dialog__body {
    overflow: auto;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
</style>
