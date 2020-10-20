<template>
  <div class="container">
    <el-tabs type="card" v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="功能说明" name="1"></el-tab-pane>
      <el-tab-pane label="下单说明" name="2"></el-tab-pane>
      <el-tab-pane label="任务简介" name="3"></el-tab-pane>
    </el-tabs>
    <div class="newAdd-btn">
        <el-button type="primary" size="small" @click="newAddCopywriting">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="text"  class="edit-btn" @click="handleEdit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-if="pagination.total>20"
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
export default {
  data() {
    return {
      activeTab: "1",
      tableData: [],
      pagination: {
        page: 1,
        size: 20,
        total: null
      },
      // 点击编辑跳转的路由
      editPath:{
        '1':'/FeedBack/contentEdit/EditCopywriting',
        '2':'/FeedBack/contentEdit/EditOrderDescription',
        '3':'/FeedBack/contentEdit/EditTaskBrief',
      },
      // 点击新增跳转的路由
      newAddPath:{
        '1':'/FeedBack/contentEdit/NewAddCopywriting',
        '2':'/FeedBack/contentEdit/NewAddOrderDescription',
        '3':'/FeedBack/contentEdit/NewAddTaskBrief',
      },
      tableLoading:true
    };
  },
  created() {
    if(localStorage.getItem("tabIndex")){
      this.activeTab = localStorage.getItem("tabIndex")
    } else if(this.$route.query.tabIndex){
      localStorage.setItem('tabIndex',this.$route.query.tabIndex)
      this.activeTab = this.$route.query.tabIndex
    }
    this.getCopyEditorList();
  },
  destroyed(){
    localStorage.removeItem("tabIndex")
  },
  methods:{
    getCopyEditorList() {
      this.tableLoading = true
      localStorage.setItem('tabIndex',this.activeTab)
      let params = {
        pageNo: this.pagination.page,
        pageSize: this.pagination.size
      };
      let  request = {
        '1':copyEditor.getContentList,
        '2':copyEditor.getOrderDescriptionList,
        '3':copyEditor.getTaskDescriptionList
      }
      let require  = request[this.activeTab](params)
      require.then(res => {
        this.tableLoading = false
        if (res.code == 200) {
          this.tableData = res.data.results;
          this.pagination.total = res.data.totalCount;
        }else{
          this.tableData = []
          this.pagination.total = null
          this.$message.error(res.msg)
        }
      });
    },
    tabClick(){
      this.pagination.page = 1
      this.getCopyEditorList()
    },
    changeCurrentPage(currentPage){
        this.pagination.page = currentPage
        this.getCopyEditorList()
    },
    // 新增文案
    newAddCopywriting(){
      this.$router.push(this.newAddPath[this.activeTab])
    },
    // 编辑
    handleEdit(id){
      this.$router.push({path:this.editPath[this.activeTab],query:{
        id
      }})
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  /deep/ .el-tabs__content{
      padding:0 !important
  }
    .newAdd-btn{
        padding-left:30px;
        /deep/ .el-button{
            width:76px;
            height:30px;
        }
    }
}
.el-table{
    .delete-btn{
        color:#f00;
    }
}
.pagination{
    text-align: center;
    margin:20px;
}
</style>