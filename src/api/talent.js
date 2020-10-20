import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-25
 * @description 达人审核相关 API
 */

export default {
  /**
   * @desc 购物车修改-获取原订单信息
   * @param int orderId
   */
   getOldCarDetail: data=> {
    return http.get('yushu-operation/talent/getOldCarDetail', data)
  },
  /**
   * @description 通过审核达人信息
   * @param page: Number 当前页码
   * @param name: String 模糊查询关键词
   */
  review: data => {
    return http.get('yushu-operation/talent/review', data)
  },
  /**
   * @description 未审核达人信息
   * @param page: Number 当前页码
   * @param name: String 模糊查询关键词
   */
  noReview: data => {
    return http.get('yushu-operation/talent/noReview', data)
  },
  /**
   * @description 未通过审核达人信息
   * @param page: Number 当前页码
   * @param name: String 模糊查询关键词
   */
  noPassReview: data => {
    return http.get('yushu-operation/talent/NoPassReview', data)
  },
  /**
   * @description 审核通过/未通过
   * @param status: Number 2是通过 3是不通过
   * @param id: String 达人Id
   * @param reason: Sring 拒绝理由
   */
  reviewPass: data => {
    return http.get('yushu-operation/talent/reviewPass', data)
  },
  /**
   * @description 通过退款申请
   * @param id: String 订单ID
   */
  passApply: data => {
    return http.get('yushu-operation/talent/passApply', data)
  },
  /**
   * @description 拒绝退款申请
   * @param id: String 订单ID
   * @param remark: String 拒绝理由
   */
  refuseApply: data => {
    return http.get('yushu-operation/talent/refuseApply', data)
  },
  /**
   * @description 获取退款申请列表
   * @param page: Number 页码
   * @param status: String 状态 0未审核 1审核成功 2 审核失败
   */
  listApplyRefund: data => {
    return http.get('yushu-operation/talent/listApplyRefund', data)
  },
  /**
   * @description 获取文章列表
   * @param orderId: Number 订单ID
   * @param page: Number 页码
   * @param type: Number 状态 1 审核中 2审核通过
   */
  listDarenArticle: data => {
    return http.get('yushu-operation/talent/listDarenArticle', data)
  },
  /**
   * @description 获取统计列表
   * @param page: Number 页码
   */
  listDailyCount: data => {
    return http.get('yushu-operation/talent/listDailyCount', data)
  },
  /**
   * @description 获取30天折线图
   */
  getConsume30DaysDailyCount: data => {
    return http.get('yushu-operation/talent/getConsume30DaysDailyCount', data)
  },
  /**
   * @description 添加备注与发布须知
   * @param remark: String 备注
   * @param notice: String 发布须知
   */
  addRemarks: data => {
    return http.get('yushu-operation/talent/addRemarks', data)
  },
  /**
   * @description 获取备注和发布须知
   */
  getRemark: data => {
    return http.get('yushu-operation/talent/getRemark', data)
  },
  /**
   * @description 添加、编辑 自定义套餐
   * @param id: Number 修改Id
   * @param name: String 渠道
   * @param content: String 内容
   * @param restrict: String 品类限定
   * @param price: Number 单价
   * @param productNumber: Number 产品数
   * @param direction: String 渠道方向
   * @param period: String 展示周期
   * @param list: Array 关联类目
   */
  addPackage: data => {
    return http.jsonPost('yushu-operation/talent/addPackage', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 关联类目列表
   */
  listCategory: data => {
    return http.get('yushu-operation/talent/listCategory', data)
  },
  /**
   * @description 修改自定义套餐上架、下架、删除
   * @param id: Number 需要修改数据id
   * @param type: Number 0删除 1上架 2下架
   */
  changeCustomPackage: data => {
    return http.get('yushu-operation/talent/changeCustomPackage', data)
  },
  /**
   * @description 自定义套餐列表
   * @param page: Number 页码 默认1
   * @param size: Number 页码 每页数据大小 默认10
   * @param search: String 模糊搜索渠道名称
   */
  listPackage: data => {
    return http.get('yushu-operation/talent/listPackage', data)
  },
  /**
   * @description 获取某个自定义套餐的类目
   * @param id: Number 记录id
   */
  categoryById: data => {
    return http.get('yushu-operation/talent/categoryById', data)
  },
  /**
   * @description 上传自定义套餐
   * @param file: MultipartFile 文件
   */
  readFile: 'yushu-operation/talent/readFile',
}
