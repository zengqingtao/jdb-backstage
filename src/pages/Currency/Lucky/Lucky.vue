<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-button type="primary" size="small" plain @click="modalStatus = true">新增广告信息</el-button>
          <el-button type="primary" size="small" plain class="mg-l-10" @click="ruleStatus = true">抽奖规则设置</el-button>
        </el-col>
        <el-form inline size="small">
          <el-form-item class="mg-l-10">
            <el-input clearable v-model="search" placeholder="广告语"></el-input>
            <el-button type="primary" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="name" label="广告语">
        </el-table-column>
        <el-table-column prop="haveLink" label="是否跳转">
          <template slot-scope="scope">{{ scope.row.haveLink === '0' ?  '否' : '是'}}</template>
        </el-table-column>
        <el-table-column prop="link" label="跳转链接">
        </el-table-column>
        <el-table-column label="展示规则">
          <template slot-scope="scope">按列表顺序循环展示</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="changeModal(scope.row)">修改</el-button>
            <el-button type="text" class="mg-l-10 red" @click="deleteFn(scope.row.id)">删除</el-button>
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

    <el-dialog :title="!editStatus ? '新增广告信息' : '修改广告信息'" :visible.sync="modalStatus" width="35%" center @close="closeModalFn" :close-on-click-modal="false">
      <el-form ref="form" :model="form" size="small" label-width="85px">
        <el-form-item label="广告语:" prop="name" :rules="[{required: true, message: '广告语不能为空'}, {max: 19, message: '广告语最多为19个字符'}]">
          <el-input clearable v-model="form.name" placeholder="请输入广告语"></el-input>
        </el-form-item>
        <el-form-item label="是否跳转:" prop="haveLink" :rules="[{required: true, message: '请选择是否跳转'}]">
          <el-select clearable v-model="form.haveLink">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.haveLink === '1'" label="跳转链接:" prop="link" :rules="[{required: true, message: '跳转链接不能为空'}]">
          <el-input clearable v-model="form.link" placeholder="请输入跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="展示规则:">
          <el-row>
            <el-col>
              <b>按列表顺序循环展示</b>
            </el-col>
            <el-col class="gray">新增加的广告将在已有广告展示完之后展示， 每条展示一天，按顺序轮换展示。</el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="抽奖规则设置" :visible.sync="ruleStatus" width="35%" center @close="closeModalFn" :close-on-click-modal="false">
      <el-row class="mg-b-10">
        <b>转盘选项个数可选6个或8个，在这里可以对转盘选项进行具体设置，设置内容从次日0点生效。若需赠送京币，选项文字需包含”XX京币“，系统将自动发放京币，其他礼品需客户联系BD领取</b>
        <el-col class="mg-t-10 text-left">
          <el-radio-group size="small" v-model="radio" @change="radioChangeFn">
            <el-radio-button label="6个选项"></el-radio-button>
            <el-radio-button label="8个选项"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-form ref="ruleFrom" :model="ruleFrom" size="small" label-width="85px">
        <el-form-item label="图片:" prop="file" :rules="[ { required: true, message: '图片不能为空'}]">
          <el-upload
            action="null"
            :file-list="ruleFrom.file"
            :on-change="handlePreview"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-for="(item, index) in ruleFrom.options" :key="index" :label="`选项${index + 1}:`" :prop="'options.' + index + '.choose'" :rules="[{ required: true, message: '赠送内容不能为空'},{max: 6, message: '赠送内容最多为6个字符'}]">
          <el-row>
            <el-input class="w45" clearable v-model="item.choose" placeholder="选项文字，填写赠送内容即可"></el-input>
            <el-input class="w25 mg-l-10" clearable v-model.number="item.probability" placeholder="中奖几率"></el-input>%
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="ruleSubmit">确定</el-button>
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import tableMixins from 'mixins/tableMixins'
import turntable from 'api/turntable'

export default {
  name: 'Lucky',
  mixins: [ tableMixins ],
  data () {
    return {
      id: '',
      radio: '6个选项',
      editStatus: false,
      ruleStatus: false,
      form: {
        name: '',
        haveLink: '0',
        link: ''
      },
      ruleFrom: {
        file: []
      }
    }
  },
  methods: {
    checkPercent (array) {
      const percent = array.map(item => item.probability)
      const nums = percent.reduce((prev, cur) => prev + cur)
      if (percent.includes('')) {
        this.$message.error('中奖概率不能有空')
      } else if (nums !== 100) {
        this.$message.error('中奖概率概率相加必须等于100')
      } else {
        return true
      }
    },
    radioChangeFn (val) {
      this.ruleFrom = {
        file: this.ruleFrom.file,
        options: []
      }
      const n = val === '8个选项' ? 8 : 6
      for (let i = 1; i <= n; i++) {
        this.ruleFrom.options.push({choose: '', probability: ''})
      }
    },
    async ruleSubmit () {
      this.$refs['ruleFrom'].validate(async valid => {
        if (valid) {
          if (!this.checkPercent(this.ruleFrom.options)) return false
          const form = new FormData()
          form.append('file', this.ruleFrom.file[0].raw)
          this.ruleFrom.options.map((item, index) => {
            form.append(`choose${index + 1}`, item.choose)
            form.append(`probability${index + 1}`, item.probability)
          })
          this.btnStatus = true
          const { code, msg } = await turntable.addDrawRule(form)
          this.btnStatus = false
          if (code === 200) {
            this.$message.success(msg)
            this.pageLoad()
            this.closeModalFn()
          } else {
            this.$message.error(msg)
          }
        }
      });
    },
    handlePreview (file, fileList) {
      this.ruleFrom.file = fileList
    },
    handleRemove (file, fileList) {
      this.ruleFrom.file = fileList
    },
    handleExceed() {
      this.$message.error('当前限制选择 1 个文件')
    },
    async pageLoad () {
      const { code, allCount, data, page } = await turntable.advertisementList({ page: this.page.pageNo, size: this.page.pageSize, search: this.search })
      if (code === 200) {
        this.tableData = data
        this.page = { ...this.page, pageNo: page, total: allCount }
      } else {
        this.tableData = []
        this.page = { ...this.page, pageNo: 1, total: null }
      }
    },
    submitFn () {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.btnStatus = true
          const form = !this.editStatus ? this.form : { ...this.form, id: this.id }
          form.haveLink === '0' ? delete form.link : ''
          const request = !this.editStatus ? turntable.addAdvertisement : turntable.changeAdvertisement
          const { code, msg } = await request(form)
          this.btnStatus = false
          if (code === 200) {
            this.$message.success(msg)
            this.closeModalFn()
            this.pageLoad()
          } else {
            this.$message.error(msg)
          }
        }
      })
    },
    changeModal ({ id, name, haveLink, link }) {
      this.id = id
      this.form = {name, haveLink, link}
      this.modalStatus = this.editStatus = true
    },
    closeModalFn () {
      this.modalStatus = this.btnStatus = this.editStatus = this.ruleStatus = false
      this.id = ''
      this.radio = '6个选项'
      this.form = {
        name: '',
        haveLink: '0',
        link: ''
      }
      this.ruleFrom = {
        file: [],
        options: []
      }
      this.radioChangeFn()
    },
    deleteFn (id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        turntable.deleteAdvertisement({ id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功!')
            this.pageLoad()
          } else {
            this.$message.error(res.msg || '删除失败!')
          }
        })
      })
    }
  },
  created () {
    this.pageLoad()
    this.radioChangeFn()
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
  .w45 {
    width: 45%;
  }
  .w25 {
    width: 30%;
  }
  .el-select {
    width: 100%;
  }
  .gray {
    color: #999999;
  }
</style>
