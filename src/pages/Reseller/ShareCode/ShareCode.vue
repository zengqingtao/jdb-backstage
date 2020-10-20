<template>
    <el-container>
        <el-header class="header">
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6">
                </el-col>
                <el-col :span="7" :offset="5" class="text-right">
                    <el-input v-model="search" placeholder="请输入查询的BD名称" size="small" clearable></el-input>
                    <el-button type="primary" size="small" @click="pageLoad">查询</el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-table :data="tableData">
                <el-table-column prop="id" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="BD名称">
                </el-table-column>
                <el-table-column prop="code" label="推荐码">
                </el-table-column>
                <el-table-column prop="distributorDirector" label="上级主管">
                </el-table-column>
            </el-table>
            <el-row type="flex" class="row-bg" justify="end">
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
    import Reseller from 'api/reseller';

    export default {
        name: "ShareCode",
        data() {
            return {
                search: "",
                tableData: [],
                page: { // 分页数据
                    pageNo: 1,
                    pageSize: 10,
                    total: null
                },
            }
        },
        created() {
            this.pageLoad();
        },
        methods: {
            handleSizeChange(val) {
                this.page.pageSize = val
                this.pageLoad()
            },
            handleCurrentChange(val) {
                this.page.pageNo = val
                this.pageLoad()
            },
            async pageLoad() {
                const res = await Reseller.distributorList({
                    pageNo: this.page.pageNo, pageSize: this.page.pageSize, search: this.search
                });
                if (res.code === 200) {
                    this.tableData = res.data.results;
                    this.page.total = res.data.totalCount;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        padding: 30px;
        margin-bottom: 20px;
        .el-input {
            width: 75%;
            margin-right: 10px;
        }
    }
</style>