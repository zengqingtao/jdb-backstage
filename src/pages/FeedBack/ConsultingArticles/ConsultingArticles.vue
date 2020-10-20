<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeIndex" @tab-click="tabClick">
        <el-tab-pane label="搜索书生" name="1"></el-tab-pane>
        <el-tab-pane label="运营攻略" name="2"></el-tab-pane>
      </el-tabs>
      <el-header class="header">
        <el-button type="primary" @click="addArticle">添加文章</el-button>
      </el-header>
      <template>
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="createTime" label="发布时间"></el-table-column>
          <el-table-column prop="articleTitle" label="标题"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="getArticleById(scope.row.id)">查看</el-button>
              <el-button type="text" @click="updateArticle(scope.row)">修改</el-button>
              <el-button type="text" class="delete-btn" @click="deleteFn(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="totalCount > 10"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalCount"
          ></el-pagination>
        </el-col>
      </el-row>

      <el-dialog
        :title="title"
        :visible.sync="addAriclesVisible"
        :close-on-click-modal="false"
        width="40%"
        center
      >
        <el-form ref="articleForm" :model="articleForm" label-width="80px">
          <el-form-item
            label="标题："
            prop="articleTitle"
            :rules="[
              { required: true, message: '文章标题不能为空', trigger: 'blur' }
            ]"
          >
            <el-input v-model="articleForm.articleTitle"></el-input>
          </el-form-item>
          <el-form-item
            label="链接："
            prop="articleLink"
            :rules="[
              { required: true, message: '链接不能为空', trigger: 'blur' }
            ]"
          >
            <el-input v-model="articleForm.articleLink"></el-input>
          </el-form-item>
          <el-form-item
            label="图片："
            prop="fileList"
            :rules="[
              { required: true, message: '图片不能为空', trigger: 'change' }
            ]"
            :class="{'hideAddBtn':articleForm.fileList.length}"
          >
            <el-upload
              :action="uploadImgUrl"
              :headers="{ token:jdb_token }"
              :limit="1"
              :file-list="articleForm.fileList"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              accept=".jpg,.jpeg,.png,.gif,.bmp"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveArticle" :loading="loading">保 存</el-button>
          <el-button @click="addAriclesVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="查看文章"
        :visible.sync="getAriclesVisible"
        :close-on-click-modal="false"
        width="50%"
        center
        class="get-Article"
      >
        <el-form ref="form" :model="getArticleForm" label-width="80px">
          <el-form-item label="标题：">
            <p>{{ getArticleForm.articleTitle }}</p>
          </el-form-item>
          <el-form-item label="链接：">
            <p>{{ getArticleForm.articleLink }}</p>
          </el-form-item>
          <el-form-item label="图片：">
            <pre-view :previewList="[getArticleForm.imageUrl]">
              <img :src="getArticleForm.imageUrl" alt style="width: 100px; height: 100px" />
            </pre-view>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import searchArticle from "../../../api/searchArticle.js";
import preView from "components/preView";
import { mapState } from "vuex";
export default {
  name: "ConsultingArticles",
  components: {
    preView
  },
  data() {
    return {
      activeIndex: "1",
      pageNo: 1,
      totalCount: 0,
      addAriclesVisible: false,
      getAriclesVisible: false,
      articleForm: {
        articleTitle: "",
        articleLink: "",
        fileList: []
      },
      imageUrl: "",
      getArticleForm: {
        articleTitle: "",
        articleLink: "",
        imageUrl: "",
        id: ""
      },
      tableData: [],
      title: "添加文章",
      loading: false,
      tableLoading: true, //列表加载状态
      uploadImage:
        process.env.VUE_APP_API + searchArticle.uploadImage,
      strategyUploadImage:
        process.env.VUE_APP_API + searchArticle.strategyUploadImage
    };
  },
  computed: {
    ...mapState(["jdb_token"]),
    uploadImgUrl() {
      let url = "";
      switch (this.activeIndex) {
        case "1":
          url = this.uploadImage;
          break;
        case "2":
          url = this.strategyUploadImage;
          break;
      }
      return url;
    }
  },
  created() {
    this.getArticleList();
  },
  watch: {
    addAriclesVisible(val) {//关闭对话框时清空表单的数据，否则先点击修改后点击添加的话，修改的表单内容就还存在
      if (!val) {
        this.articleForm = {
          articleTitle: "",
          articleLink: "",
          fileList: []
        };
        this.imageUrl = "";
        this.loading = false;
        this.$refs["articleForm"].resetFields();
      }
    }
  },
  methods: {
    tabClick() {
      this.pageNo = 1;
      this.getArticleList();
    },
    addArticle() {
      this.title = "添加文章";
      this.addAriclesVisible = true;
    },
    // 获取文章列表
    async getArticleList() {
      this.tableLoading = true;
      let request = {
        "1": searchArticle.getArticleList,
        "2": searchArticle.getStrategyList2
      };
      const { data, code, msg } = await request[this.activeIndex]({
        pageNo: this.pageNo
      });
      this.tableLoading = false;
      if (code === 200) {
        this.totalCount = data.totalCount;
        this.tableData = data.results;
      } else {
        this.totalCount = null;
        this.tableData = [];
        this.$message.error(msg);
      }
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.getArticleList();
    },
    // 删除文章
    deleteFn(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      }).then(async () => {
          let request = {
            "1": searchArticle.deleteOneSearchArticleById,
            "2": searchArticle.deleteOneStrategyById
          };
          const { code, msg } = await request[this.activeIndex]({
            id
          });
          if (code === 200) {
            this.$message.success(msg);
            this.getArticleList();
          } else {
            this.$message.error(msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    // 查看文章
    async getArticleById(id) {
      let request = {
        "1": searchArticle.getOneSearchArticleById,
        "2": searchArticle.getOneStrategyById
      };
      const { data, code, msg } = await request[this.activeIndex]({
        id
      });
      if (code === 200) {
        this.getArticleForm = data;
        this.getAriclesVisible = true;
      } else {
        this.$message.error(msg);
      }
    },
    beforeUpload(file) {
      //上传图片前
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handleSuccess(file, fileList) {//此处的fileList是个对象
      //上传成功
      if (file.code === 200) {
        this.imageUrl = file.data;
        this.articleForm.fileList.push(fileList);
      }
    },
    handleExceed() {
      //图片超出上限
      this.$message.error("当前限制选择 1 个文件");
    },
    handleRemove(file, fileList) {
      //移除图片
      this.imageUrl = "";
      this.articleForm.fileList = [];
    },
    // 保存文章
    saveArticle() {
      let that = this;
      this.$refs["articleForm"].validate(async valid => {
        if (valid) {
          if (!this.imageUrl) {
            return;
          }
          const params = {
            imageUrl: this.imageUrl,
            articleTitle: this.articleForm.articleTitle,
            articleLink: this.articleForm.articleLink,
            id: this.articleForm.id
          };
          const request = {
            "1": searchArticle.saveOrUpdateSearchArticle,
            "2": searchArticle.saveOrUpdateStrategy
          };
          const { data, code, msg } = await request[this.activeIndex](params);
          if (code === 200) {
            this.$message.success(msg);
            this.addAriclesVisible = false;
            this.getArticleList();
          } else {
            this.$message.error(msg);
          }
        } else {
          return false;
        }
      });
    },
    // 修改文章
    updateArticle(row) {
      this.addAriclesVisible = true;
      this.title = "修改文章";
      Object.keys(row).forEach(key => {
        this.articleForm[key] = row[key];
      });
      this.articleForm.fileList = [{ name: "file", url: row.imageUrl }];//打开修改对话框el-upload组件就显示图片
      this.imageUrl = row.imageUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
.delete-btn {
  color: red;
}
.get-Article {
  /deep/.el-form-item__content {
    p {
      margin: 0;
    }
  }
}
/deep/ .hideAddBtn .el-upload--picture-card {
  display: none;
}
</style>
