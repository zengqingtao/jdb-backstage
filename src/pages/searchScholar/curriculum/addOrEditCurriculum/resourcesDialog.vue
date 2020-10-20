<template>
  <div>
    <el-dialog
      width="500px"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div class="dialog-body">
        <div class="input-box">
          <span class="label">级别：</span>
          <el-select v-model="form.level" placeholder="请选择级别">
            <el-option
              v-for="(item,index) in chapterLevelList"
              :key="index"
              :label="item.levelName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="input-box">
          <span class="label">icon：</span>
          <div class="upload-img" :class="fileList.length===1?'hideUploadImgBtn':''">
            <el-upload
              :action="uploadImgUrl"
              :headers="{ token:jdb_token }"
              :limit="1"
              :file-list="fileList"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              accept=".jpg, .jpeg, .png, .gif, .bmp"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <div class="input-box">
          <span class="label">资源名称：</span>
          <el-input v-model="form.resourcesName" placeholder="请输入资源名称"></el-input>
        </div>
        <div class="input-box description-box">
          <span class="label">简介：</span>
          <el-input
            type="textarea"
            v-model="form.description"
            maxlength="100"
            minlength="1"
            rows="5"
            placeholder="请输入简介"
          ></el-input>
        </div>
        <div class="error-tips">{{errorTips}}</div>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import searchScholar from "../../../../api/searchScholar";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialogVisible: true,
      form: {
        level: "",
        imgUrl: "",
        resourcesName: "",
        description: "",
      },
      errorTips: "",
      fileList: [],
      uploadImgUrl: process.env.VUE_APP_API + searchScholar.uploadImage,
    };
  },
  props: {
    chapterLevelList: {
      type: Array,
      default: [],
    },
  },
  computed: {
    ...mapState(["jdb_token"]),
  },
  mounted() {
    this.form.level = this.chapterLevelList[0].id;
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    beforeUpload(file) {
      //上传图片前
      const isLt100kb = file.size / 1024 < 100;
      if (!isLt100kb) {
        this.$message.error("图片大小不能超过 100kb!");
      }
      return isLt100kb;
    },
    handleExceed(file, fileList) {
      //图片超出上限
      this.$message.error("当前只能上传一张图片");
    },
    handleSuccess(file, fileList) {
      if (file.code === 200) {
        this.form.imgUrl = file.data;
        this.fileList.push(fileList);
      }
    },
    handleRemove() {
      this.form.imgUrl = "";
      this.fileList = [];
    },
    validateFrom(){
        if(this.form.imgUrl===''){
            this.errorTips = 'icon不能为空'
        }else if (this.form.resourcesName === "") {
          this.errorTips = "资源名称不能为空";
        }else if(this.form.description===''){
            this.errorTips = '简介不能为空'
        }else{
            this.errorTips = ''
        }
    },
    async save() {
        await this.validateFrom()
        if(this.errorTips!=='')return;
        this.$emit('insertSuccess',this.form)
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-dialog__header {
    height: 0;
    padding: 0;
  }
  .el-dialog__close {
    width: 30px;
    height: 30px;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -20px;
    right: -65px;
  }
  .dialog-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .input-box {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    .description-box {
      align-items: flex-start;
    }
    .label {
      min-width: 75px;
      text-align: end;
    }
    .el-input__inner {
      width: 250px;
      height: 30px;
      line-height: 30px;
    }
    .el-textarea__inner {
      width: 250px;
    }
    .upload-img {
      width: 250px;
    }
    .el-input__suffix {
      display: flex;
      align-items: center;
    }
    .el-button {
      width: 80px;
      height: 30px;
      padding: 0;
      margin-top: 15px;
    }
    .error-tips {
      height: 20px;
      color: crimson;
    }
    .el-upload--picture-card{
        width:100px;
        height:100px;
        line-height: 100px;
    }
    .el-upload-list--picture-card .el-upload-list__item{
        width: 100px;
        height: 100px;
    }
    .hideUploadImgBtn .el-upload--picture-card {
      display: none;
    }
  }
}
</style>