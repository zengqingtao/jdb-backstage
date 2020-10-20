<template>
  <el-container>
    <el-main class="main">
        <el-tabs v-model="activeIndex" type="card">
            <el-tab-pane label="京店宝" name="1"></el-tab-pane>
            <el-tab-pane label="人气宝" name="3"></el-tab-pane>
            <el-tab-pane label="流量集市" name="2"></el-tab-pane>
            <el-tab-pane label="京礼金" name="4"></el-tab-pane>
        </el-tabs>
        <template>
            <el-table :data="mangaeTableData" style="width: 100%" >
                <el-table-column prop="productName" label="产品"></el-table-column>
                <el-table-column prop="locationName" label="页面位置"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toAdsList(scope.row.location,activeIndex)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </el-main>
  </el-container>
</template>
<script>
export default {
    name:'Advertisement',
    data() {
        return {
            activeIndex:'1',
            mangaeTableData:[],
        }
    },
    watch: {
        activeIndex:{
            immediate: true,
            handler(val) {
                this.getlocationOptions(val)
            }
        },
    },
    methods: {
        getlocationOptions(val) {
            const JDB = '1'
            const JKJS = '2'
            const RQB = '3'
            const JLJ = '4'
            const actions = {
                [JDB]:() => {
                    this.mangaeTableData = [
                        {
                            location:9,
                            locationName: '首页上方广告',
                            productName:'京店宝'
                        },
                        {
                            location:2,
                            locationName: '首页下方广告',
                            productName:'京店宝'
                        }
                    ]
                }, 
                [JKJS]: () => {
                    this.mangaeTableData = [
                        {
                            location:3,
                            locationName: '首页广告',
                            productName:'流量集市'
                        },
                        {
                            location:4,
                            locationName: '内容营销',
                            productName:'流量集市'
                        },
                        {
                            location:5,
                            locationName: '抖音营销',
                            productName:'流量集市'
                        }
                    ]
                },
                [RQB]: ()=> {
                    this.mangaeTableData = [
                        {
                            location:6,
                            locationName: '首页广告',
                            productName:'人气宝'
                        },
                        {
                            location:7,
                            locationName: '充值中心',
                            productName:'人气宝'
                        },
                        {
                            location:8,
                            locationName: '消费明细',
                            productName:'人气宝'
                        },
                        {
                            location:10,
                            locationName: '任务记录',
                            productName:'人气宝'
                        }
                    ]
                },
                [JLJ]:()=>{
                    this.mangaeTableData = [
                        {
                            location:12,
                            locationName:'案例1',
                            productName:'京礼金'
                        },
                        {
                            location:13,
                            locationName:'案例2',
                            productName:'京礼金'
                        },
                        {
                            location:14,
                            locationName:'案例3',
                            productName:'京礼金'
                        },
                    ]
                }
            }
            actions[val]()
        },
        toAdsList(location,productCode) {
            this.$router.push( {path:'/FeedBack/advertisemenList', query: {location,productCode}})
        },
    }
};
</script>
<style lang="scss" scoped>
.row-bg {
  padding: 15px 0;
}
</style>