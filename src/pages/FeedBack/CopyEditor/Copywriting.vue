<template>
  <div class="container" v-loading="tableLoading">
    <el-form :model="form" ref="form" :rules="rulesForm" label-width="95px">
      <el-form-item label="标题：" prop="title">
        <el-input placeholder="请输入标题" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="文案内容：" prop="content">
        <quill-editor
          v-model="form.content"
          ref="myQuillEditor"
          class="ql-snow ql-editor"
          :options="editorOption"
        ></quill-editor>
        <el-upload action :http-request="uploadImg" :show-file-list="false" style="display: none">
          <i class="el-icon-plus avatar-uploader-icon" id="imgInput"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button type="primary" size="small" @click="handleSave">保存</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import copyEditor from "../../../api/copyEditor";
import { quillEditor } from "vue-quill-editor";
import quillOptions from "mixins/quillOptions";
export default {
  mixins: [quillOptions],
  data() {
    const contentValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("文案内容不能为空"));
      } else {
        callback();
      }
    };
    return {
      copywritingId: 0,
      form: {
        title: "",
        content: ""
      },
      addRange: 0,
      rulesForm: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [
          { required: true, validator: contentValidate, trigger: "blur" }
        ]
      },
      tableLoading: true
    };
  },
  components: { quillEditor },
  mounted() {
    this.copywritingId = this.$route.query.id;
    this.copywritingId ? this.getCopywriting() : (this.tableLoading = false);
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
  },
  methods: {
    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        // 选择并上传一张图片
        let fileInput = document.getElementById("imgInput");
        fileInput.click(); // 加一个触发事件
      }
    },
    uploadImg(formdata) {
      let params = new FormData();
      params.append("file", formdata.file);
      copyEditor.uploadImage(params).then(res => {
        if (res.code === 200) {
          // 图片的远程路径
          let value = res.data;
          // // 将图片添加到富文本内容区域
          this.addRange = this.$refs.myQuillEditor.quill.getSelection();
          // // 调用编辑器的 insertEmbed 方法，插入URL
          this.$refs.myQuillEditor.quill.insertEmbed(
            this.addRange !== null ? this.addRange.index : 0,
            "image",
            value
          );
        }
      });
    },
    getCopywriting() {
      this.tableLoading = true;
      copyEditor.getOneContentById({ id: this.copywritingId }).then(res => {
        this.tableLoading = false;
        if (res.code == 200) {
          this.form.title = res.data.title;
          this.form.content = res.data.content;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSave() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let params1 = {
            id: this.copywritingId,
            title: this.form.title,
            content: this.form.content
          };
          let params2 = {
            title: this.form.title,
            content: this.form.content
          };
          let params = this.copywritingId ? params1 : params2;
          copyEditor.saveOrUpdateContent(params).then(res => {
            if (res.code == 200) {
              this.$message.success(
                this.copywritingId ? "编辑成功" : "新增成功"
              );
              this.handleCancel();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleCancel() {
      this.$router.push({
        path: "/FeedBack/contentEdit",
        query: {
          tabIndex: "1"
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/quill.scss";
.container {
  padding: 25px;
}
/deep/ .el-form {
  min-width: 800px;
  max-width: 1300px;
  /deep/ .ql-container.ql-snow {
    min-height: 260px;
  }
}
.btn-group {
  text-align: center;
  min-width: 800px;
  max-width: 1300px;
}
</style>
