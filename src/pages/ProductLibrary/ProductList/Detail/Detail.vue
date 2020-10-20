<template>
  <div style="paddingTop:30px">
    <el-form label-width="200px">
      <el-form-item :label="`${labelObj[item.key]}：`" v-for="item in goodArr" :key="item.key">
        <span>{{getTableValue(item.key,item.value)}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import productLibrary from "api/productLibrary";
import untils from '@/assets/js/untils'
export default {
  name: "goodsDeatil",
  data() {
    return {
      goods: {},
      labelObj:{
        'goodsTitle' : '商品标题',
        'goodsUrl' : '商品链接',
        'price' : '价格',
        'brand' : '品牌',
        'fifteenDaySale' : '近15天销量',
        'thirtyDaySale' : '近30天销量',
        'sixtyDaySale' : '近60天销量',
        'ninetyDaySale' : '近90天销量',
        'firstCategory' : '一级类目',
        'secondCategory' : '二级类目',
        'thirdCategory' : '三级类目',
        'isSelfShop' : '店铺类型',
        'shopName' : '店铺名称',
        'shopUrl' : '店铺链接',
        'skuAdd' : 'SKU追评',
        'skuAll' : 'SKU全部评价',
        'skuBad' : 'SKU差评',
        'skuGeneral' : 'SKU中评',
        'skuGood' : 'SKU好评',
        'skuGoodRate' : 'SKU好评度',
        'skuPicture' : 'SKU晒图',
        'skuVideo' : 'SKU视频晒单',
        'skuVideo' : 'SKU视频晒单',
        'spuAdd' : 'SPU追评',
        'spuAll' : 'SPU全部评价',
        'spuBad' : 'SPU差评',
        'spuGeneral' : 'SPU中评',
        'spuGood' : 'SPU好评',
        'spuGoodRate' : 'SPU好评度',
        'spuPicture' : 'SPU晒图',
        'spuVideo' : 'SPU视频晒单',
        'updateTime' : '更新时间',
        'totalCount' : '总记录数',
      },
    };
  },
  created() {
    this.getGoodsDetail()
  },  
  computed: {
      goodArr() {
        return Object.keys(this.goods).map(key => {
              return {key: key, value: this.goods[key]}
          }).filter(item => item.key !== 'id')
      }
  },
  methods: {
      async getGoodsDetail() {
          const {data, code ,msg} = await productLibrary.getGoodsDetail({goodsId: this.$route.query.id})
          if(code == 200) {
              this.goods = data
          } else {
              this.goods = {}
              this.$message.error(msg)
          }
      },
      getTableValue(key, val) {
        const isSelfShopObj = { 0: 'POP', 1: '京东自营'}
        if(key === 'isSelfShop') {
          return isSelfShopObj[val]
        } else if(key === 'updateTime') {
          return this.timeFormat(val)
        } else if(['spuGoodRate','skuGoodRate'].includes(key)) {
          return `${val}%`
        } else if(key === 'price') {
          return `￥${val}`
        } else {
          return val
        }
      },
      timeFormat(val) {
        return untils.formatTime(val)
      }
  }
};
</script>