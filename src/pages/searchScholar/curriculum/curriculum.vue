<!--搜索书生课程-->
<template>
    <div class="curriculum-container">
        <el-button class="addBtn" type="primary" @click="$router.push('/searchScholar/addCurriculum')">添加</el-button>
        <el-table :data="tableData" >
            <el-table-column label="课程id" prop="id"></el-table-column>
            <el-table-column label="课程名称" prop="courseName"></el-table-column>
            <el-table-column label="页面位置" prop="pageLocation"></el-table-column>
            <el-table-column label="页面链接" prop="pageLink"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if="pagination.total>pagination.size"
            :current-page="pagination.page"
            :page-size="pagination.size"
            :total="pagination.total"
            @current-change="changeCurrentPage"
            class="pagination"
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
        this.getCurriculumList()
    },
    methods:{
        getCurriculumList(){
            let params = {
                pageNo:this.pagination.page,
                pageSize:this.pagination.size
            }
            searchScholar.getCurriculumList(params).then(res=>{
                this.pagination.total = res.data.totalCount
                this.tableData = res.data.results
            })
        },
        changeCurrentPage(currentPage){
            this.pagination.page = currentPage
            this.getCurriculumList()
        },
        edit(id){
            this.$router.push({
                path:'/searchScholar/addCurriculum',
                query:{id}
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .curriculum-container{
        padding:30px;
        .addBtn{
            margin-bottom: 20px;
        }
        .pagination{
            text-align: center;
            margin:20px;
        }
    }
</style>