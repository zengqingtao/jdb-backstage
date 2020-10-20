<template>
  <el-container>
    <el-main class="main">
      <el-tabs v-model="activeIndex" type="card" @tab-click="handleTabClick">
        <el-row>
          <el-col :span="23">
            <el-form ref="form" :model="searchForm" label-width="75px" inline>
              <el-form-item label="账号" v-if="activeIndex === '1'">
                <el-input
                  v-model="searchForm.jdbAccount"
                  placeholder="请输入登录手机号"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="店铺名称">
                <el-input
                  v-model="searchForm.shopName"
                  placeholder="请输入店铺名称"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="店铺类型" v-if="activeIndex === '1'">
                <el-select
                  v-model="searchForm.isSelfShop"
                  placeholder="请选择"
                  @change="selectChange"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="item in isSelfShopOptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="价格" v-if="activeIndex === '2'">
                <div class="price">
                  <el-input v-model="searchForm.start" size="small" class="price-input"></el-input>
                  <span>~</span>
                  <el-input v-model="searchForm.end" size="small" class="price-input"></el-input>
                </div>
              </el-form-item>

              <el-form-item label="类目" v-if="activeIndex === '2'">
                <el-button type="primary" size="small" @click="chooseCateDialogVisible = true">选择类目</el-button>
                <el-button type="primary" size="small" @click="clearCheckedCate">清空类目</el-button>
                <span style="padding:0 10px;" v-if="this.firstCat.length === 0">未选中类目</span>
                <span style="padding:0 10px;" v-if="this.firstCat.length > 0">已选中类目</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" @click="searchFun" size="small">查询</el-button>
          </el-col>
        </el-row>

        <el-tab-pane label="店铺" name="1">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="shopName" label="店铺名称"></el-table-column>
            <el-table-column prop="jdbAccount" label="登录手机号"></el-table-column>
            <el-table-column prop="isSelfShop" label="店铺类型">
              <template slot-scope="scope">
                <span>{{scope.row.isSelfShop? '京东自营' : 'POP'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="shopUrl" label="店铺主页"></el-table-column>
            <el-table-column  label="客户微信">
              <template slot-scope="scope">
                <span>{{scope.row.weChat? scope.row.weChat : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户姓名">
              <template slot-scope="scope">
                <span>{{scope.row.userName? scope.row.userName : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系电话">
              <template slot-scope="scope">
                <span>{{scope.row.phone? scope.row.phone : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="toShopProduct(scope.row.shopName)">店铺商品</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="商品" name="2">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column  label="商品标题">
              <template slot-scope="scope">
                <el-link type="info" :href='scope.row.goodsUrl' target='blank'>{{scope.row.goodsTitle}}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="shopName" label="店铺名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="firstCategory" label="一级类目"></el-table-column>
            <el-table-column prop="secondCategory" label="二级类目"></el-table-column>
            <el-table-column prop="thirdCategory" label="三级类目"></el-table-column>
            <el-table-column prop="brand" label="品牌"></el-table-column>
            <el-table-column prop="skuAll" label="SKU全部评价"></el-table-column>
            <el-table-column label="SKU好评度">
              <template slot-scope="scope">
                <span>{{scope.row.skuGoodRate}}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="spuAll" label="SPU全部评价"></el-table-column>
            <el-table-column label="SPU好评度">
               <template slot-scope="scope">
                <span>{{scope.row.spuGoodRate}}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
            <el-table-column prop="thirtyDaySale" label="近30天销量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="toShop(scope.row.shopName)">店铺</el-button>
                <el-button type="text" @click="toDetail(scope.row.id)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-row
        type="flex"
        class="row-bg"
        justify="end"
        v-if="pagination.totalCount > pagination.size"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10,20,50]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.totalCount"
        ></el-pagination>
      </el-row>
    </el-main>

    <el-dialog title="选择类目" :visible.sync="chooseCateDialogVisible" width="30%" center>
      <el-tree :data="treeData" :props="defaultProps" show-checkbox ref="tree"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import productLibrary from "api/productLibrary";

export default {
  name: "productList",
  beforeRouteEnter(to, from, next) {
    if (["/productManage/productList/detail"].includes(from.path)) {
      next(vm => {
        vm.activeIndex = "2";
        vm.handleTabFn(2);
      });
    } else {
      next(vm => {
        vm.handleTabFn(1);
      });
    }
  },
  data() {
    return {
      activeIndex: "1",
      searchForm: {
        jdbAccount: "",
        shopName: "",
        isSelfShop: "",
        start: "",
        end: ""
      },
      isSelfShopOptions: [
        {
          value: 1,
          label: "京东自营"
        },
        {
          value: 0,
          label: "POP"
        }
      ],
      pagination: {
        page: 1,
        size: 10,
        totalCount: 0
      },
      tableData: [],
      tableKey: 0,
      chooseCateDialogVisible: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "category"
      },
      firstCat: [],
      secondCat: [],
      thirdCat: []
    };
  },
  created() {
    this.getCategory();
  },
  methods: {
    handleTabClick(tab, flag) {
      this.init();
      this.tableKey++;
      this.handleTabFn(Number(this.activeIndex));
    },
    init(shopName) {
      this.searchForm = {
        jdbAccount: "",
        shopName: shopName || "",
        isSelfShop: "",
        start: "",
        end: ""
      };
      this.pagination = { page: 1, size: 10, totalCount: 0 };
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.page = 1;
      this.handleTabFn(Number(this.activeIndex));
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.handleTabFn(Number(this.activeIndex));
    },
    searchFun() {
      this.pagination.page = 1;
      this.handleTabFn(Number(this.activeIndex));
    },
    async listShop() {
      this.tableData = [];
      const params = {
        page: this.pagination.page,
        size: this.pagination.size,
        jdbAccount: this.searchForm.jdbAccount,
        isSelfShop: this.searchForm.isSelfShop,
        shopName: this.searchForm.shopName
      };
      let { data, code, msg } = await productLibrary.listShop(params);
      if (code === 200) {
        this.tableData = data.results;
        this.pagination.page = data.pageNo;
        this.pagination.totalCount = data.totalCount;
      } else {
        this.tableData = [];
        this.$message.error(msg);
      }
    },
    async listGoods() {
      this.tableData = [];
      const params = {
        page: this.pagination.page,
        size: this.pagination.size,
        shopName: this.searchForm.shopName,
        start: this.searchForm.start,
        end: this.searchForm.end,
        [this.firstCat.length > 0 ? 'firstCat' : '']: this.firstCat,
        [this.secondCat.length > 0 ? 'secondCat' : '']: this.secondCat,
        [this.thirdCat.length > 0 ? 'thirdCat' : '']: this.thirdCat,
      };
      let { data, code, msg } = await productLibrary.listGoods(params);
      if (code === 200) {
        this.tableData = data.results;
        this.pagination.page = data.pageNo;
        this.pagination.totalCount = data.totalCount;
      } else {
        this.tableData = [];
        this.$message.error(msg);
      }
    },
    handleTabFn(val) {
      if (Number(val) === 1) {
        this.listShop();
      } else {
        this.listGoods();
      }
    },
    selectChange() {
      this.pagination = { page: 1, size: 10, totalCount: 0 };
      this.handleTabFn(Number(this.activeIndex));
    },
    toShopProduct(shopName) {
      this.init(shopName);
      this.activeIndex = "2";
      this.handleTabFn(2);
    },
    toShop(shopName) {
      this.init(shopName);
      this.activeIndex = "1";
      this.handleTabFn(1);
    },
    async getCategory() {
      const { code, data } = await productLibrary.getCategory();
      if (code === 200) {
        this.treeData = data;
      }
    },
    toDetail(id) {
      this.$router.push({
        path: "/productManage/productList/Details",
        query: { id }
      });
    },
    getCheckedNodes() {
      const checkCategoryList = [
        ...this.$refs.tree.getCheckedNodes(),
        ...this.$refs.tree.getHalfCheckedNodes()
      ].map(item => item.category);
      for (let [_,fistItem] of this.treeData.entries()) {
        if (checkCategoryList.includes(fistItem.category)) {
          this.firstCat.push(fistItem.category);
          for(let [_,secondItem] of fistItem.children.entries()) {
            if(checkCategoryList.includes(secondItem.category)) {
              this.secondCat.push(secondItem.category);
              for(let [_,thirdItem] of secondItem.children.entries()) {
                if(checkCategoryList.includes(thirdItem.category)) {
                  this.thirdCat.push(thirdItem.category);
                }
              }
            }
          }
        }
        this.chooseCateDialogVisible = false
      }
    },
    clearCheckedCate() {
      this.firstCat = this.secondCat = this.thirdCat = []
      this.$message.success('已清除类目')
    }
  }
};
</script>
<style lang="scss" scoped>
.row-bg {
  padding: 15px 0;
}
/deep/ .input__inner {
  width: 140px;
}
.price {
  display: flex;
  .price-input {
    width: 100px;
  }
  span {
    padding: 0 10px;
  }
}
</style>