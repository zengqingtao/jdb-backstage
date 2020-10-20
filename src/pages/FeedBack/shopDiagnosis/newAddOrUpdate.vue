<!--新增或者编辑店铺诊断-->
<template>
  <div class="container">
    <div class="item">
      <div class="label"><span class="star">*</span>指标名称：</div>
      <el-input
        v-model="form.indicatorName"
        placeholder="请输入指标名称"
      ></el-input>
    </div>
    <div class="item">
      <div class="label"><span class="star">*</span>指标说明：</div>
      <el-input
        v-model="form.indicatorDescription"
        type="textarea"
        rows="8"
        placeholder="请输入指标说明"
        :maxlength="maxlength"
        show-word-limit
      ></el-input>
    </div>
    <div class="errorTips">{{ errorTips }}</div>
    <div class="btn-group">
      <el-button type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import { addIndexTip } from "../../../api/feedback";
export default {
  data() {
    return {
      form: {
        indicatorName: "",
        indicatorDescription: "",
      },
      errorTips: "",
      isEdit: false,
      activeTab: "",
      maxlength:400,
      saveLoading:false
    };
  },
  mounted() {
    let query = this.$route.query
    this.activeTab = query.activeTab;
    if (query.id) {
      this.isEdit = true;
      this.form.indicatorName = query.name,
      this.form.indicatorDescription = query.content
    }
  },
  methods: {
    validateForm() {
      if (this.form.indicatorName === "") {
        this.errorTips = "指标名称不能为空";
      } else if(this.form.indicatorName.length>20){
        this.errorTips = "指标名称必须在20个字以内";
      }else if (this.form.indicatorDescription === "") {
        this.errorTips = "指标说明不能为空";
      }else{
         this.errorTips = "";
      }
    },
    async handleSave() {
      await this.validateForm();
      if (this.errorTips !== "") return;
      this.saveLoading = true
      let params = {
        type: this.activeTab,
        id:this.isEdit?this.$route.query.id:'',
        name: this.form.indicatorName,
        content: this.form.indicatorDescription,
      };
      let res = await addIndexTip(params);
      this.saveLoading =false
      if (res.code === 200) {
        this.handleCancel();
      }
    },
    handleCancel() {
      this.$router.push({
        path: "/FeedBack/shopDiagnosis",
        query: {
          tabIndex: this.activeTab,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 50px;
  width: 1000px;
  .item {
    padding-bottom: 30px;
    display: flex;
    .label {
      width: 100px;
      .star {
        color: crimson;
      }
    }
  }
  .item:first-child {
    align-items: center;
  }
  .errorTips {
    height: 16px;
    text-align: center;
    color: crimson;
    font-size: 16px;
  }
  .btn-group {
    text-align: center;
    padding-top: 20px;
    /deep/ .el-button {
      width: 100px;
      height: 30px;
      padding: 0;
    }
  }
}
</style>
