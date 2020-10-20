<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-button size="small" type="primary" plain @click="modalStatus = true">新增地域</el-button>
        </el-col>
        <el-form inline size="small">
          <el-form-item class="mg-l-10" label="地域名称:">
            <el-input clearable v-model="search" placeholder="地域名称"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="name" label="地域名称">
        </el-table-column>
        <el-table-column label="地域图片">
          <template slot-scope="scope">
            <pre-view :previewList='[scope.row.url]'>
              <el-image :src='scope.row.url' style="width: 90px; height: 90px"/>
            </pre-view>
          </template>
        </el-table-column>
        <el-table-column label="园区政策">
          <template slot-scope="scope">
            <el-button @click="reviewFn(scope.row.content, '园区政策')" type="text">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column label="温馨提示">
          <template slot-scope="scope">
            <el-button @click="reviewFn(scope.row.tips, '温馨提示')" type="text">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排列顺序">
        </el-table-column>
        <el-table-column prop="userName" label="初次操作人">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editModalShow(scope.row)">修改</el-button>
            <el-button class="red" type="text" @click="deleteFn(scope.row.id)">删除</el-button>
          </template>
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

    <el-dialog class="regionModal" :title="editStatus ? '修改地域' : '新增地域'" :visible.sync="modalStatus" width="70%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="90px">
        <el-form-item label="地域名称:" prop="name" :rules="[{required: true, message: '地域名称不能为空'},{max: 12, message: '地域名称不能超过12个字符'}]">
          <el-input v-model="form.name" placeholder="请输入地域名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="地域图片:" prop="file" :rules="[{ required: true, message: '地域图片不能为空'}]">
          <el-upload
            action="null"
            list-type="picture"
            :file-list="form.file"
            :on-change="handlePreview"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="园区政策:" prop="content" :rules="[{required: true, message: '园区政策不能为空'}]">
          <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="温馨提示:" prop="tips" :rules="[{required: true, message: '温馨提示不能为空'}]">
          <quill-editor v-model="form.tips" ref="myQuillEditor" :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="排列顺序:" prop="sort" :rules="[{required: true, message: '排列顺序不能为空'}, {type: 'number', message: '排列顺序仅能为数字'}]">
          <el-input v-model.number="form.sort" placeholder="请输入排列顺序" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="closeModalFn">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="modalTitle" :visible.sync="policyStatus" width="50%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-row>
        <el-col v-html="this.form.content"></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import tableMixins from 'mixins/tableMixins'
import enter from 'api/enter'
import { quillEditor } from "vue-quill-editor";
import preView from 'components/preView'
export default {
  name: 'Region',
  mixins: [tableMixins],
  components: { quillEditor ,preView},
  data() {
    return {
      fileisUrl: false,
      modalTitle: '',
      editStatus: false,
      policyStatus: false,
      editorOption: {
        placeholder: "请在此输入文本..."
      },
      form: {
        file: [],
        name: '',
        content: '',
        sort: '',
        tips: ''
      }
    }
  },
  methods: {
    reviewFn (content, title) {
      this.form.content = content
      this.modalTitle = title
      this.policyStatus = true
    },
    async pageLoad () {
      const { code, data, page, allCount } = await enter.listPolicy({ type: this.activeName, page: this.page.pageNo, name: this.search })
      this.tableData = code === 200 ? data : []
      this.page.pageNo = code === 200 ? page : 1
      this.page.total = code === 200 ? allCount : null
    },
    editModalShow({ id, name, url, content, sort, tips }) {
      this.form = { id, name, file: [{ name: '地域图片', url }], content, sort, tips }
      this.editStatus = true
      this.modalStatus = this.fileisUrl = true
    },
    submitFn() {
      this.$refs['form'].validate(async valid => {
        if(this.form.content !== '') {
          if(valid) {
            this.btnStatus = true
            const type = this.fileisUrl ? 'url' : 'file'
            const list = new FormData()
            this.form.id ? list.append('id', this.form.id) : ''
            list.append(type, this.fileisUrl ? this.form.file[0].url : this.form.file[0].raw)
            list.append('name', this.form.name)
            list.append('content', this.form.content)
            list.append('sort', this.form.sort)
            list.append('tips', this.form.tips)
            const { code, msg } = await enter.savePolicy(list)
            this.btnStatus = false
            if (code === 200) {
              this.$message.success(msg)
              this.closeModalFn()
              this.pageLoad()
            } else {
              this.$message.error(msg)
            }
          }
        } else {
          this.$message.error('园区政策不能为空！')
        }
      })
    },
    closeModalFn() {
      this.modalStatus = this.editStatus = this.policyStatus = this.fileisUrl = false
      this.modalTitle = ''
      this.form = {
        file: [],
        name: '',
        content: '',
        sort: '',
        tips: ''
      }
    },
    deleteFn(id) {
      this.$confirm('删除本区域信息后，立即生效，排序在本区域信息后的区域信息将依次往前排1位，是否确认删除?', '客官请留步', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code, msg } = await enter.deletePolicy({ id })
        if(code === 200) {
          this.$message.success(msg || '删除成功！')
          this.pageLoad()
        } else {
          this.$message.error(msg || '删除失败！')
        }
      })
    },
    handlePreview (file, fileList) {
      this.form.file = fileList
    },
    handleRemove (file, fileList) {
      this.fileisUrl = false
      this.form.file = fileList
    },
    handleExceed() {
      this.$message.error('当前限制选择 1 个文件')
    },
  },
  created() {
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  * {
    outline: none !important;
  }
  .header {
    margin-top: 20px;
    .el-input {
      width: 74%;
      margin-right: 10px;
    }
  }
  /deep/  .ql-editor {
    min-height: 100px;
  }
  /deep/ .editor {
    line-height: normal !important;
    height: 800px;
  }
  /deep/ .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
  }
  /deep/ .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
  }

  /deep/ .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
  }

  .regionModal {
    /deep/ .el-dialog__body {
      height: 550px;
      overflow-y: auto;
    }
  }

  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
  }
  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
  }
  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
  }
  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  /deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
  }

  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
  }
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  /deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
  }

  /deep/ .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  /deep/ .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
  }
  /deep/ .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  /deep/ .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
  }
  /deep/ .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  /deep/ .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }
  /deep/ .el-form-item__content {
    line-height: 22px;
  }
</style>
