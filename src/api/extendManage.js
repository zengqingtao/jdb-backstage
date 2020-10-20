import http from './http'

export default {
  /**
   * @description 商品推广-获取商品列表
   * @param page: Number 页码
   * @param size: Number 页大小
   */
  listOperationManageGoods: data => {
    return http.get('yushu-operation/operationManage/listOperationManageGoods', data)
  },
  /**
   * @description 商品推广-审核通过
   * @param goodsId: String id
   */
  verifyPass: data => {
    return http.get('yushu-operation/operationManage/verifyPass', data)
  },
  /**
   * @description 商品推广-审核驳回
   * @param goodsId: String id
   * @param reason: String 拒绝原因
   */
  verifyReject: data => {
    return http.get('yushu-operation/operationManage/verifyReject', data)
  },
 /**
   * @description 商品推广-服务费收款
   * @param page: Number 页码
   * @param size: Number 页大小
   * @param status: Number 订单状态 1待处理 2待结算 3已结算
   */
  listSettleOrder: data => {
    return http.get('yushu-operation/operationManage/listSettleOrder', data)
  },
 /**
   * @description 商品推广-提交订单
   * @param id: String 订单id
   * @param usedCount: Number 优惠券使用数量
   * @param file: file 附件
   */
  settleOrder: data => {
    return http.formData('yushu-operation/operationManage/settleOrder', data)
  },
   /**
   * @description 商品推广-下架商品
   * @param goodsId: String 商品id
   */
  downGoods: data => {
    return http.get('yushu-operation/operationManage/downGoods', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
   /**
   * @description 商品推广-将商品设置为爆品
   * @param goodsId: String 商品id
   */
  updateGoodsHot: data => {
    return http.get('yushu-operation/operationManage/updateGoodsHot', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
 /**
   * @description 客户信息-获取列表
   * @param jdbAccount: String 京店宝账号
   * @param qqCode: Number qq号
   * @param size: Number 页大小
   * @param page: Number 页码
   */
  listOperationMerchant: data => {
    return http.get('yushu-operation/operationManage/listOperationMerchant', data)
  },
 /**
   * @description 客户信息-修改客户信息
   * @param contactName: String 客户姓名
   * @param contactPhone: Number 客户电话
   * @param merchantId: Number 客户Id
   * @param qqCode: Number 客户QQ
   * @param wx: String 客户微信
   */
  updateMerchantInfo: data => {
    return http.jsonPost('yushu-operation/operationManage/updateMerchantInfo', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
 /**
   * @description 挑客信息-获取列表
   * @param jdbAccount: String 京店宝账号
   * @param size: Number 页大小
   * @param page: Number 页码
   */
  listOperationPicker: data => {
    return http.get('yushu-operation/operationManage/listOperationPicker', data)
  },
 /**
   * @description 挑客信息-修改客户信息
   * @param contactName: String 客户姓名
   * @param contactPhone: Number 客户电话
   * @param merchantId: Number 客户Id
   * @param qqCode: Number 客户QQ
   * @param wx: String 客户微信
   */
  updatePickerInfo: data => {
    return http.jsonPost('yushu-operation/operationManage/updatePickerInfo', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
}
