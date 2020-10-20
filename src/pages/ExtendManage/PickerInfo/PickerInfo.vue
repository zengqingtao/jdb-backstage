<template>
  <div class="CustomerInfo">
    <div class="header">
      <div>
        <el-input placeholder="请输入京店宝账号" size="small" v-model="jdbAccount" clearable></el-input>
        <el-button type="primary" @click="searchFun" size="small" style="marginLeft:15px"
          >查询</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.jdbAccount || `--` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名">
        <template slot-scope="scope">
          <span>{{scope.row.contactName ||`--`}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户电话">
        <template slot-scope="scope">
          <span>{{scope.row.contactPhone ||  `--`}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户微信">
        <template slot-scope="scope">
          <span>{{ scope.row.wx || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户等级">
        <template slot-scope="scope">
          <span>{{ scope.row.level == 1? `初级`: `中级` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一般分成">
        <template slot-scope="scope">
          <span>{{ (scope.row.generalRatio && scope.row.generalRatio!== '--') ? `${scope.row.generalRatio}%` : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="常规免单分成">
        <template slot-scope="scope">
          <span>{{ (scope.row.freeRatio && scope.row.freeRatio !== '--') ? `${scope.row.freeRatio}元` : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.registerTime || `--`}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.manageUser || `--` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button type="text" @click="changeModalVisibleFn(scope.row)"
              >修改</el-button
            >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改挑客信息"
      :visible.sync="changeModalVisible"
      width="28%"
      center
    >
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="账号" required>
          <span>{{form.jdbAccount}}</span>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="form.contactName" size="small" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" size="small" placeholder="请输入用户电话"></el-input>
        </el-form-item>
        <el-form-item label="用户微信" >
          <el-input v-model="form.wx" size="small" placeholder="请输入用户微信"></el-input>
        </el-form-item>
        <el-form-item label="用户等级">
          <el-select v-model="form.level" placeholder="请选择" size="small">
            <el-option :value="1" label="初级">初级</el-option>
            <el-option :value="2" label="中级">中级</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一般分成" v-if="Number(form.level) !== 1" prop="generalRatio">
          <div class="freeRatio">
            <el-input v-model="form.generalRatio" size="small" placeholder="请输入一般分成"></el-input>
            <span>%</span>
          </div>
        </el-form-item>
        <el-form-item label="常规免单分成" v-if="Number(form.level) !== 1" prop='freeRatio'>
          <div class="generalRatio-box">
            <el-input v-model="form.freeRatio" size="small" placeholder="请输入常规免单分成"></el-input>
            <span>元/单</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFn">保 存</el-button>
        <el-button @click="changeModalVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-row justify="end" type="flex" class="pagination" v-if="totalCount > 10">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="size"
        layout="prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-row>
  </div>
</template>
<script>
import extendManage from "api/extendManage";
export default {
  name: "PickerInfo",
  data() {
    var validateGeneralRatio = (rule, value, callback) => {
      if(!value) return callback()
      if (Number(value) >100) {
        callback(new Error("一般分成比例不能大于100"));
      } else if (!/^\d+\.?\d{0,2}$/.test(value) && !isNaN(value)){
        callback(new Error("价格最多为两位小数"));
      } else if(isNaN(value)){
        callback(new Error("价格为数值"));
      }
      callback();
    };
    var validateFreeRatio = (rule, value, callback) => {
      if(!value) return callback()
       if (!/^\d+\.?\d{0,2}$/.test(value) && !isNaN(value)){
        callback(new Error("常规免单分成最多为两位小数"));
      } else if(isNaN(value)){
        callback(new Error("常规免分成为数值"));
      }
      callback();
    };
    return {
      tableData: [],
      changeModalVisible: false,
      form: {
        contactName: "",
        contactPhone: "",
        pickerId: "",
        wx: "",
        level:'',
        jdbAccount:'',
        freeRatio: '',
        generalRatio: ''
      },
      rules: {
        contactPhone: [
            { required: true, message: "请输入用户电话", trigger: "blur" },
        ],
        generalRatio: [
            {
            validator: validateGeneralRatio,
            trigger: ["change", "blur"]
          }
        ],
        freeRatio: [
            {
            validator: validateFreeRatio,
            trigger: ["change", "blur"]
          }
        ],
        
      },
      page: 1,
      size: 10,
      jdbAccount: "",
      totalCount: 0
    };
  },
  created() {
    this.listOperationPicker();
  },
  methods: {
    async listOperationPicker() {
      let params = {
        page: this.page,
        size: this.size,
        jdbAccount: this.jdbAccount,
      };
      const { data, msg, code } = await extendManage.listOperationPicker(params);
      if (code === 200) {
        this.tableData = data.results;
        this.page = data.pageNo;
        this.totalCount = data.totalCount;
      } else {
        this.tableData = [];
        this.page = 1;
        this.size = 10;
        this.totalCount = 0;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.listOperationPicker();
    },
    searchFun() {
      this.page = 1
      this.listOperationPicker();
    },
    changeModalVisibleFn(val) {
      Object.keys(this.form).forEach(key => {
        if(val[key] === '--') {
            this.form[key] = ''
        } else {
            this.form[key] = val[key]
        } 
      })
      this.changeModalVisible = true;
    },
    saveFn() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let params = {...this.form}
          delete params.jdbAccount
          const {data, code} = await extendManage.updatePickerInfo(params)
          if(code === 200) {
            this.$message.success(`修改成功`)
            this.listOperationPicker()
            this.changeModalVisible =false
          }
        } else {
          return false;
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 15px;
}
.pagination {
  padding: 20px 50px 0 0;
}
.header{
  display: flex;
  justify-content: flex-end;
  div{
    width: 300px;
    display: flex;
  }
}
.el-select {
    width: 100%;
}
.generalRatio-box,
.freeRatio {
  display: flex;
  span {
    min-width: 40px;
    text-align: center;
  }
}
</style>
