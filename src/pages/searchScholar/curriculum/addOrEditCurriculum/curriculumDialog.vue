<template>
  <div>
    <el-dialog width="500px" center :visible.sync="dialogVisible" :close-on-click-modal="false" @close='closeDialog'>
      <div class="addCurriulum-dialog-body">
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
          <span class="label">章节名称：</span>
          <el-input v-model="form.chapterName" placeholder="请输入章节名称"></el-input>
        </div>
        <div class="input-box">
          <span class="label">购买链接：</span>
          <el-input v-model="form.buyLink" placeholder="请输入购买链接"></el-input>
        </div>
        <div class="error-tips">{{errorTips}}</div>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: true,
      form: {
        level: "",
        chapterName: "",
        buyLink: "",
      },
      errorTips: "",
    };
  },
  props:{
    chapterLevelList:{
      type:Array,
      default:[]
    }
  },
  mounted(){
    this.form.level = this.chapterLevelList[0].id
  },
  methods: {
    closeDialog(){
      this.$emit('closeDialog')
    },
    validateForm(){
     if(this.form.chapterName===''){
        this.errorTips = "章节名称不能为空"
      }else if(this.form.chapterName.length>20){
        this.errorTips = "章节名称必须在25个字以内"
      }else if(this.form.buyLink===''){
        this.errorTips = "购买链接不能为空"
      }else if(this.form.buyLink.length>50){
        this.errorTips = "购买链接必须在50个字以内"
      }else{
        this.errorTips = ""
      }
    },
    async save() {
      await this.validateForm()
      if(this.errorTips!=='')return
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
  .addCurriulum-dialog-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .input-box {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
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
  }
}
</style>