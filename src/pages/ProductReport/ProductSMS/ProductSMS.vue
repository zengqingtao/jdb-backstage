<template>
  <el-container>
    <el-main>
      <ve-line :data="chartData" :settings="chartSettings"></ve-line>
      <el-table :data="tableData">
        <el-table-column prop="date" label="日期">
        </el-table-column>
        <el-table-column prop="sendNumber" label="短信发送量">
        </el-table-column>
        <el-table-column prop="successNumber" label="发送成功量">
        </el-table-column>
        <el-table-column prop="rate" label="发送成功率">
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            layout="total, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import tableMixin from 'mixins/tableMixins'
import report from 'api/report'

export default {
  name: 'ProductSMS',
  mixins: [tableMixin],
  data () {
    return {
      chartSettings: {
        labelMap: {
          sendNumber: '短信发送量',
          successNumber: '发送成功量'
        }
      },
      chartData: {
        columns: ['date', 'sendNumber', 'successNumber'],
        rows: []
      }
    }
  },
  methods: {
    async pageLoad () {
      const { code, data, page, allCount } = await report.listSummary({ page: this.page.pageNo })
      this.tableData = code === 200 ? data : []
      this.page.pageNo = code === 200 ? page : 1
      this.page.total = code === 200 ? allCount : null
    },
    async chartDataLoad () {
      const { code, data } = await report.listSummary15()
      this.chartData.rows = code === 200 ? data.reverse() : []
    }
  },
  created() {
    this.chartDataLoad()
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>

</style>
