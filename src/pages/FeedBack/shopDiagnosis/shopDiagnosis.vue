<!--店铺诊断-->
<template>
  <div class="container">
    <el-tabs type="card" v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="店铺指标" name="1"></el-tab-pane>
      <el-tab-pane label="商品指标" name="2"></el-tab-pane>
    </el-tabs>
    <div class="newAdd-btn">
      <el-button type="primary" size="small" @click="newAddShopDiagnosis"
        >新增</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="指标名称"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="edit-btn"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-if="pagination.total > pagination.size"
        :page-size="pagination.size"
        @current-change="changeCurrentPage"
        :current-page="pagination.page"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import copyEditor from "../../../api/copyEditor";
import { listIndexTip } from "../../../api/feedback"
export default {
  data() {
    return {
      activeTab: "1",
      tableData: [],
      pagination: {
        page: 1,
        size: 10,
        total: null,
      },
      tableLoading: true,
      newAddPath:{
          '1':'/FeedBack/shopDiagnosis/newAddShopIndicator',
          '2':'/FeedBack/shopDiagnosis/newAddGoodsIndicator'
      },
      editPath:{
          '1':'/FeedBack/shopDiagnosis/updateShopIndicator',
          '2':'/FeedBack/shopDiagnosis/updateGoodsIndicator'
      },
    };
  },
  created() {
    if (localStorage.getItem("tabIndex")) {
      this.activeTab = localStorage.getItem("tabIndex");
    } else if (this.$route.query.tabIndex) {
      localStorage.setItem("tabIndex", this.$route.query.tabIndex);
      this.activeTab = this.$route.query.tabIndex;
    }
    this.getShopDiagnosisList();
  },
  destroyed() {
    localStorage.removeItem("tabIndex");
  },
  methods: {
    getShopDiagnosisList() {
      this.tableLoading = true;
      localStorage.setItem("tabIndex", this.activeTab);
      let params = {
        type:this.activeTab,
        page: this.pagination.page,
        size: this.pagination.size,
      };
      listIndexTip(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 200) {
          this.tableData = res.data.results;
          this.pagination.total = res.data.totalCount;
        } else {
          this.tableData = [];
          this.pagination.total = null;
        }
      });
    },
    tabClick() {
      this.pagination.page = 1;
      this.getShopDiagnosisList();
    },
    changeCurrentPage(currentPage) {
      this.pagination.page = currentPage;
      this.getShopDiagnosisList();
    },
    // 新增店铺诊断
    newAddShopDiagnosis() {
      this.$router.push({
        path: this.newAddPath[this.activeTab],
        query: {
          activeTab: this.activeTab
        },
      });
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: this.editPath[this.activeTab],
        query: { id:row.id, activeTab: this.activeTab ,name:row.name,content:row.content}
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  /deep/ .el-tabs__content {
    padding: 0 !important;
  }
  .newAdd-btn {
    padding-left: 30px;
    /deep/ .el-button {
      width: 76px;
      height: 30px;
    }
  }
}
.el-table {
  .delete-btn {
    color: #f00;
  }
}
.pagination {
  text-align: center;
  margin: 20px;
}
</style>