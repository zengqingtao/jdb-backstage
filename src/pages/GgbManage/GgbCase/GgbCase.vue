<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-button type="primary" size="small" plain @click="reviewCaseFn(1)">新增成功案例</el-button>
        </el-col>
        <el-form inline size="small">
          <el-form-item>
            <el-input clearable v-model="search" placeholder="京店宝账号/店铺名称"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{ scope.row.index }}
          </template>
        </el-table-column>
        <el-table-column prop="exampleName" label="案例名称">
        </el-table-column>
        <el-table-column label="案例内容">
          <template slot-scope="scope">
            <el-button type="text" @click="reviewCaseFn(3, scope.row.id)">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sortNum" label="首页排序">
        </el-table-column>
        <el-table-column prop="dbName" label="初次操作人">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.status === 0 ? '未上架' : scope.row.status === 1 ? '上架中' : '已下架' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="putOrOut(scope.row.id, 1)" v-if="scope.row.status === 0 || scope.row.status===2">上架</el-button>
            <el-button type="text" @click="putOrOut(scope.row.id, 0)" v-else>下架</el-button>
            <el-button type="text" @click="reviewCaseFn(2, scope.row.id, scope.row.status)">编辑</el-button>
            <el-button type="text" class="red" @click="deleteCase(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" class="page" v-if="page.total">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          layout="total, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </el-row>
    </el-main>

    <el-dialog class="modal" :title="modalTitle" :visible.sync="modalStatus" width="990px" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="100px" size="small" :disabled="disabledStatus">
        <h3>案例</h3>
        <el-form-item label="案例名称:" prop="exampleName" :rules="[{required: true, message: '案例名称不能为空'}]">
          <el-input class="w220" v-model="form.exampleName"></el-input>
        </el-form-item>
        <h3>首页</h3>
        <el-form-item label="创意图:" prop="homePicture" :rules="[{required: true, message: '创意图不能为空'}]">
          <el-upload
            action="null"
            :auto-upload="false"
            list-type="picture-card"
            :limit="1"
            :file-list="form.homePicture"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">图片尺寸建议：360*204</div>
          </el-upload>
        </el-form-item>
        <el-row type="flex">
          <el-form-item label="类目名称:" prop="homeFirstCategory" :rules="[{required: true, message: '类目名称不能为空'}]">
            <el-input v-model="form.homeFirstCategory"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="店铺类型:" prop="shopType" :rules="[{required: true, message: '店铺类型不能为空'}]">
          <el-select v-model="form.shopType">
            <el-option label="pop" :value="0"></el-option>
            <el-option label="自营" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放时间:" prop="homeTime" :rules="[{required: true, message: '投放时间不能为空'}]">
          <el-date-picker v-model="form.homeTime" type="date" placeholder="选择投放时间" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="时间周期:" prop="homeDay" :rules="[{required: true, message: '时间周期不能为空'}]">
          <el-row type="flex">
            <el-input class="mg-r-5 w220" v-model="form.homeDay"></el-input>
            <span>天</span>
          </el-row>
        </el-form-item>
        <el-form-item label="成交金额:" prop="homeMoney" :rules="[{required: true, message: '成交金额不能为空'}]">
          <el-row type="flex">
            <el-input class="mg-r-5 w220" v-model="form.homeMoney"></el-input>
            <span>元</span>
          </el-row>
        </el-form-item>
        <el-form-item label="ROI值:" prop="homePoi" :rules="[{required: true, message: 'ROI值不能为空'}]">
          <el-input class="w220" v-model="form.homePoi"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序:" prop="sortNum" :rules="[{required: true, message: '排列顺序不能为空'}]">
          <el-input class="w220" v-model="form.sortNum"></el-input>
        </el-form-item>
        <h3>详情页</h3>
        <el-form-item label="创意图:" prop="homePicture" :rules="[{required: true, message: '创意图不能为空'}]">
          <div v-if="creativityImageUrl">
            <el-image :src="creativityImageUrl" class="reviewImage"  :preview-src-list="[creativityImageUrl]">
            </el-image>
          </div>
          <p v-else class="mg-t-0">等待同步图片</p>
        </el-form-item>
        <el-form-item label="标题:" prop="detailTitle" :rules="[{required: true, message: '标题不能为空'}]">
          <el-input class="w220" v-model="form.detailTitle"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="detailContent" :rules="[{required: true, message: '内容不能为空'}]">
          <el-input class="w220" v-model="form.detailContent"></el-input>
        </el-form-item>
        <el-row type="flex">
          <el-form-item label="类目名称:" prop="homeFirstCategory" :rules="[{required: true, message: '类目名称不能为空'}]">
            <el-input readonly v-model="form.homeFirstCategory"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="投放时间:" prop="homeTime" :rules="[{required: true, message: '投放时间不能为空'}]">
          <el-date-picker v-model="form.homeTime" type="date" placeholder="选择投放时间" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="总展现数:" prop="detailShowNum" :rules="[{required: true, message: '总展现数不能为空'}]">
          <el-input class="w220" v-model="form.detailShowNum"></el-input>
        </el-form-item>
        <el-form-item label="总点击量:" prop="detailClickNum" :rules="[{required: true, message: '总点击量不能为空'}]">
          <el-input class="w220" v-model="form.detailClickNum"></el-input>
        </el-form-item>
        <el-form-item label="平均点击率:" prop="detailAverageTransform" :rules="[{required: true, message: '平均点击率不能为空'}]">
          <el-input class="w220" v-model="form.detailAverageTransform"></el-input>
        </el-form-item>
        <el-form-item label="营销背景:" prop="detailMarketingBackground" :rules="[{required: true, message: '营销背景不能为空'}]">
          <quill-editor v-model="form.detailMarketingBackground" :disabled="disabledStatus" ref="myQuillEditor" :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="营销目标:" prop="detailMarketingTarget" :rules="[{required: true, message: '营销目标不能为空'}]">
          <quill-editor v-model="form.detailMarketingTarget" :disabled="disabledStatus" ref="myQuillEditor" :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="营销策略:" prop="detailMarketingStrategy" :rules="[{required: true, message: '营销策略不能为空'}]">
          <quill-editor v-model="form.detailMarketingStrategy" :disabled="disabledStatus" ref="myQuillEditor" :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="营销亮点:" prop="detailMarketingLightspot" :rules="[{required: true, message: '营销亮点不能为空'}]">
          <quill-editor v-model="form.detailMarketingLightspot" :disabled="disabledStatus" ref="myQuillEditor" :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="精准通数据:" prop="jingdongData" :rules="[{required: true, message: '精准通数据不能为空'}]">
          <el-upload
            class="hide-picture"
            action="null"
            :auto-upload="false"
            list-type="picture-card"
            :file-list="form.jingdongData"
            :on-change="webNibblerChange"
            multiple>
            <i class="el-icon-plus"></i>
          </el-upload>
          <draggable class="webImages" v-model="form.jingdongData" v-if="form.jingdongData.length > 0">
            <div v-for="(item, index) of form.jingdongData" :key="index">
              <el-image :src="item.url" :preview-src-list="form.jingdongData.map(ele=> ele.url)"></el-image>
              <i v-show="!disabledStatus" class="close el-icon-error"  @click="delImg(index)"></i>
            </div>
          </draggable>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitFn" v-if="type !== 3">确定</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>
    <carousel :imageStatus="imageVisible" :imageArray="imageArray" :imagesInx="imagesInx" @closeImageModal="closeImageModalFn"></carousel>
  </el-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import tableMixins from 'mixins/tableMixins'
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import { quillEditor } from "vue-quill-editor";
  import carousel from 'components/carousel'
  import specialCustomer from 'api/specialCustomer'
  import { mapState } from 'vuex'

  export default {
    name: 'GgbCase',
    mixins: [tableMixins],
    components: { quillEditor, carousel, draggable },
    data() {
      return {
        type: 1, // 1：新增 2：修改 3：预览
        disabledStatus: false, // 禁用表单状态
        editorOption: {
          placeholder: "请在此输入文本..."
        },
        modalTitle: '新增成功案例',
        creativityImageUrl: '', // 预览图片地址
        imagesInx: 0, // 预览图片开始顺序
        imageVisible: false, // 预览图片弹窗状态
        imageArray: [], // 预览图片数组地址
        form: {
          status: 0, // 0: 下架 1：上架
          dbId: '', // 运营后台操作人员id
          exampleName: '', // 案例名称
          homePicture: [], // 创意图
          homeFirstCategory: '', // 一级类目
          shopType: 0, // 店铺类型 0:pop 1：自营店铺
          homeTime: '', // 投放时间
          homeDay: '', // 时间周期
          homeMoney: '', // 成交金额
          homePoi: '', // ROL值
          sortNum: '', // 排列顺序
          detailTitle: '', // 标题
          detailContent: '', // 内容
          detailShowNum: '', // 总展现数
          detailClickNum: '', // 总点击量
          detailAverageTransform: '', // 平均点击率
          detailMarketingBackground: '', // 营销背景
          detailMarketingTarget: '', // 营销目标
          detailMarketingStrategy: '', // 营销策略
          detailMarketingLightspot: '',  // 营销亮点
          jingdongData: [] // 精准通数据
        }
      }
    },
    computed: {
      ...mapState(['jdb_userInfo'])
    },
    methods: {
      closeImageModalFn () {
        this.imageVisible = false
        this.imageArray = []
        this.imagesInx = 0
      },
      reviewWebImage(i) {
        this.imageArray = this.form.jingdongData.map(item => item.url)
        this.imagesInx = i
        this.imageVisible = true
      },
      webNibblerChange(file, fileList) {
        this.form.jingdongData = fileList
      },
      removeWebImages(i) {
        if (this.disabledStatus) return
        this.form.jingdongData.splice(i, 1)
      },
      handleChange(file, fileList) {
        this.form.homePicture = fileList
        this.creativityImageUrl = file.url
      },
      handleRemove(file, fileList) {
        this.form.homePicture = fileList
        this.creativityImageUrl = ''
      },
      handleExceed() {
        this.$message.error('当前限制选择 1 个文件')
      },
      handlePictureCardPreview(file) {
        this.imageArray = [file.url];
        this.imageVisible = true;
      },
      reviewImageFn() {
        this.imageArray = [this.creativityImageUrl];
        this.imageVisible = true;
      },
      async infoForm (id) {
        const { code, data } = await specialCustomer.selectExampleById({ id })
        if (code === 200) {
          const jingdongData = data.jingdongData.map(url => {
            return Object.assign({}, { name: 'image', url })
          })
          this.creativityImageUrl = data.homePicture
          const homePicture = [{ name: 'image', url: data.homePicture }]
          const params = {...data, homePicture, jingdongData}
          Object.assign(this.form, params)
        }
      },
      reviewCaseFn(type, id, status) {
        this.type = type
        this.modalTitle = type === 1 ? '新增成功案例' : type === 2 ? '修改成功案例' : '预览成功案例'
        this.form.status = type === 2 ? status : 0
        type !== 1 && this.infoForm(id)
        this.disabledStatus = type === 3 ? true : false
        this.modalStatus = true
      },
      async switchFileUrl (files) {
        // 循环检测files文件里面的raw 有则替换掉
        let images = []
        if (files.some(item => item.raw)) { // 检测到当有未上传的文件时
          const readyFiles = files.filter(item => item.raw) // 筛选出未上传的数据
          let param = new FormData()
          readyFiles.forEach(item => param.append('files', item.raw)) // 筛选出未上传的数据文件放入formData
          const { data } = await specialCustomer.uploadImages(param)
          let i = 0
          images = files.map(item => {
            if (item.raw) {
              const url = data[i]
              i++
              return url
            } else {
              return item.url
            }
          })
        } else {
          images = files.map(item => item.url)
        }
        return images
      },
      async submitFn() {
        this.switchFileUrl(this.form.jingdongData)
        this.$refs['form'].validate(async valid => {
          if (valid) {
            this.btnStatus = true
            const params = {
              status: this.form.status,
              sortNum: this.form.sortNum,
              dbId: this.jdb_userInfo.id,
              exampleName: this.form.exampleName,
              homeFirstCategory: this.form.homeFirstCategory,
              shopType: this.form.shopType,
              homeTime: this.form.homeTime,
              homeDay: this.form.homeDay,
              homeMoney: this.form.homeMoney,
              homePoi: this.form.homePoi,
              detailFirstCategory: this.form.homeFirstCategory,
              detailTitle: this.form.detailTitle,
              detailContent: this.form.detailContent,
              detailTime: this.form.homeTime,
              detailShowNum: this.form.detailShowNum,
              detailClickNum: this.form.detailClickNum,
              detailAverageTransform: this.form.detailAverageTransform,
              detailMarketingBackground: this.form.detailMarketingBackground,
              detailMarketingTarget: this.form.detailMarketingTarget,
              detailMarketingStrategy: this.form.detailMarketingStrategy,
              detailMarketingLightspot: this.form.detailMarketingLightspot
            }
            if (this.type === 2) params.id = this.form.id
            const picture = await this.switchFileUrl(this.form.homePicture)
            params.homePicture = params.detailPicture = picture.toString()
            params.jingdongData = await this.switchFileUrl(this.form.jingdongData)
            const request = this.type === 1 ? specialCustomer.addExample : specialCustomer.updateExample
            const { code, msg } = await request(params)
            this.btnStatus = false
            if (code === 200) {
              this.closeModalFn()
              this.pageLoad()
              this.$message.success(msg || '操作成功')
            } else {
              this.$message.error(msg || '操作失败')
            }
          }
        })
      },
      async putOrOut(id, status) {
        // 上下架 0：上架 1：下架
        const { code, msg } = await specialCustomer.updateExampleStatus({ id, status })
        if (code === 200) {
          this.closeModalFn()
          this.pageLoad()
          this.$message.success(msg || '操作成功')
        } else {
          this.$message.error(msg || '操作失败')
        }
      },
      deleteCase(id) {
        this.$confirm('删除后，排在本案例后的案例，在商家端页面展示时自动往前挪一位，是否确认?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await specialCustomer.deleteExample({ id })
          if (code === 200) {
            this.closeModalFn()
            this.pageLoad()
            this.$message.success(msg || '删除成功')
          } else {
            this.$message.error(msg || '删除失败')
          }
        })
      },
      closeModalFn() {
        this.type = 1
        this.modalTitle = '新增成功案例'
        this.modalStatus = this.btnStatus = this.disabledStatus = false
        this.form = {
          status: 0,
          dbId: '', // 运营后台操作人员id
          exampleName: '', // 案例名称
          homePicture: [], // 创意图
          homeFirstCategory: '', // 一级类目
          shopType: 0,
          homeTime: '', // 投放时间
          homeDay: '', // 时间周期
          homeMoney: '', // 成交金额
          homePoi: '', // ROL值
          sortNum: '', // 排列顺序
          detailTitle: '', // 标题
          detailContent: '', // 内容
          detailShowNum: '', // 总展现数
          detailClickNum: '', // 总点击量
          detailAverageTransform: '', // 平均点击率
          detailMarketingBackground: '', // 营销背景
          detailMarketingTarget: '', // 营销目标
          detailMarketingStrategy: '', // 营销策略
          detailMarketingLightspot: '',  // 营销亮点
          jingdongData: [] // 精准通数据
        }
      },
      delImg(index){
        this.form.jingdongData.splice(index,1)
        console.log(this.form.jingdongData)
      },
      async pageLoad() {
        const { code, data } = await specialCustomer.selectExampleList({ page: this.page.pageNo })
        const { pageNo, results, totalCount } = data
        this.tableData = code === 200 ? results : []
        this.page.pageNo = code === 200 ? pageNo: 1
        this.page.total = code === 200 ? totalCount: null
      }
    },
    created() {
      this.pageLoad()
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/tableMixins";
  .division {
    /deep/ .el-form-item__content {
      margin-left: 17px !important;
    }
  }
  .modal {
    /deep/ .el-dialog__body {
      overflow-y: auto;
      height: 500px;
    }
  }
  .webImages {
    display: flex;
    flex-wrap: wrap;
    div {
      width: 148px;
      height: 148px;
      margin: 10px 20px 8px 0;
      position: relative;
      .el-image {
        overflow: hidden;
        background-color: #fff;
        border-radius: 6px;
        border: 1px solid #c0ccda;
        box-sizing: border-box;
        cursor: pointer;
      }
      .close {
        cursor: pointer;
        position: absolute;
        top: -5px;
        right: -20px;
        font-size: 30px;
      }
    }
  }
  .reviewImage {
    cursor: pointer;
    width: 200px;
    height: 200px;
  }
  .w220 {
    width: 220px;
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
</style>
