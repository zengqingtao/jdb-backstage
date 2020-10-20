<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="4">
          <b>广告宝</b>
        </el-col>
      </el-row>

      <el-row>
        <h4 class="pd-l-20">一键托管</h4>
        <el-col>
          <ve-line :data="shopData" :settings="chartSettings"></ve-line>
        </el-col>
        <el-col>
          <ve-line :data="drainageData" :settings="chartSettings"></ve-line>
        </el-col>
        <el-col>
          <ve-line :data="faddishData" :settings="chartSettings"></ve-line>
        </el-col>
        <el-col>
          <ve-line :data="hotData" :settings="chartSettings"></ve-line>
        </el-col>
        <el-col>
          <ve-line :data="superRecommendData" :settings="chartSettings"></ve-line>
        </el-col>
        <el-col>
          <el-table :data="tableData">
            <el-table-column prop="day" label="日期">
            </el-table-column>
            <el-table-column prop="shop" label="绑定店铺量">
            </el-table-column>
            <el-table-column prop="drainage" label="全品营销发布量">
            </el-table-column>
            <el-table-column prop="faddish" label="精准爆破发布量">
            </el-table-column>
            <el-table-column prop="blastingPut" label="爆款投放发布量">
            </el-table-column>
            <el-table-column prop="superRecommend" label="超级推荐发布量">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

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
import report from 'api/report'
import tableMixins from 'mixins/tableMixins'

export default {
  name: 'ProductGGB',
  mixins: [tableMixins],
  data () {
    return {
      chartSettings: {
        labelMap: {
          shopCount: '绑定店铺数量',
          drainageCount: '全品营销发布量',
          faddishCount: '精准爆破发布量',
          blastingPutCount: '爆款投放发布量',
          superRecommend: '超级推荐发布量',
        }
      },
      shopData: {
        columns: ['day', 'shopCount'],
        rows: []
      },
      drainageData: {
        columns: ['day', 'drainageCount'],
        rows: []
      },
      faddishData: {
        columns: ['day', 'faddishCount'],
        rows: []
      },
      hotData: {
        columns: ['day', 'blastingPutCount'],
        rows: []
      },
      superRecommendData: {
        columns: ['day', 'superRecommend'],
        rows: []
      },
    }
  },
  methods: {
    async pageLoad () {
      const res = await report.getThirtyDayDataAndPage({ page: this.page.pageNo })
      if (res.code === 200) {
        this.tableData = res.data.results
        this.page.pageNo = res.data.pageNo
        this.page.total = res.data.totalCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
    async chartLoad () {
      const res = await report.getThirtyDayData()
      if (res.code === 200) {
        this.shopData.rows = res.data.shopData
        this.drainageData.rows = res.data.drainageData
        this.faddishData.rows = res.data.faddishData
        this.hotData.rows = res.data.blastingPutData
        this.superRecommendData.rows = res.data.superRecommendData
      } else {
        this.shopData.rows = []
        this.drainageData.rows = []
        this.faddishData.rows = []
        this.hotData.rows = []
        this.superRecommendData.rows = []
      }
    },
  },
  created () {
    this.chartLoad()
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .pd-l-20 {
    padding-left: 20px;
  }
</style>
