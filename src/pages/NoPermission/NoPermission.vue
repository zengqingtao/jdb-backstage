<template>
    <div class="container">
        <i class="iconfont icon-wuquanxian"></i>
        <p>抱歉！您的权限不足，暂无权限访问其他菜单！</p>
    </div>
</template>
<script>
export default {
    created(){
        console.log()
    }
}
</script>
<style lang="scss" scoped>
    .container{
        height:calc(100vh - 230px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .iconfont{
            font-size:150px;
            color:#eee;
        }
        p{
            color:#999;
        }
    }
</style>