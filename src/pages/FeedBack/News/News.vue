<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button type="primary" plain size="small" @click="modalStatus = true, editStatus = false">添加通知</el-button>
        </el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="消息类型/标题" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{ timeFn(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="文字">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <pre-view :previewList='JSON.parse(scope.row.picture)' v-if="scope.row.picture && scope.row.picture.length > 0">
              <img :src="scope.row.picture | reSetUrl" alt="" style="width: 80px; height: 80px">
            </pre-view>
          </template>
        </el-table-column>
        <el-table-column label="是否跳转">
          <template slot-scope="scope">
            {{ scope.row.haveLink === 0 ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column label="跳转链接">
          <template slot-scope="scope">
            <a :href="scope.row.link" target="_Blank">{{ scope.row.link }}</a>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '未发送' : scope.row.status === 1 ? '已发送' : '已撤回' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="text" size="small" @click="sendFn(scope.row.id, 1)">发送</el-button>
            <el-button v-else-if="scope.row.status === 1" type="text" size="small" @click="sendFn(scope.row.id, 2)">撤回</el-button>
            <el-button v-else-if="scope.row.status === 2" type="text" size="small" @click="modalShow(scope.row)">编辑</el-button>
            <el-button class="red" type="text" size="small" @click="deleteFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="已查看">
          <template slot-scope="scope">
            {{ scope.row.number || 0 }} 
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

    <el-dialog :title="editStatus ? '编辑通知' : '添加通知'" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="85px">
        <el-form-item label="标题:" prop="title" :rules="[ { required: true, message: '标题不能为空'}, {max: 100, message: '标题文本限制在100字以内', trigger: 'blur'}]">
          <el-input v-model="form.title" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="文字:" prop="content" :rules="[ { required: true, message: '文字不能为空'}, {max: 250, message: '文本内容限制在250字以内', trigger: 'blur'}]">
          <el-input type="textarea" :rows="3" v-model="form.content" placeholder="请输入文字"></el-input>
        </el-form-item>
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
        <el-form-item label="是否跳转:" prop="haveLink" :rules="[{required: true, message: '是否跳转不能为空'}]">
          <el-radio v-model="form.haveLink" :label="0">否</el-radio>
          <el-radio v-model="form.haveLink" :label="1">是</el-radio>
        </el-form-item>
        <el-form-item v-if="form.haveLink === 1" label="跳转链接:" prop="link" :rules="[{required: true, message: '跳转链接不能为空'}]">
          <el-input v-model="form.link" placeholder="请输入跳转链接" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain :loading="btnStatus" @click="submitFn(0, editStatus)">保存但不发送</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitFn(1, editStatus)">立即发送</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import news from 'api/news'
import untils from 'js/untils'
import preView from 'components/preView'
export default {
  name: 'News',
  components: {
    preView
  },
  data () {
    return {
      imgHeight: '',
      editStatus: false, // 编辑状态
      btnStatus: false, // 按钮禁用状态
      modalStatus: false, // 弹窗显示状态
      tableData: [],
      files: [], // 本地重新上传的图片
      surplus: [], // 编辑时服务器未重新上传的图片
      id: '', // 列表ID
      search: '',  // 查询达人号
      form: {
        title: '',
        content: '',
        haveLink: 0,
        link: '',
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
    }
  },
  filters: {
    reSetUrl (val) {
      if (!val) return ''
      val = JSON.parse(val)
      return val[0]
    }
  },
  methods: {
    modalShow (row) {
      this.modalStatus = this.editStatus = true
      const {id, title, content, haveLink, link, picture} = row
      this.form = {id, title, content, haveLink, link}
      const arry = JSON.parse(picture)
      if (arry && arry.length > 0) {
        this.surplus = arry
        arry.forEach((item, index) => {
          let list = {name: index, url: item}
          this.files.push(list)
        })
      }
    },
    handlePreview (file, fileList) {
      this.files = fileList
    },
    handleRemove (file, fileList) {
      if (this.editStatus) {
        let arry = []
        fileList.forEach(item => {
          if (!item.raw) {
            arry.push(item.url)
          }
        })
        this.surplus = arry
      }
      this.files = fileList
    },
    handleExceed() {
      this.$message.error('当前限制选择 3 个文件')
    },
    submitFn (status, editStatus) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let list = new FormData()
          editStatus ? list.append('id', this.form.id) : ''
          editStatus && this.surplus.length > 0 ? list.append('surplus', JSON.stringify(this.surplus)) : ''
          list.append('title', this.form.title)
          list.append('content', this.form.content)
          list.append('haveLink', this.form.haveLink)
          list.append('link', this.form.link)
          list.append('status', status)
          if (this.files.length > 0 && this.files) {
            this.files.forEach((item, index) => {
              const i = index + 1
              if (item.raw) {
                list.append(`picture${i}`,item.raw)
              }
            })
          }
          this.btnStatus = true
          let request = editStatus ? news.changeNews : news.addNews
          request(list).then(res => {
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
    timeFn (val) {
      return untils.formatTime(val)
    },
    closeModalFn () {
      this.$refs['form'].resetFields()
      this.files = this.surplus = []
      this.modalStatus = this.editStatus = this.btnStatus = false
    },
    async pageLoad () {
     const res = await news.listNews({ search: this.search, page: this.page.pageNo, size: this.page.pageSize })
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
    searchFn () {
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
    editFn(row) {
      this.form = {...row}
      this.editStatus = true
      this.modalStatus = true
    },
    deleteFn (id) {
      this.$confirm('是否确定删除该条消息通知?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        news.deleteNews({ id }).then(res => {
          this.$message({
            type: res.code === 200 ? 'success' : 'error',
            message: res.msg
          })
          this.pageLoad()
        })
      })
    },
    sendFn(id, status) {
      this.$confirm(`是否确定${status === 1 ? '发送' : '撤回'}该条消息通知?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        news.sendNews({ id, status }).then(res => {
          if(res.code===200){
            this.$message({
              type:'success',
              message: `消息${status === 1 ? '发送' : '撤回'}成功`
            })
          this.pageLoad()
          }else{
            this.$message.error(res.msg)
          }
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

  /deep/ .el-dialog__body {
    overflow: auto;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
</style>