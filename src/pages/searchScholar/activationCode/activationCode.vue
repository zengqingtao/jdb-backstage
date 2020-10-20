<!--激活码-->
<template>
    <div class="activationCode-container">
        <el-button class="createActivationCodeBtn" type="primary" @click="createActiveCode">生成激活码</el-button>
        <el-table :data="tableData" >
            <el-table-column label="生成时间" prop="createTime"></el-table-column>
            <el-table-column label="激活码" prop="activeCode"></el-table-column>
            <el-table-column label="激活时间" prop="activeTime"></el-table-column>
            <el-table-column label="账号" prop="account"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
        </el-table>
        <el-pagination 
            v-if="pagination.total>pagination.size"
            class="pagination"
            :current-page="pagination.page"
            :page-size="pagination.size"
            :total="pagination.total"
            @current-change="changeCurrentPage"
        ></el-pagination>
    </div>
</template>
<script>
import searchScholar from "../../../api/searchScholar"
export default {    
    data(){
        return{
            tableData:[],
            pagination:{
                page:1,
                size:10,
                total:null
            }
        }
    },
    mounted(){
        this.getActiveCodeList()
    },
    methods:{
        createActiveCode(){
            searchScholar.createActiveCode().then(res=>{
                if(res.code===200){
                    this.$message.success("生成成功")
                    this.getActiveCodeList()
                }else{
                    this.$message.error("生成失败")
                }
            })
        },
        getActiveCodeList(){
            let params = {
                pageNo:this.pagination.page,
                pageSize:this.pagination.size
            }
            searchScholar.getActiveCodeList(params).then(res=>{
                if(res.code===200){
                    this.pagination.total = res.data.totalCount
                    this.tableData = res.data.results 
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        changeCurrentPage(currentPage){
            this.pagination.page = currentPage
            this.getActiveCodeList()
        }
    }
}
</script>
<style lang="scss" scoped>
    .activationCode-container{
        padding:30px;
        .createActivationCodeBtn{
            margin-bottom: 20px;
        }
        .pagination{
            text-align: center;
            margin:20px;
        }
    }
</style>