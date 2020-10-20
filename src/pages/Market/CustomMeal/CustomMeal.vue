<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-button
            type="primary"
            size="small"
            plain
            @click="mealModalStatus = true, modalType = 1"
          >新增自定义套餐</el-button>
          <el-button type="primary" size="small" plain @click="tableModalStatus = true">表格批量导入</el-button>
          <el-button type="primary" size="small" plain @click="remakeModalShow">备注与发布须知管理</el-button>
        </el-col>
        <el-form inline size="small">
          <el-form-item>
            <el-input clearable v-model="search" placeholder="渠道名称"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="渠道">
          <template slot-scope="scope">
            <el-popover placement="top" width="200" trigger="hover" :content="scope.row.name">
              <div slot="reference" class="ellipsis">{{ scope.row.name }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容">
          <template slot-scope="scope">
            <el-popover placement="top" width="200" trigger="hover" :content="scope.row.content">
              <div slot="reference" class="ellipsis">{{ scope.row.content }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column label="渠道详情">
          <template slot-scope="scope">
            <el-button type="text" @click="reviewModal(scope.row, 2)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template
            slot-scope="scope"
          >{{ scope.row.status === 0 ? '未上架' : scope.row.status === 1 ? '已上架' : '已下架' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status !== 1"
              @click="putAwayFn(scope.row.id, 1)"
            >上架</el-button>
            <el-button type="text" v-else @click="DelOrSoldOut(scope.row.id, 2)">下架</el-button>
            <el-button type="text" @click="reviewModal(scope.row, 3)">编辑</el-button>
            <el-button type="text" class="red" @click="DelOrSoldOut(scope.row.id, 0)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" class="page" v-if="page.total">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          layout="total, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </el-row>
    </el-main>

    <el-dialog
      title="备注与发布须知管理"
      :visible.sync="modalStatus"
      width="40%"
      center
      :close-on-click-modal="false"
      @close="closeModalFn"
    >
      <el-form ref="form" :model="form" label-width="85px" size="small">
        <el-form-item label="备注:" prop="remark" :rules="[{required: true, message: '备注不能为空'}]">
          <quill-editor v-model="form.remark" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="发布须知:" prop="notice" :rules="[{required: true, message: '备注不能为空'}]">
          <quill-editor v-model="form.notice" :options="editorOption"></quill-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitRemarkFn" :loading="btnStatus">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="表格批量导入"
      :visible.sync="tableModalStatus"
      width="40%"
      center
      :close-on-click-modal="false"
      @close="closeModalFn"
    >
      <p>表格批量导入，支持通过1张表格导入多个渠道数据，批量导入仅限于新增渠道。</p>
      <p>导入后，每个渠道的关联类目仍需您手动选择。</p>
      <div class="nowrap">
        <h2>Step 1:</h2>
        <span class="mg-l-10">请下载表格模板，按模板填写</span>
      </div>
      <el-row type="flex" class="flexContainer">
        <div>
          <img src="../../../assets/img/template-icon.png" width="150" height="150" />
          <a
            class="downBtn"
            :href="`${publicPath}集市自定义套餐填写模板.xlsx`"
            download="集市自定义套餐填写模板.xlsx"
          >点击下载</a>
        </div>
        <ul>
          <li>注意事项</li>
          <li>① 表格的每行、每列不能合并单元格</li>
          <li>② 不能有2条数据渠道和内容均一致</li>
          <li>③ 填写错误的项目自动留空，例如：价格本应填写“300”，却写了“三百”</li>
        </ul>
      </el-row>
      <div class="nowrap">
        <h2>Step 2:</h2>
        <span
          class="mg-l-10"
        >上传完成后，在弹窗中通过“检查下一条”检查导入的每个渠道的信息， 并完成每个渠道的“关联类目”选择，最终点击“检查完毕”，数据才全部上传成功。</span>
      </div>
      <el-upload
        ref="upload"
        class="uploadContainer"
        :headers="{ token:jdb_token }"
        :action="readFileUrl"
        :auto-upload="false"
        :limit="1"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-change="handlePreview"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :beforeUpload="beforeAvatarUpload"
        accept=".csv, .xls, .xlsx"
        :file-list="fileList"
      >
        <el-button type="primary" class="uploadBtn" size="mini">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过10M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :loading="btnStatus"
          v-if="notChannelLength === 0 && failLength === 0"
          @click="submitUpload"
        >点击上传</el-button>
        <template v-else>
          <el-button type="primary" size="small" :loading="btnStatus" @click="moreImport">去查看</el-button>
          <p class="uploadTips" v-if="failLength === 0">{{ notChannelLength }}条数据已经全部成功导入</p>
          <p class="uploadTips" v-else @click="failStatus = true">
            <el-button type="text">{{ failLength }}</el-button>条数据未成功导入
          </p>
        </template>
      </span>
    </el-dialog>

    <el-dialog
      class="modalForm"
      :title="modalTitle"
      :visible.sync="mealModalStatus"
      width="750px"
      center
      :close-on-click-modal="false"
      @close="closeModalFn"
    >
      <el-form
        ref="mealForm"
        :model="mealForm"
        label-width="85px"
        size="small"
        :disabled="modalType === 2"
      >
        <el-form-item label="渠道:" prop="name" :rules="[{required: true, message: '渠道不能为空'}]">
          <el-input v-model="mealForm.name" placeholder="请输入渠道"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content" :rules="[{required: true, message: '内容不能为空'}]">
          <el-input v-model="mealForm.content" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item
          label="品类限定:"
          prop="categoryRestrict"
          :rules="[{required: true, message: '品类限定不能为空'}]"
        >
          <el-input v-model="mealForm.categoryRestrict" placeholder="请输入品类限定"></el-input>
        </el-form-item>
        <el-form-item
          label="单价:"
          prop="price"
          :rules="[{required: true, message: '单价不能为空'},{validator: checkNumber, trigger: 'blur'}]"
        >
          <el-row type="flex">
            <el-input v-model="mealForm.price" placeholder="请输入单价"></el-input>
            <span class="mg-l-10">元</span>
          </el-row>
        </el-form-item>
        <el-form-item
          label="产品数:"
          prop="productNumber"
          :rules="[{required: true, message: '产品数不能为空'}]"
        >
          <el-input v-model="mealForm.productNumber" placeholder="请输入产品数"></el-input>
        </el-form-item>
        <el-form-item
          label="渠道方向:"
          prop="direction"
          :rules="[{required: true, message: '渠道方向不能为空'}]"
        >
          <el-input
            type="textarea"
            resize="none"
            :autosize="{ minRows: 4 }"
            v-model="mealForm.direction"
            placeholder="请输入渠道方向"
          ></el-input>
        </el-form-item>
        <el-form-item label="展示周期:" prop="period" :rules="[{required: true, message: '展示周期不能为空'}]">
          <el-input v-model="mealForm.period" placeholder="请输入展示周期"></el-input>
        </el-form-item>
        <el-form-item label="关联类目:" prop="list" :rules="[{required: true, message: '关联类目不能为空'}]">
          <p class="tips">一个渠道可关联多个类目，类目关联后，用户在自定义套餐选择关联的类目时，会展现当前渠道</p>
          <el-checkbox-group v-model="mealForm.list">
            <el-checkbox
              v-for="item in categoryList"
              :label="item.id"
              :key="item.id"
              border
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="modalType === 1 || modalType === 3">
        <el-button
          type="primary"
          size="small"
          @click="resetMealForm"
          :loading="btnStatus"
          v-show="modalType === 1"
        >继续新增渠道</el-button>
        <el-button type="primary" size="small" @click="submitMealFn" :loading="btnStatus" plain>我已填好</el-button>
        <el-button type="primary" size="small" @click="closeModalFn" :loading="btnStatus" plain>关闭</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else-if="modalType === 2">
        <el-button type="primary" size="small" :loading="btnStatus" plain @click="switchMeal(0)">上一条</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" @click="closeModalFn">我知道了</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" plain @click="switchMeal(1)">下一条</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else-if="modalType === 4">
        <el-button
          type="primary"
          size="small"
          :loading="btnStatus"
          @click="switchImport"
          v-if="notChannelLength > index + 1"
        >检查下一条</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="btnStatus"
          @click="submitMealFn"
          v-else
        >检查完毕</el-button>
        <el-button type="primary" size="small" @click="closeModalFn" :loading="btnStatus" plain>关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="未导入明细"
      :visible.sync="failStatus"
      :modal-append-to-body="false"
      width="450px"
      center
      :close-on-click-modal="false"
      @close="closeFailModal"
    >
      <el-table :data="failChannel">
        <el-table-column label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 + page.pageSize * (page.pageNo - 1) }}</template>
        </el-table-column>
        <el-table-column prop="name" label="渠道">
          <template slot-scope="scope">
            <el-popover placement="top" width="200" trigger="hover" :content="scope.row.name">
              <div slot="reference" class="ellipsis">{{ scope.row.name }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容">
          <template slot-scope="scope">
            <el-popover placement="top" width="200" trigger="hover" :content="scope.row.content">
              <div slot="reference" class="ellipsis">{{ scope.row.content }}</div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script>
import tableMixins from "mixins/tableMixins";
import talent from "api/talent";
import { mapState } from "vuex";
import { quillEditor } from "vue-quill-editor";

export default {
  name: "CustomMeal",
  mixins: [tableMixins],
  components: { quillEditor },
  data() {
    return {
      editorOption: {
        placeholder: "请在此输入文本..."
      },
      readFileUrl: `${process.env.VUE_APP_API}${talent.readFile}`, // 导入文件地址
      fileList: [], // 批量导入文件
      publicPath: process.env.BASE_URL,
      modalType: 1, // 1、新增 2、查看 3、编辑 4、批量导入
      tableModalStatus: false, // 批量导入弹窗状态
      tableModalBtnStatus: 0, // 0：点击上传（上传前） 1：上传中（上传中） 2：去查看（全部都上传完毕）3：去查看（部分上传成功）
      mealModalStatus: false,
      categoryList: [],
      form: {
        remark: "",
        notice: ""
      },
      mealForm: {
        name: "", // 渠道
        content: "", // 内容
        categoryRestrict: "", // 品类限定
        price: "", // 单价
        productNumber: "", // 产品数
        direction: "", // 渠道方向
        period: "", // 展示周期
        list: [] // 关联类目
      },
      notChannel: [], // 成功导入文件明细
      failChannel: [], // 失败导入文件明细
      failStatus: false, // 失败导入文件明细弹窗状态
      index: 0 // 成功导入文件明细下标
    };
  },
  computed: {
    ...mapState(["jdb_token"]),
    modalTitle() {
      return this.modalType === 2
        ? "查看自定义套餐"
        : this.modalType === 3
        ? "编辑自定义套餐"
        : "新增自定义套餐";
    },
    notChannelLength() {
      return this.notChannel.length;
    },
    failLength() {
      return this.failChannel.length;
    }
  },
  methods: {
    checkNumber(rule, value, callback) {
      if (value === "") {
        callback(new Error("单价为空"));
      } else if (!Number(value)) {
        callback(new Error("单价必须为数字"));
      } else if (Number(value) <= 0) {
        callback(new Error("单价必须大于0"));
      } else {
        callback();
      }
    },
    moreImport() {
      if (this.notChannelLength > 0) {
        this.index = 0;
        this.reviewModal(this.notChannel[this.index], 4);
      } else {
        this.$message.error("没有成功导入的数据");
      }
    },
    async switchImport() {
      if (this.notChannelLength > this.index + 1) {
        this.$refs["mealForm"].validate(async valid => {
          if (valid) {
            this.btnStatus = true;
            const { categoryRestrict, ...params } = this.mealForm;
            if (!params.hasOwnProperty("restrict"))
              params["restrict"] = categoryRestrict;
            const { code, msg } = await talent.addPackage(params);
            this.btnStatus = false;
            if (code === 200) {
              this.$message.success(msg || "操作成功");
              this.$refs["mealForm"].resetFields();
              this.index++;
              this.reviewModal(this.notChannel[this.index], 4);
              this.pageLoad();
            } else {
              this.$message.error(msg || "操作失败");
            }
          }
        });
      } else {
        this.$message.error("没有更多成功导入的数据");
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleError(error) {
      this.$message.error(error.msg || "文件上传失败,请删除重试");
    },
    handleSuccess(res) {
      if (res.code === 200) {
        this.notChannel = res.data.success;
        this.failChannel = res.data.fail;
      } else {
        this.notChannel = [];
        this.failChannel = [];
        this.$message.error(res.msg);
      }
    },
    handlePreview(file, fileList) {
      this.fileList = fileList;
    },
    handleExceed() {
      this.$message.error("当前限制只能选择 1 个文件");
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.notChannel = [];
      this.failChannel = [];
    },
    beforeAvatarUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extensionXls = extension === "xls";
      const extensionXlsx = extension === "xlsx";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!extensionXls && !extensionXlsx) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
      }
      if (!isLt10M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "warning"
        });
      }
      return (extensionXls || extensionXlsx) && isLt10M;
    },
    async remakeModalShow() {
      const { code, data } = await talent.getRemark();
      this.form = {
        remark: code === 200 && data.remarks ? data.remarks : "",
        notice: code === 200 && data.notice ? data.notice : ""
      };
      this.modalStatus = true;
    },
    closeModalFn() {
      this.modalStatus = this.btnStatus = this.mealModalStatus = this.tableModalStatus = this.failStatus = false;
      this.form = { remark: "", notice: "" };
      this.mealForm = {
        name: "",
        content: "",
        categoryRestrict: "",
        price: "",
        productNumber: "",
        direction: "",
        period: "",
        list: []
      };
      this.notChannel = this.fileList = this.failChannel = [];
      this.index = 0;
    },
    closeFailModal() {
      this.failStatus = false;
    },
    async resetMealForm() {
      this.$refs["mealForm"].validate(async valid => {
        if (valid) {
          this.btnStatus = true;
          const { categoryRestrict, ...params } = this.mealForm;
          if (!params.hasOwnProperty("restrict"))
            params["restrict"] = categoryRestrict;
          const { code, msg } = await talent.addPackage(params);
          this.btnStatus = false;
          if (code === 200) {
            this.$message.success(msg || "操作成功");
            this.$refs["mealForm"].resetFields();
            this.pageLoad();
          } else {
            this.$message.error(msg || "操作失败");
          }
        }
      });
    },
    submitMealFn(runClose = true) {
      this.$refs["mealForm"].validate(async valid => {
        if (valid) {
          this.btnStatus = true;
          const { categoryRestrict, ...params } = this.mealForm;
          if (!params.hasOwnProperty("restrict"))
            params["restrict"] = categoryRestrict;
          const { code, msg } = await talent.addPackage(params);
          this.btnStatus = false;
          if (code === 200) {
            this.$message.success(msg || "操作成功");
            this.pageLoad();
            runClose && this.closeModalFn();
          } else {
            this.$message.error(msg || "操作失败");
          }
        }
      });
    },
    async reviewModal(row, modalType) {
      this.modalType = modalType;
      await this.getMealInfo(row);
      this.mealModalStatus = true;
    },
    async switchMeal(desc) {
      const { code, data } = await talent.listPackage({
        id: this.mealForm.id,
        desc
      });
      if (code === 200) {
        this.btnStatus = true;
        await this.getMealInfo(data[0]);
        this.btnStatus = false;
      } else {
        const msg = desc === 0 ? "当前已经是第一条" : "当前已经是最后一条";
        this.$message.error(msg);
      }
    },
    async getMealInfo(row) {
      const restrict = row.hasOwnProperty("restrict")
        ? row["restrict"]
        : row["categoryRestrict"];
      const categoryRestrict = row.hasOwnProperty("categoryRestrict")
        ? row["categoryRestrict"]
        : row["restrict"];
      const newInfo = Object.assign(row, { restrict, categoryRestrict });
      const array = Object.keys(newInfo);
      this.mealForm = Object.assign(this.mealForm, {
        restrict,
        categoryRestrict
      });
      Object.keys(this.mealForm).forEach(item => {
        if (array.includes(item)) this.mealForm[item] = newInfo[item];
      });
      if (!row.hasOwnProperty("id")) return;
      const { code, data ,msg} = await talent.categoryById({ id: row.id });
      if (code === 200) {
        this.mealForm["list"] = Object.values(data.map(item => item.id));
        this.mealForm["id"] = row.id;
      } else {
        this.categoryList = []
        this.mealForm={
        name: "", // 渠道
        content: "", // 内容
        categoryRestrict: "", // 品类限定
        price: "", // 单价
        productNumber: "", // 产品数
        direction: "", // 渠道方向
        period: "", // 展示周期
        list: [] // 关联类目
      },
        this.$message.error(msg)
      }
    },
    submitRemarkFn() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.btnStatus = true;
          const { code, msg } = await talent.addRemarks(this.form);
          this.btnStatus = false;
          if (code === 200) {
            this.$message.success(msg || "添加备注和发布须知成功");
            this.closeModalFn();
            this.pageLoad();
          } else {
            this.$message.error(msg || "添加备注和发布须知失败");
          }
        }
      });
    },
    async putAwayFn(id, type) {
      const { code, msg } = await talent.changeCustomPackage({ id, type });
      if (code === 200) {
        this.$message.success(msg || "上架成功");
        this.pageLoad();
      } else {
        this.$message.error(msg || "上架失败");
      }
    },
    DelOrSoldOut(id, type) {
      const title = type === 2 ? "下架确认" : "删除确认";
      const content =
        type === 2
          ? "下架后，用户将不可再下单此渠道内容，但用户原先已下单的内容仍然可见并有效。"
          : "删除后，用户将不可再下单此渠道内容，但用户原先已下单的内容仍然可见并有效。";
      const setting = {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      };
      this.$confirm(content, title, setting).then(async () => {
        const { code, msg } = await talent.changeCustomPackage({ id, type });
        if (code === 200) {
          this.$message.success(type === 2 ? "下架成功" : "删除成功");
          this.pageLoad();
        } else {
          this.$message.error(msg || (type === 2 ? "下架失败" : "删除失败"));
        }
      });
    },
    async getListCategory() {
      const { code, data } = await talent.listCategory();
      this.categoryList = code === 200 ? data : [];
    },
    async pageLoad() {
      const { code, data, page, allCount } = await talent.listPackage({
        page: this.page.pageNo,
        search: this.search
      });
      if (code === 200) {
        this.page.pageNo = page;
        this.page.total = allCount;
        this.tableData = data;
      } else {
        this.page.pageNo = 1;
        this.page.total = null;
        this.tableData = [];
      }
    }
  },
  mounted() {
    this.getListCategory();
    this.pageLoad();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/tableMixins";
.uploadContainer {
  text-align: center;
}
.ellipsis {
  margin: 0 auto;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nowrap {
  h2 {
    white-space: nowrap;
  }
  display: flex;
  align-items: center;
}
.downBtn {
  font-size: 14px;
  color: #4d88f5;
}
.flexContainer {
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  ul {
    list-style: none;
    padding: 0;
    line-height: 30px;
  }
}
.tips {
  margin: 0;
  color: #999;
  font-size: 12px;
  text-indent: 10px;
}
.uploadTips {
  font-size: 14px;
  color: #999;
  cursor: pointer;
}
.modalForm {
  /deep/ .el-dialog__body {
    overflow-y: auto;
    height: 550px;
  }
}
/deep/ .el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  .el-checkbox:nth-child(4n) {
    margin-right: 0;
  }
  .el-checkbox {
    width: 20%;
    margin: 0 10px 20px 10px;
  }
  .el-checkbox__label {
    padding: 0;
  }
  .is-checked {
    background: #409eff;
    .el-checkbox__label {
      color: #fff;
    }
  }
  .el-checkbox .el-checkbox--small .is-bordered {
    margin: 0;
  }
  .el-checkbox__inner {
    display: none;
  }
}
/deep/ .ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
/deep/ .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

/deep/ .ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
/deep/
  .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value="monospace"]::before,
/deep/
  .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
