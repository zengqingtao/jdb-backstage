<template>
     <el-table :data="tableData" style="width: 100%">
      <el-table-column :key="0" prop="goodsId" label="任务ID" ></el-table-column>
      <el-table-column :key="1" prop="goodsTitle" label="商品名称"></el-table-column>
      <el-table-column :key="2" prop="materialUrl" label="商品链接">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.materialUrl" target="blank">商品链接</el-link>
        </template>
      </el-table-column>
      <el-table-column :key="3" label="商品状态">
        <template slot-scope="scope">
          <span v-html="scope.row.status"></span>
        </template>
      </el-table-column>
      <el-table-column :key="4" label="京东价">
        <template slot-scope="scope">
          <span>￥{{scope.row.goodsPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="5" label="优惠券金额">
        <template slot-scope="scope">
          <span>￥{{scope.row.couponMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="6" label="券后价">
        <template slot-scope="scope">
          <span>￥{{scope.row.discountPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="7" label="优惠券领取数量" prop="gotCount"></el-table-column>
      <el-table-column :key="8" label="券使用数量(商家)" v-if="activeIndex !== '1'">
        <template slot-scope="scope">
          <span>{{scope.row.usedCount == null? `--` : scope.row.usedCount}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="9" label="服务费">
        <template slot-scope="scope">
          <span>{{scope.row.serviceFeeType === 1? `${scope.row.serviceRatio}%` : `￥${scope.row.serviceRatio}`}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="10" label="服务费总额" v-if="activeIndex !== '1'">
        <template slot-scope="scope">
          <span>{{scope.row.serviceMoney == null? `--` : `￥${scope.row.serviceMoney}`}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="11" prop="downTime" label="下架时间"></el-table-column>
      <el-table-column :key="12" label="京店宝账号">
        <template slot-scope="scope">
          <span>{{scope.row.jdbAccount? scope.row.jdbAccount : `--`}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="13" label="商家反馈" v-if="activeIndex === '1'">
        <template slot-scope="scope">
          <span>{{scope.row.merchantFeedback? scope.row.merchantFeedback : `--`}}</span>
        </template>
      </el-table-column>
      <el-table-column :key="14" label="操作" >
        <template slot-scope="scope">
            <el-button type="text" @click="settleVisibleFn(scope.row)" v-if="activeIndex === '1'">处理</el-button>
            <el-button type="text" @click="detailVisibleFn(scope.row)" v-if="activeIndex !== '1' || scope.row.merchantFeedback">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>
<script>
export default {
    props:{
        tableData:{
            require: true,
            type: Array
        },
        activeIndex: {
            type:String,
            required: true
        }
    },
    methods:{
        settleVisibleFn(goods) {
            this.$emit('settleVisibleFn',goods)
        },
        detailVisibleFn(goods) {
            this.$emit('detailVisibleFn', goods)
        }
    }
}
</script>