import http from './http'

export default {
  /**
   * @description 产品库获取店铺列表
   * @param jdbAccount: String 京店宝账号
   * @param page: Number 当前页
   * @param size: Number 一页数量
   * @param shopName: String 店铺名
   * @param isSelfShop: Number 是否自营 1自营 2pop
   */
  listShop: data => {
    return http.get('yushu-operation/product/listShop', data)
  },
  /**
   * @description 产品库获取商品列表
   * @param jdbAccount: String 京店宝账号
   * @param page: Number 当前页
   * @param size: Number 一页数量
   * @param shopName: String 店铺名
   * @param start: String 开始价格
   * @param end: String 结束价格
   */
  listGoods: data => {
    return http.jsonPost('yushu-operation/product/listGoods', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 产品库获取类目
   */
  getCategory: data => {
    return http.get('yushu-operation/product/getCategory', data)
  },
  /**
   * @description 产品库获取商品详情
   * @param goodsId: String 商品ID
   */
  getGoodsDetail: data => {
    return http.get('yushu-operation/product/getGoodsDetail', data)
  },
}