<template>
  <el-container>
    <el-main>
       <el-row>
        <el-col :span="4">
          <b>插件下载总量：{{downloadTotalCount}}</b>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <ve-line :data="downloadChartData" :settings="downloadChartSettings"></ve-line>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <b>插件使用人数：{{useTotalCount}}</b>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <ve-line :data="useChartData" :settings="useChartSettings"></ve-line>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import report from "api/report";

export default {
  name: "ProductPlug",
  data() {
    this.useChartSettings = {
      labelMap: {
        count: '使用人数',
      }
    }
    this.downloadChartSettings = {
      labelMap: {
        count: '下载量',
      }
    }
    return {
      useTotalCount:'',
      useChartData: {
        columns: ['date', 'count'],
        rows: []
      },
      downloadTotalCount: '',
      downloadChartData: {
        columns: ['date', 'count'],
        rows: []
      },
    };
  },
  methods: {
    async getPluginUseCount(){
      let {data, code , msg} = await report.getPluginUseCount()
      if (code === 200) {
        this.useTotalCount = data.totalCount
        this.useChartData.rows = data.list
      } else {
        this.$message.error(msg)
      }
    },
    async PluginDownloadCount(){
      let {data, code , msg} = await report.PluginDownloadCount()
      if (code === 200) {
        this.downloadTotalCount = data.totalCount
        this.downloadChartData.rows = data.downloadCounts
      } else {
        this.$message.error(msg)
      }
    }
  },
  created() {
    this.getPluginUseCount()
    this.PluginDownloadCount()
  }
};
</script>

