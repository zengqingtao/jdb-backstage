<template>
  <el-container>
    <el-main class="main">
      <el-header class="header">
        <el-row type="flex" justify="end">
          <el-form size="small" inline>
            <el-form-item label="时间段:" class="mg-l-10">
              <el-date-picker
                v-model="date"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                placeholder="请输入要查询时间段"
                clearable>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="收支类型:" class="mg-l-10">
              <el-select v-model="type" placeholder="请选择收支类型" clearable>
                <el-option label="免费领取" :value="0"></el-option>
                <el-option label="充值" :value="1"></el-option>
                <el-option label="支出" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述:" class="mg-l-10">
              <el-select v-model="bizType" placeholder="请选择描述" clearable>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="京店宝账号:" class="mg-l-10">
              <el-input v-model="search" placeholder="请输入京店宝账号" clearable></el-input>
              <el-button type="primary" @click="searchFn">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-header>
      <el-table :data="tableData">
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 + page.pageSize * (page.pageNo - 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="京店宝账号">
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{ timeFn(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型">
        </el-table-column>
        <el-table-column prop="remark" label="描述">
        </el-table-column>
        <el-table-column prop="jb" label="京币">
        </el-table-column>
        <el-table-column prop="nowJb" label="剩余京币">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import tableMixins from 'mixins/tableMixins'
import jingbiDataAnalysis from 'api/jingbiDataAnalysis'
import untils from 'js/untils'

export default {
  name: 'ConsumerDetails',
  mixins: [tableMixins],
  data () {
    return {
      date: [],
      type: '',
      bizType: '',
      options: []
    }
  },
  methods: {
    timeFn (val) {
      return untils.formatTime(val)
    },
    async pageLoad () {
      const [ startDate, endDate ] = this.date && this.date.length === 2 ? this.date: ['', '']
      const res = await jingbiDataAnalysis.listConsumeDetail({ startDate, endDate, type: this.type, bizType: this.bizType, page: this.page.pageNo, size: this.page.pageSize, search: this.search })
      if (res.code === 200) {
        this.tableData = res.data
        this.page.pageNo = res.page
        this.page.total = res.allCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
    async optionsLoad () {
      const res = await jingbiDataAnalysis.listLabel()
      this.options = res
    }
  },
  created () {
    this.optionsLoad()
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .header {
    padding: 30px;
    margin-bottom: 20px;
    height: 120px !important;
    .el-input {
      width: 75%;
      margin-right: 10px;
    }
    .w200 {
      width: 200px;
    }
  }
  .el-dialog__body {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
</style>